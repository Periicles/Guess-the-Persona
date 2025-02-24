import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) return new Response(JSON.stringify({ error: "Missing email or password" }), { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 400 });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return new Response(JSON.stringify({ error: "Invalid password" }), { status: 400 });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    return new Response(JSON.stringify({ message: "Login successful", token }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
