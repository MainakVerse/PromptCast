import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("myapp");
    const collections = await db.listCollections().toArray();

    return new Response(
      JSON.stringify({ ok: true, collections }),
      { status: 200 }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
