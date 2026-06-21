import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Analysis() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/profile");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-indigo-950
      via-slate-900
      to-emerald-950
      flex
      flex-col
      justify-center
      items-center
      text-white
    ">
      <motion.h1
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
        className="text-4xl font-bold mb-10"
      >
        🌱 Haven is understanding you...
      </motion.h1>

      <div className="w-96 space-y-6">
        <div>
          <p>Connection</p>
          <div className="h-3 bg-slate-700 rounded">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ duration: 2 }}
              className="h-full bg-green-500 rounded"
            />
          </div>
        </div>

        <div>
          <p>Growth</p>
          <div className="h-3 bg-slate-700 rounded">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "65%" }}
              transition={{ duration: 2 }}
              className="h-full bg-green-500 rounded"
            />
          </div>
        </div>

        <div>
          <p>Wellbeing</p>
          <div className="h-3 bg-slate-700 rounded">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "72%" }}
              transition={{ duration: 2 }}
              className="h-full bg-green-500 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}