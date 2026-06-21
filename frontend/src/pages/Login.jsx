import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      "http://127.0.0.1:8000/login",
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
        data.detail || "Login failed"
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

    const existsResponse = await fetch(
      `http://127.0.0.1:8000/profile/${data.user_id}/exists`,
      {
        headers: {
          Authorization: `Bearer ${data.access_token}`,
        },
      }
    );

    if (!existsResponse.ok) {
      throw new Error(
        "Unable to verify profile status."
      );
    }

    const existsData =
      await existsResponse.json();

    if (existsData.exists) {
      const profileResponse = await fetch(
        `http://127.0.0.1:8000/profile/${data.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${data.access_token}`,
          },
        }
      );

      if (!profileResponse.ok) {
        throw new Error(
          "Unable to load profile."
        );
      }

      const profile =
        await profileResponse.json();

      console.log(
        "Loaded profile:",
        profile
      );

      localStorage.setItem(
        "havenProfile",
        JSON.stringify(profile)
      );

      if (profile._id) {
        localStorage.setItem(
          "profileId",
          profile._id
        );
      } else {
        console.error(
          "Profile ID missing from backend response."
        );
      }

      localStorage.removeItem(
        "chatId"
      );

      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  } catch (err) {
    setError(
      err.message ||
        "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🌱 Haven
          </h1>

          <p className="text-gray-300">
            Welcome back
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/50 bg-red-500/20 p-3 text-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-2xl bg-white/10 p-4 text-white placeholder:text-gray-400 outline-none border border-transparent focus:border-green-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-2xl bg-white/10 p-4 text-white placeholder:text-gray-400 outline-none border border-transparent focus:border-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-green-500 p-4 font-bold text-black transition hover:bg-green-600 disabled:opacity-50"
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-400 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}