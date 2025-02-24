"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleRegister = async (e) => {
		e.preventDefault();
		setMessage("");
		setIsLoading(true);

		try {
			const res = await fetch("/api/auth/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, email, password }),
			});

			const data = await res.json();

			if (res.ok) {
				setMessage("Registration successful! Please log in.");
				router.push("/login"); // Redirect to login after successful registration
			} else {
				setMessage(data.error || "Registration failed.");
			}
		} catch (error) {
			console.error("Registration error:", error);
			setMessage("An error occurred. Please try again.");
		}

		setIsLoading(false);
	};

	return (
		<div style={{ textAlign: "center", maxWidth: "400px", margin: "auto", paddingTop: "50px" }}>
			<h1>Register</h1>

			<form onSubmit={handleRegister}>
				<input
					type="text"
					placeholder="Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
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
					{isLoading ? "Registering..." : "Register"}
				</button>
			</form>

			<p style={{ color: "red" }}>{message}</p>

			<p>
				Already have an account?{" "}
				<a href="/login" style={{ color: "blue" }}>
					Login here
				</a>
			</p>
		</div>
	);
}
