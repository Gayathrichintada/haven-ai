import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-indigo-950
        via-slate-900
        to-emerald-950
        text-white
        flex
        items-center
        justify-center
        relative
        overflow-hidden
        px-6
      "
    >
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
        className="
          absolute
          top-0
          left-0
          w-96
          h-96
          bg-purple-500/20
          rounded-full
          blur-3xl
        "
      />

      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
        }}
        className="
          absolute
          bottom-0
          right-0
          w-96
          h-96
          bg-green-500/20
          rounded-full
          blur-3xl
        "
      />

      <div className="text-center max-w-2xl relative z-10">
        <h1 className="text-6xl font-bold mb-6">
          🌱 Haven
        </h1>

        <p className="text-2xl text-gray-300 mb-10">
          Your space to grow, reflect, and move forward.
        </p>

        <button
          onClick={() => navigate("/onboarding")}
          className="
            bg-green-500
            hover:bg-green-600
            px-8
            py-4
            rounded-2xl
            text-lg
            font-semibold
            transition
          "
        >
          Begin Your Journey →
        </button>
      </div>
    </div>
  );
}