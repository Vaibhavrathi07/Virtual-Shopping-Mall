import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress, item } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 w-64 text-center">
        <span className="font-display text-lg text-mall-text tracking-wide">VIRTUAL MALL</span>
        <span className="text-xs text-mall-muted">
          {progress < 33
            ? "Loading environment..."
            : progress < 66
            ? "Loading stores..."
            : "Loading products..."}
        </span>
        <div className="w-full h-1.5 rounded-full bg-mall-panel2 overflow-hidden">
          <div
            className="h-full bg-mall-glow transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[10px] text-mall-muted truncate w-full">{item}</span>
      </div>
    </Html>
  );
}
