import { authenticate } from "@/app/lib/auth";

export async function GET(req) {
	const user = authenticate(req);
	if (!user) {
		return new Response(
			JSON.stringify({ error: "Unauthorized" }), { status: 401 });
		}

	return new Response(
		JSON.stringify({ message: "Protected content", user }), { status: 200 }
	);
}
