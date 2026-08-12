import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Auth() {
    const [mode, setMode] = useState("register");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const isRegister = mode === "register";

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setMessage("");

        // -------------------------
        // REGISTER
        // -------------------------
        if (isRegister) {
            if (!username.trim()) {
                setError("Please enter a username.");
                return;
            }

            if (!email.trim()) {
                setError("Please enter your email.");
                return;
            }

            if (!password) {
                setError("Please enter a password.");
                return;
            }

            try {
                setLoading(true);

                const { data, error } = await supabase.auth.signUp({
                    email: email.trim(),
                    password,
                    options: {
                        data: {
                            username: username.trim(),
                        },
                    },
                });

                if (error) {
                    throw error;
                }

                console.log("Supabase signup:", data);

                setMessage(
                    "Account created! Please check your email and confirm your account before signing in."
                );

                // Clear the form after successful registration
                setUsername("");
                setEmail("");
                setPassword("");

            } catch (error) {
                console.error("Signup error:", error);

                setError(
                    error?.message || "Something went wrong while creating your account."
                );
            } finally {
                setLoading(false);
            }

            return;
        }

        // -------------------------
        // SIGN IN
        // -------------------------
        try {
            setLoading(true);

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
            });

            if (error) {
                throw error;
            }

            console.log("Supabase sign in:", data);

            navigate("/home");

        } catch (error) {
            console.error("Sign in error:", error);

            setError(
                error?.message || "Something went wrong while signing in."
            );
        } finally {
            setLoading(false);
        }
    }

    function toggleMode() {
        setMode((prev) =>
            prev === "register" ? "signin" : "register"
        );

        setError("");
        setMessage("");
    }

    return (
        <main>
            <div className="register">

                <h1>
                    {isRegister ? "Create an account" : "Sign in"}
                </h1>

                <form
                    className="register-forms"
                    onSubmit={handleSubmit}
                >

                    {isRegister && (
                        <label>
                            <span>Username</span>

                            <input
                                type="text"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                required
                            />
                        </label>
                    )}

                    <label>
                        <span>Email</span>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />
                    </label>

                    <label>
                        <span>Password</span>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />
                    </label>

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    {message && (
                        <p className="auth-message">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Please wait..."
                            : isRegister
                                ? "Create account"
                                : "Sign in"}
                    </button>

                </form>

                <p>
                    {isRegister
                        ? "Already have an account? "
                        : "Don't have an account? "}

                    <button
                        type="button"
                        className="link-btn"
                        onClick={toggleMode}
                    >
                        {isRegister
                            ? "Sign In"
                            : "Create one"}
                    </button>
                </p>

            </div>
        </main>
    );
}