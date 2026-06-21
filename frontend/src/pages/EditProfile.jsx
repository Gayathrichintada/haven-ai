import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    field: "",
    year: "",
    goals: [],
    support_style: "",
    support_ranking: [],
    theme: "aurora",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/profile/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const data = await response.json();

        setProfile({
          name: data.name || "",
          role: data.role || "",
          field: data.field || "",
          year: data.year || "",
          goals: data.goals || [],
          support_style:
            data.support_style || "",
          support_ranking:
            data.support_ranking || [],
          theme: data.theme || "aurora",
        });
      } catch (error) {
        console.error(error);
        alert("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update profile"
        );
      }

      localStorage.setItem(
        "havenProfile",
        JSON.stringify(profile)
      );

      alert("Profile updated!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Unable to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/10">

        <h1 className="text-4xl font-bold text-center mb-8">
          Edit Profile
        </h1>

        <div className="space-y-4">

          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full p-4 rounded-2xl bg-white/10 outline-none"
          />

          <input
            name="field"
            value={profile.field}
            onChange={handleChange}
            placeholder="Field"
            className="w-full p-4 rounded-2xl bg-white/10 outline-none"
          />

          <input
            name="year"
            value={profile.year}
            onChange={handleChange}
            placeholder="Year"
            className="w-full p-4 rounded-2xl bg-white/10 outline-none"
          />

          <select
            name="role"
            value={profile.role}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-slate-800 outline-none"
          >
            <option value="Student">
              Student
            </option>

            <option value="Working Professional">
              Working Professional
            </option>

            <option value="Job Seeker">
              Job Seeker
            </option>

            <option value="Entrepreneur">
              Entrepreneur
            </option>
          </select>

          <select
            name="support_style"
            value={profile.support_style}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl bg-slate-800 outline-none"
          >
            <option value="Listener">
              Listener
            </option>

            <option value="Coach">
              Coach
            </option>

            <option value="Mentor">
              Mentor
            </option>

            <option value="Motivator">
              Motivator
            </option>
          </select>

          <div className="mt-6">
            <label className="block mb-3 text-sm text-gray-300">
              Choose your theme
            </label>

            <div className="grid grid-cols-2 gap-3">

              {[
                "frost",
                "love",
                "ocean",
                "midnight",
              ].map((theme) => (
                <button
                  key={theme}
                  type="button"
                  onClick={() =>
                    setProfile((prev) => ({
                      ...prev,
                      theme,
                    }))
                  }
                  className={`p-4 rounded-xl border capitalize transition ${
                    profile.theme === theme
                      ? "border-green-500 bg-green-500/20"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {theme}
                </button>
              ))}

            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 rounded-2xl transition"
          >
            Save Changes
          </button>

        </div>
      </div>
    </div>
  );
}