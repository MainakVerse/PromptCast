import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// app/api/cleanup-chats/route.ts
export async function GET() {
  const client = await clientPromise;
  const db = client.db("myapp");
  const chatsCollection = db.collection("chats");
  const sessionsCollection = db.collection("chat_sessions");

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - 7);

  await chatsCollection.deleteMany({ createdAt: { $lt: expirationDate } });
  await sessionsCollection.deleteMany({ updatedAt: { $lt: expirationDate } });

  return NextResponse.json({ success: true });
}
