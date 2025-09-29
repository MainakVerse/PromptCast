// app/api/chats/route.ts
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const CHAT_EXPIRY_DAYS = 7;

interface ChatMessage {
  _id?: ObjectId;
  sessionId: ObjectId;
  email: string;
  role: "user" | "ai";
  message: string;
  createdAt: Date;
}

interface ChatSession {
  _id: ObjectId;
  email: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Helper: generate title
function generateChatTitle(message: string): string {
  const stopWords = [
    "what","how","when","where","why","who","which",
    "the","and","but","for","with","a","an","is","are","can",
    "could","would","should"
  ];
  const words = message
    .toLowerCase()
    .split(" ")
    .filter(word => word.length > 3 && !stopWords.includes(word) && /^[a-zA-Z]+$/.test(word));
  let title = words.slice(0,4).join(" ");
  return title.replace(/\b\w/g, c => c.toUpperCase()).substring(0,35) || "New Conversation";
}

// POST: send message
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt } = await req.json();
  if (!prompt) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("myapp");
  const chatsCollection = db.collection<ChatMessage>("chats");
  const sessionsCollection = db.collection<ChatSession>("chat_sessions");
  const userEmail = session.user.email;

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - CHAT_EXPIRY_DAYS);

  await chatsCollection.deleteMany({ email: userEmail, createdAt: { $lt: expirationDate } });
  await sessionsCollection.deleteMany({ email: userEmail, updatedAt: { $lt: expirationDate } });

  // Get latest session or create new
  let latestSession = await sessionsCollection
    .find({ email: userEmail })
    .sort({ updatedAt: -1 })
    .limit(1)
    .toArray();

  let sessionId: ObjectId;
  let generatedTitle: string | null = null;

  if (!latestSession.length) {
    sessionId = new ObjectId();
    generatedTitle = generateChatTitle(prompt);

    await sessionsCollection.insertOne({
      _id: sessionId,
      email: userEmail,
      title: generatedTitle,
      lastMessage: prompt,
      messageCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  } else {
    sessionId = latestSession[0]._id;
  }

  // Fetch last 10 messages for context
  const previousChats = await chatsCollection
    .find({ email: userEmail, sessionId })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray();

  const conversationHistory = previousChats
    .reverse()
    .map(chat => (chat.role === "user" ? `User: ${chat.message}` : `Assistant: ${chat.message}`))
    .join("\n") + `\nUser: ${prompt}\nAssistant: `;

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
  const aiMessage = aiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 
                    "Sorry, I couldn't generate a response.";

  await chatsCollection.insertMany([
    { email: userEmail, sessionId, role: "user", message: prompt, createdAt: new Date() },
    { email: userEmail, sessionId, role: "ai", message: aiMessage, createdAt: new Date() },
  ]);

  await sessionsCollection.updateOne(
    { _id: sessionId },
    { $set: { lastMessage: aiMessage, updatedAt: new Date() }, $inc: { messageCount: 2 } }
  );

  return NextResponse.json({
    response: aiMessage,
    generatedTitle,
    sessionId: sessionId.toHexString(),
    lastMessage: aiMessage,
    updatedAt: new Date(),
  });
}

// GET: fetch messages for latest session
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json([], { status: 200 });

  const client = await clientPromise;
  const db = client.db("myapp");
  const chatsCollection = db.collection<ChatMessage>("chats");
  const sessionsCollection = db.collection<ChatSession>("chat_sessions");

  const latestSession = await sessionsCollection
    .find({ email: session.user.email })
    .sort({ updatedAt: -1 })
    .limit(1)
    .toArray();

  if (!latestSession.length) return NextResponse.json([]);

  const sessionId = latestSession[0]._id;

  const chats = await chatsCollection
    .find({ email: session.user.email, sessionId })
    .sort({ createdAt: 1 })
    .toArray();

  return NextResponse.json(chats);
}
