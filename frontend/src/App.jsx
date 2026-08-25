import { useState } from "react";
import { supabase } from "./lib/supabase";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    setLoading(true);
    setMessage("");

    let result;

    if (isLogin) {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    } else {
      result = await supabase.auth.signUp({
        email,
        password,
      });
    }

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (isLogin) {
      setMessage("Login successful! 🎉");
      console.log("User:", result.data.user);
    } else {
      setMessage(
        "Account created! Check your email for confirmation."
      );
    }
  };

  return (
    <div className="app">
      <div className="auth-container">
        <h1>Chatify</h1>

        <p className="subtitle">
          {isLogin ? "Login to your account" : "Create your account"}
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleAuth} disabled={loading}>
          {loading
            ? "Please wait..."
            : isLogin
            ? "Login"
            : "Sign Up"}
        </button>

        <p className="switch">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            className="switch-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default App;