import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const LoginPage = () => {
  const navigate = useNavigate(); // ✅ FIX 1

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      // ✅ FIX 2: remove /api (already in axios baseURL)
      const res = await api.post("/login", {
        email: email.trim(),
        password: password.trim(),
      });

      console.log("LOGIN SUCCESS:", res.data);

      localStorage.setItem("token", res.data.token);

      // optional safety (not required if interceptor exists)
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${res.data.token}`;

      navigate("/home"); // ✅ FIX 1

    } catch (err) {
      console.log("LOGIN ERROR:", err);

      if (err.request && !err.response) {
        setError("Cannot reach backend. Is server running?");
      } else {
        setError(err.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        {error && (
          <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 text-white rounded ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;