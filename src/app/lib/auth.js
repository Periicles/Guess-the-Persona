import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export function authenticate(req) {
	const authHeader = req.headers.get("authorization");
	if (!authHeader) {
		return null;
	}
	const token = authHeader.split(" ")[1];

	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
}
