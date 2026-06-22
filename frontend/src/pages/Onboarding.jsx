import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableItem from "../components/SortableItem";

export default function Onboarding() {
  const navigate = useNavigate();

  const totalSteps = 5;

  const [step, setStep] = useState(1);

  const [profile, setProfile] = useState({
    name: "",
    role: "",
    field: "",
    year: "",
    goals: [],
    support_style: "",
    theme: "midnight",
  });

  const [ranking, setRanking] = useState([
    "Friend",
    "Mentor",
    "Coach",
    "Listener",
    "Professional",
  ]);

  const goals = [
    "Stress",
    "Productivity",
    "Career Growth",
    "Relationships",
    "Confidence",
    "Mental Wellness",
  ];

  const toggleGoal = (goal) => {
    setProfile((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = ranking.indexOf(active.id);
    const newIndex = ranking.indexOf(over.id);

    setRanking(arrayMove(ranking, oldIndex, newIndex));
  };

  const nextStep = () => {
    if (step === 1 && !profile.name.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (step === 2 && !profile.role) {
      alert("Please select your role.");
      return;
    }

    if (step === 3 && profile.goals.length === 0) {
      alert("Please select at least one goal.");
      return;
    }

    setStep((prev) => prev + 1);
  };

  const previousStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinish = async () => {
  if (!profile.support_style) {
    alert("Please choose a support style.");
    return;
  }

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const finalProfile = {
    ...profile,
    support_ranking: ranking,
    user_id: userId,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/profile`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(finalProfile),
      }
    );

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(
        data.detail || "Failed to save profile"
      );
    }

    localStorage.setItem(
      "havenProfile",
      JSON.stringify(data)
    );

    localStorage.setItem(
      "profileId",
      data._id
    );

    navigate("/dashboard");
  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 flex items-center justify-center px-6 py-10 text-white">
      <div className="max-w-3xl w-full">
        <div className="mb-8">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{
                width: `${(step / totalSteps) * 100}%`,
              }}
            />
          </div>

          <p className="text-center text-gray-300 mt-3">
            🌱 Haven is learning about you
          </p>
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-center">
                What should Haven call you?
              </h1>

              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    name: e.target.value,
                  })
                }
                placeholder="Your name"
                className="w-full p-4 rounded-2xl bg-white/10 outline-none border border-transparent focus:border-green-500"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-center">
                Which best describes you?
              </h1>

              <select
                value={profile.role}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    role: e.target.value,
                    field: "",
                    year: "",
                  })
                }
                className="w-full p-4 rounded-2xl bg-slate-800"
              >
                <option value="">Select your role</option>

                <option value="Student">Student</option>

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

              {profile.role === "Student" && (
                <>
                  <input
                    placeholder="What are you studying?"
                    value={profile.field}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        field: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-2xl bg-white/10"
                  />

                  <input
                    placeholder="Which year are you in?"
                    value={profile.year}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        year: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-2xl bg-white/10"
                  />
                </>
              )}

              {profile.role &&
                profile.role !== "Student" && (
                  <input
                    placeholder="Tell Haven more about your work"
                    value={profile.field}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        field: e.target.value,
                      })
                    }
                    className="w-full p-4 rounded-2xl bg-white/10"
                  />
                )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-3xl font-bold text-center mb-8">
                What would you like help with?
              </h1>

              <div className="flex flex-wrap gap-4 justify-center">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-5 py-3 rounded-2xl transition ${
                      profile.goals.includes(goal)
                        ? "bg-green-500 text-black"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-center">
                Rank your preferred support style
              </h1>

              <p className="text-center text-gray-300">
                Drag from most important to least important
              </p>

              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={ranking}
                  strategy={
                    verticalListSortingStrategy
                  }
                >
                  <div className="space-y-4">
                    {ranking.map((item, index) => (
                      <SortableItem
                        key={item}
                        id={item}
                        index={index}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-center">
                How should Haven support you?
              </h1>

              <select
                value={profile.support_style}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    support_style: e.target.value,
                  })
                }
                className="w-full p-4 rounded-2xl bg-slate-800"
              >
                <option value="">
                  Choose a style
                </option>

                <option value="Listener">
                  Listener
                </option>

                <option value="Coach">
                  Coach
                </option>

                <option value="Motivator">
                  Motivator
                </option>

                <option value="Accountability Partner">
                  Accountability Partner
                </option>
              </select>

              <div>
                <label className="block mb-3">
                  Choose your Haven theme
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    "midnight",
                    "ocean",
                    "frost",
                    "love",
                  ].map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          theme,
                        })
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
            </div>
          )}

          <div className="flex justify-between mt-10">
            {step > 1 ? (
              <button
                onClick={previousStep}
                className="px-6 py-3 rounded-2xl bg-white/10"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                onClick={nextStep}
                className="px-8 py-3 rounded-2xl bg-green-500 text-black font-bold"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-8 py-3 rounded-2xl bg-green-500 text-black font-bold"
              >
                Complete →
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}