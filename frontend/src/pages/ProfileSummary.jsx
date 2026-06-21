import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createProfile } from "../services/api";

export default function ProfileSummary() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const profile =
    JSON.parse(
      localStorage.getItem("havenProfile")
    ) || {};

  useEffect(() => {
    const saveProfile = async () => {
      const userId =
        localStorage.getItem("userId");

      if (!userId) {
        navigate("/login");
        return;
      }

      if (!profile.name) {
        navigate("/onboarding");
        return;
      }

      const existingProfileId =
        localStorage.getItem("profileId");

      if (existingProfileId) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await createProfile({
            user_id: userId,
            ...profile,
          });

        localStorage.setItem(
          "profileId",
          response.profile_id
        );
      } catch (error) {
        console.error(
          "Profile creation failed:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    saveProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Creating your Haven profile...
      </div>
    );
  }
  const topPreference =
  profile.support_ranking?.[0] || "Friend";

function getTitle() {
  if (topPreference === "Friend")
    return "The Connector";

  if (topPreference === "Mentor")
    return "The Achiever";

  if (topPreference === "Coach")
    return "The Challenger";

  if (topPreference === "Listener")
    return "The Reflector";

  return "The Explorer";
}

function getDescription() {
  if (topPreference === "Friend") {
    return "You value trust, empathy, and meaningful relationships.";
  }

  if (topPreference === "Mentor") {
    return "You thrive on growth, learning, and guidance.";
  }

  if (topPreference === "Coach") {
    return "You enjoy challenges and pushing beyond your limits.";
  }

  if (topPreference === "Listener") {
    return "You appreciate being heard and understood.";
  }

  return "You value balance and self-discovery.";
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 flex items-center justify-center text-white px-6">
      <div className="max-w-2xl w-full bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-10">

        <h1 className="text-5xl font-bold text-center mb-8">
          🌱 Welcome, {profile.name}
        </h1>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-green-400 mb-4">
  {getTitle()}
</h2>

<p className="text-xl text-gray-300">
  {getDescription()}
</p>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 mb-8">
          <h3 className="text-xl mb-4">
            What Haven Learned
          </h3>

          <ul className="space-y-3 text-gray-300">
            <li>
              ✓ You are a{" "}
              <span className="text-green-400">
                {profile.role}
              </span>
            </li>

            {profile.field && (
              <li>
                ✓ Your focus area is{" "}
                <span className="text-green-400">
                  {profile.field}
                </span>
              </li>
            )}

            {profile.year && (
              <li>
                ✓ You are in{" "}
                <span className="text-green-400">
                  {profile.year}
                </span>
              </li>
            )}

            <li>
              ✓ Preferred support style:{" "}
              <span className="text-green-400">
                {profile.support_style}
              </span>
            </li>

            <li>
              ✓ Goals:{" "}
              <span className="text-green-400">
                {profile.goals?.join(", ")}
              </span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="bg-green-500 hover:bg-green-600 text-black font-bold px-10 py-4 rounded-2xl transition"
          >
            Enter Haven →
          </button>
        </div>
      </div>
    </div>
  );
}