import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    console.log("users", users);
    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("error", error);
    return new Response("Error fetching users", { status: 500 });
  }
}
