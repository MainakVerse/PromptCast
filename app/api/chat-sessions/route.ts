// app/api/chat-sessions/route.ts
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const MAX_CHATS_PER_USER = 10;
const CHAT_EXPIRY_DAYS = 7;

interface ChatSession {
  _id: string;
  email: string;
  title: string;
  lastMessage: string;
  messageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("myapp");
  const sessionsCollection = db.collection<ChatSession>("chat_sessions");

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() - CHAT_EXPIRY_DAYS);

  // Delete expired sessions
  await sessionsCollection.deleteMany({
    email: session.user.email,
    updatedAt: { $lt: expiryDate },
  });

  const sessions = await sessionsCollection
    .find({ email: session.user.email })
    .sort({ updatedAt: -1 })
    .limit(MAX_CHATS_PER_USER)
    .toArray();

  return NextResponse.json(
    sessions.map(s => ({
      id: s._id,
      title: s.title,
      lastMessage: s.lastMessage,
      timestamp: s.updatedAt.toLocaleString(),
      messageCount: s.messageCount,
    }))
  );
}

export async function PATCH(req: NextRequest, { params }: { params: { chatId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chatId } = params;
  const { title } = await req.json();
  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("myapp");
  const sessionsCollection = db.collection<ChatSession>("chat_sessions");

  const result = await sessionsCollection.updateOne(
    { _id: chatId, email: session.user.email },
    { $set: { title: title.trim(), updatedAt: new Date() } }
  );

  if (result.matchedCount === 0) return NextResponse.json({ error: "Session not found" }, { status: 404 });
  return NextResponse.json({ success: true, title: title.trim() });
}

export async function DELETE(req: NextRequest, { params }: { params: { chatId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { chatId } = params;
  const client = await clientPromise;
  const db = client.db("myapp");
  const sessionsCollection = db.collection<ChatSession>("chat_sessions");
  const chatsCollection = db.collection("chats");

  const deleteResult = await sessionsCollection.deleteOne({ _id: chatId, email: session.user.email });
  if (deleteResult.deletedCount === 0) return NextResponse.json({ error: "Session not found" }, { status: 404 });

  await chatsCollection.deleteMany({ sessionId: chatId, email: session.user.email });
  return NextResponse.json({ success: true });
}
