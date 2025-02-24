"use client";

import { useState } from "react";

export default function Home() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const [token, setToken] = useState("");
	const [message, setMessage] = useState("");
	const [isRegistering, setIsRegistering] = useState(false);

	// Register a new user
	const handleRegister = async (e) => {
		e.preventDefault();
		setMessage("");

		const res = await fetch("/api/auth/register", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password, name }),
		});

		const data = await res.json();
		if (res.ok) {
			setMessage("Registration successful! Please log in.");
			setIsRegistering(false);
		} else {
			setMessage(data.error || "Registration failed.");
		}
	};

	// Log in an existing user
	const handleLogin = async (e) => {
		e.preventDefault();
		setMessage("");

		const res = await fetch("/api/auth/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});

		const data = await res.json();
		if (res.ok) {
			setToken(data.token);
			setMessage("Login successful!");
		} else {
			setMessage(data.error || "Login failed.");
		}
	};

	// Access protected route
	const handleProtectedRequest = async () => {
		const res = await fetch("/api/protected", {
			headers: { Authorization: `Bearer ${token}` },
		});

		const data = await res.json();
		alert(JSON.stringify(data));
	};

	return (
		<div style={{ textAlign: "center", maxWidth: "400px", margin: "auto", paddingTop: "50px" }}>
			<h1>{isRegistering ? "Register" : "Login"}</h1>

			<form onSubmit={isRegistering ? handleRegister : handleLogin}>
				{isRegistering && (
					<input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
				)}
				<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
				<input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
				<button type="submit">{isRegistering ? "Sign Up" : "Sign In"}</button>
			</form>

			<p style={{ color: "red" }}>{message}</p>

			{!isRegistering ? (
				<p>
					Dont have an account?{" "}
					<button onClick={() => setIsRegistering(true)}>Register</button>
				</p>
			) : (
				<p>
					Already have an account?{" "}
					<button onClick={() => setIsRegistering(false)}>Login</button>
				</p>
			)}

			{token && <button onClick={handleProtectedRequest}>Access Protected Route</button>}
		</div>
	);
}
