import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Registration failed"
        );
      }

      localStorage.setItem(
        "token",
        data.access_token
      );

      localStorage.setItem(
        "userId",
        data.user_id
      );

      localStorage.removeItem("profileId");
localStorage.removeItem("havenRankings");

navigate("/onboarding");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">

        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          🌱 Haven
        </h1>

        <p className="text-gray-300 text-center mb-8">
          Create your account
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-white/10 text-white placeholder:text-gray-400 outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-white/10 text-white placeholder:text-gray-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-4 rounded-2xl bg-white/10 text-white placeholder:text-gray-400 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-2xl bg-green-500 hover:bg-green-600 text-black font-bold transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-300 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}