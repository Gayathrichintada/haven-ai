import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-3xl">
        <h1 className="text-6xl font-bold mb-6">
          🌱 Haven
        </h1>

        <p className="text-2xl text-gray-300 mb-8">
          Your space to grow, reflect, and move forward.
        </p>

        <div className="space-y-3 text-lg text-gray-400 mb-10">
          <p>I remember what matters.</p>
          <p>I understand your journey.</p>
          <p>I help you become your best self.</p>
        </div>

        <button
          onClick={() => navigate("/welcome")}
          className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-2xl text-lg font-semibold transition"
        >
          Begin Your Journey →
        </button>
      </div>
    </div>
  );
}