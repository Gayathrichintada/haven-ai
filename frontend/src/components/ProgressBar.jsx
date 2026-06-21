export default function ProgressBar({ current, total }) {
  const progress = ((current + 1) / total) * 100;

  return (
    <div className="mb-8">
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-center text-green-300 mt-3 font-semibold">
        🌱 Haven is learning about you
      </p>

      <p className="text-center text-gray-300">
        Understanding: {Math.round(progress)}%
      </p>
    </div>
  );
}