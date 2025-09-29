import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { chatId } = await req.json();
    if (!chatId) return NextResponse.json({ error: "chatId required" }, { status: 400 });

    const _id = new ObjectId(chatId); // Convert string → ObjectId

    const client = await clientPromise;
    const db = client.db("myapp");
    const sessionsCollection = db.collection("chat_sessions");
    const chatsCollection = db.collection("chats");

    const deleteResult = await sessionsCollection.deleteOne({ _id, email: session.user.email });
    if (deleteResult.deletedCount === 0)
      return NextResponse.json({ error: "Session not found" }, { status: 404 });

    await chatsCollection.deleteMany({ sessionId: _id, email: session.user.email });

    console.log("Deleted chat", _id.toHexString());

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting chat:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
