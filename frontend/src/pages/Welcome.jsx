import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to Haven 🌱
        </h1>

        <p className="text-xl text-gray-300 mb-4">
          Before we start,
          I'd love to understand you a little better.
        </p>

        <p className="text-gray-400 mb-10">
          This won't feel like a form.
          Think of it as the beginning of a conversation.
        </p>

        <button
          onClick={() => navigate("/onboarding")}
          className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl text-lg font-semibold transition"
        >
          Let's Begin →
        </button>
      </div>
    </div>
  );
}