import { NavLink, useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Auth() {
    const [mode, setMode] = useState("register");
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const isRegister = mode === "register";

    function handleSubmit(e) {
        e.preventDefault();
        navigate("/home");
    }

    function toggleMode() {
        setMode((prev) => (prev === "register" ? "signin" : "register"));
    }

    return (
        <main>
            <div className="register">
                <h1>{isRegister ? "Create an account" : "Sign in"}</h1>

                <form className="register-forms" onSubmit={handleSubmit}>
                    {isRegister && (
                        <label>
                            <span>Username</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </label>
                    )}

                    <label>
                        <span>Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    <label>
                        <span>Password</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    <button type="submit">
                        {isRegister ? "Create account" : "Sign in"}
                    </button>
                </form>

                <p>
                    {isRegister ? "Already have an account? " : "Don't have an account? "}
                    <button type="button" className="link-btn" onClick={toggleMode}>
                        {isRegister ? "Sign In" : "Create one"}
                    </button>
                </p>
            </div>
        </main>
    )
}