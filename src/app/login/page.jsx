"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async (e) => {
		e.preventDefault();
		setMessage("");
		setIsLoading(true);

		try {
			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();

			if (res.ok) {
				localStorage.setItem("token", data.token);
				setMessage("Login successful!");
				router.push("/chatbox");
			} else {
				setMessage(data.error || "Login failed.");
			}
		} catch (error) {
			console.error("Login error:", error);
			setMessage("An error occurred. Please try again.");
		}

		setIsLoading(false);
	};

	return (
		<div style={{ textAlign: "center", maxWidth: "400px", margin: "auto", paddingTop: "50px" }}>
			<h1>Login</h1>

			<form onSubmit={handleLogin}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit" disabled={isLoading}>
					{isLoading ? "Logging in..." : "Login"}
				</button>
			</form>

			<p style={{ color: "red" }}>{message}</p>

			<p>
				Don't have an account?{" "}
				<a href="/register" style={{ color: "blue" }}>
					Register here
				</a>
			</p>
		</div>
	);
}
