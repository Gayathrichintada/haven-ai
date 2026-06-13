export default function Onboarding() {
  const options = [
    "🤗 Friend",
    "🎯 Mentor",
    "💪 Coach",
    "🧠 Listener",
    "💼 Professional"
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-white flex flex-col items-center justify-center px-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Getting to Know You
        </h1>

        <p className="text-center text-gray-400 mb-10">
          Rank these from most preferred (1) to least preferred (5)
        </p>

        <h2 className="text-2xl font-semibold mb-8 text-center">
          How would you like Haven to be in your life?
        </h2>

        <div className="space-y-4">
          {options.map((option, index) => (
            <div
              key={index}
              className="bg-[#151B2E] p-5 rounded-xl border border-gray-700"
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}