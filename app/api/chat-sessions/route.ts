import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const CHAT_EXPIRY_DAYS = 7;

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json([], { status: 200 });

  const client = await clientPromise;
  const db = client.db("myapp");
  const sessionsCollection = db.collection("chat_sessions");

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
    .toArray();

  return NextResponse.json(
    sessions.map(s => ({
      id: s._id.toHexString(),
      title: s.title,
      lastMessage: s.lastMessage,
      messageCount: s.messageCount,
      updatedAt: s.updatedAt,
    }))
  );
}
