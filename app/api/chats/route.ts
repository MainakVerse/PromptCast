// app/api/chats/route.ts
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

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

// Helper: generate title from prompt
function generateChatTitle(message: string): string {
  const stopWords = [
    "what", "how", "when", "where", "why", "who", "which",
    "the", "and", "but", "for", "with", "a", "an", "is", "are", "can",
    "could", "would", "should"
  ];
  const words = message
    .toLowerCase()
    .split(" ")
    .filter(word => word.length > 3 && !stopWords.includes(word) && /^[a-zA-Z]+$/.test(word));
  let title = words.slice(0, 4).join(" ");
  return title.replace(/\b\w/g, c => c.toUpperCase()).substring(0, 35) || "New Conversation";
}

// GET: Fetch chat messages for a specific session
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("myapp");
    const chatsCollection = db.collection<ChatMessage>("chats");
    const sessionsCollection = db.collection<ChatSession>("chat_sessions");

    // Check if session exists
    const sessionExists = await sessionsCollection.findOne({ 
      _id: new ObjectId(sessionId), 
      email: session.user.email 
    });

    if (!sessionExists) {
      // Return empty array for non-existent sessions instead of error
      return NextResponse.json([]);
    }

    const messages = await chatsCollection
      .find({ 
        email: session.user.email, 
        sessionId: new ObjectId(sessionId) 
      })
      .sort({ createdAt: 1 })
      .toArray();

    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      message: msg.message,
      createdAt: msg.createdAt.toISOString()
    }));

    return NextResponse.json(formattedMessages);
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    return NextResponse.json({ error: "Failed to fetch chat messages" }, { status: 500 });
  }
}

// POST: Send a new message
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { prompt, sessionId: sessionIdStr } = await req.json();
    
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("myapp");
    const chatsCollection = db.collection<ChatMessage>("chats");
    const sessionsCollection = db.collection<ChatSession>("chat_sessions");
    const userEmail = session.user.email;

    let sessionId: ObjectId;
    let generatedTitle: string | null = null;
    let isNewSession = false;

    // Handle session creation or retrieval
    if (sessionIdStr) {
      sessionId = new ObjectId(sessionIdStr);
      const existingSession = await sessionsCollection.findOne({ 
        _id: sessionId, 
        email: userEmail 
      });
      
      if (!existingSession) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }
    } else {
      // Create new session
      sessionId = new ObjectId();
      generatedTitle = generateChatTitle(prompt);
      isNewSession = true;
      
      await sessionsCollection.insertOne({
        _id: sessionId,
        email: userEmail,
        title: generatedTitle,
        lastMessage: "",
        messageCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Get conversation history for context (last 10 messages)
    const previousChats = await chatsCollection
      .find({ email: userEmail, sessionId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    const conversationHistory = previousChats
      .reverse()
      .map(chat => (chat.role === "user" ? `User: ${chat.message}` : `Assistant: ${chat.message}`))
      .join("\n");

    const fullPrompt = conversationHistory 
      ? `${conversationHistory}\nUser: ${prompt}\nAssistant: `
      : `User: ${prompt}\nAssistant: `;

    // Call Gemini API
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not set");
    }

    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { 
            temperature: 0.9, 
            topK: 1, 
            topP: 1, 
            maxOutputTokens: 300 
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      }
    );

    const aiData = await apiRes.json();
    const aiMessage = aiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || 
                     "Sorry, I couldn't generate a response.";

    // Save both user and AI messages
    await chatsCollection.insertMany([
      { 
        email: userEmail, 
        sessionId, 
        role: "user" as const, 
        message: prompt, 
        createdAt: new Date() 
      },
      { 
        email: userEmail, 
        sessionId, 
        role: "ai" as const, 
        message: aiMessage, 
        createdAt: new Date() 
      },
    ]);

    // Update session with latest message and count
    await sessionsCollection.updateOne(
      { _id: sessionId },
      { 
        $set: { 
          lastMessage: aiMessage, 
          updatedAt: new Date() 
        }, 
        $inc: { messageCount: 2 } 
      }
    );

    // Clean up old messages (keep only last 20 messages per session)
    const messageCount = await chatsCollection.countDocuments({ 
      email: userEmail, 
      sessionId 
    });
    
    if (messageCount > 20) {
      const messagesToDelete = await chatsCollection
        .find({ email: userEmail, sessionId })
        .sort({ createdAt: 1 })
        .limit(messageCount - 20)
        .toArray();

      if (messagesToDelete.length > 0) {
        await chatsCollection.deleteMany({ 
          _id: { $in: messagesToDelete.map(m => m._id) } 
        });
      }
    }

    // Clean up old sessions (keep only last 5 sessions)
    const userSessions = await sessionsCollection
      .find({ email: userEmail })
      .sort({ updatedAt: -1 })
      .toArray();

    if (userSessions.length > 5) {
      const sessionsToDelete = userSessions.slice(5);
      const sessionIdsToDelete = sessionsToDelete.map(s => s._id);
      
      // Delete old sessions and their messages
      await Promise.all([
        sessionsCollection.deleteMany({ _id: { $in: sessionIdsToDelete } }),
        chatsCollection.deleteMany({ sessionId: { $in: sessionIdsToDelete } })
      ]);
    }

    return NextResponse.json({
      response: aiMessage,
      sessionId: sessionId.toHexString(),
      generatedTitle: isNewSession ? generatedTitle : null,
    });

  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process message" }, 
      { status: 500 }
    );
  }
}