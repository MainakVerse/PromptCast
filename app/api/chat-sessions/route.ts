// app/api/chat-sessions/route.ts
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const MAX_CHATS_PER_USER = 5;

interface ChatSession {
  _id: ObjectId;
  email: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("myapp");
    const sessionsCollection = db.collection<ChatSession>("chat_sessions");
    
    const sessions = await sessionsCollection
      .find({ email: session.user.email })
      .sort({ updatedAt: -1 })
      .limit(MAX_CHATS_PER_USER)
      .toArray();

    const formattedSessions = sessions.map(session => ({
      id: session._id.toString(),
      title: session.title || "New Chat",
      lastMessage: session.lastMessage || "",
      timestamp: getRelativeTime(session.updatedAt || session.createdAt),
      messageCount: session.messageCount || 0
    }));

    return NextResponse.json(formattedSessions);
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    return NextResponse.json({ error: "Failed to fetch chat sessions" }, { status: 500 });
  }
}

// Helper function to get relative time
function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}