import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { chatId, title } = await req.json();
    if (!chatId || !title?.trim())
      return NextResponse.json({ error: "chatId and title required" }, { status: 400 });

    // Convert chatId to ObjectId
    let _id: ObjectId;
    try {
      _id = new ObjectId(chatId);
    } catch {
      return NextResponse.json({ error: "Invalid chatId format" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("myapp");
    const sessionsCollection = db.collection("chat_sessions");

    const result = await sessionsCollection.updateOne(
      { _id, email: session.user.email },
      { $set: { title: title.trim(), updatedAt: new Date() } }
    );

    if (result.matchedCount === 0)
      return NextResponse.json({ error: "Session not found" }, { status: 404 });

    return NextResponse.json({ success: true, title: title.trim() });
  } catch (err) {
    console.error("Rename error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
