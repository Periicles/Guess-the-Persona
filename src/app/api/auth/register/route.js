import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
	try {
		const { email, password, name } = await req.json();

		if (!email || !password) return new Response(JSON.stringify({ error: "Email and password required" }), { status: 400 });

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) return new Response(JSON.stringify({ error: "User already exists" }), { status: 400 });

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await prisma.user.create({
			data: { email, password: hashedPassword, name },
		});

		return new Response(JSON.stringify({ message: "User registered", user }), { status: 201 });
	} catch (error) {
		console.error("Register error:", error);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
	}
}
