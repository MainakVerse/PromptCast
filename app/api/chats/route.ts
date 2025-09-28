// app/api/chats/route.ts
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const MAX_CHATS_PER_USER = 10;
const EXPIRATION_DAYS = 7;

function generateChatTitle(message: string): string {
  const stopWords = ['what','how','when','where','why','who','which','the','and','but','for','with','a','an','is','are','can','could','would','should'];
  const words = message
    .toLowerCase()
    .split(' ')
    .filter(word => word.length > 3 && !stopWords.includes(word) && /^[a-zA-Z]+$/.test(word));
  let title = words.slice(0,4).join(' ');
  title = title.replace(/\b\w/g, c => c.toUpperCase());
  return title.substring(0,35) || 'New Conversation';
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt, sessionId, isFirstMessage } = await req.json();
  if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("myapp");
  const chatsCollection = db.collection("chats");
  const sessionsCollection = db.collection("chat_sessions");
  const userEmail = session.user.email;

  // Cleanup expired chats & sessions
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - EXPIRATION_DAYS);
  await chatsCollection.deleteMany({ email: userEmail, createdAt: { $lt: expirationDate } });
  await sessionsCollection.deleteMany({ email: userEmail, updatedAt: { $lt: expirationDate } });

  // Check user's active chat sessions
  const userSessions = await sessionsCollection.find({ email: userEmail }).sort({ updatedAt: -1 }).toArray();
  if (!sessionId && userSessions.length >= MAX_CHATS_PER_USER) {
    return NextResponse.json({ error: "Max 10 chats allowed for free tier. Delete old chats to continue." }, { status: 429 });
  }

  const currentSessionId = sessionId || new Date().getTime().toString();
  let generatedTitle: string | null = null;

  // Create new session if needed
  if (!sessionId) {
    generatedTitle = generateChatTitle(prompt);
    await sessionsCollection.insertOne({
      _id: currentSessionId,
      email: userEmail,
      title: generatedTitle,
      lastMessage: prompt,
      messageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Fetch last 10 messages for context
  const previousChats = await chatsCollection
    .find({ email: userEmail, sessionId: currentSessionId })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  const conversationHistory = previousChats.reverse().map(chat =>
    chat.role === "user" ? `User: ${chat.message}` : `Assistant: ${chat.message}`
  ).join("\n") + `\nUser: ${prompt}\nAssistant: `;

  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not set");

  const apiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: conversationHistory.trim() || prompt }] }],
        generationConfig: { temperature: 0.9, topK: 1, topP: 1, maxOutputTokens: 300 },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ]
      })
    }
  );

  const aiData = await apiRes.json();
  const aiMessage = aiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Sorry, I couldn't generate a response.";

  // Save both messages
  await chatsCollection.insertMany([
    { email: userEmail, sessionId: currentSessionId, role: "user", message: prompt, createdAt: new Date() },
    { email: userEmail, sessionId: currentSessionId, role: "ai", message: aiMessage, createdAt: new Date() },
  ]);

  // Update session with AI lastMessage
  await sessionsCollection.updateOne(
    { _id: currentSessionId },
    { $set: { lastMessage: aiMessage, updatedAt: new Date() }, $inc: { messageCount: 2 } }
  );

  return NextResponse.json({
    response: aiMessage,
    generatedTitle,
    sessionId: currentSessionId,
    lastMessage: aiMessage,
    updatedAt: new Date(),
  });
}

// GET: fetch messages
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('sessionId');

  const client = await clientPromise;
  const db = client.db("myapp");
  const chatsCollection = db.collection("chats");

  const query: any = { email: session.user.email };
  if (sessionId) query.sessionId = sessionId;

  const chats = await chatsCollection.find(query).sort({ createdAt: 1 }).toArray();
  return NextResponse.json(chats);
}
