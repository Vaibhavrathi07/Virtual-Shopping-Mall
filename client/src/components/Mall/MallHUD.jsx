import { Link } from "react-router-dom";
import useMallStore from "../../store/useMallStore";

export default function MallHUD({ isLocked, onRequestLock, activeStoreName }) {
  const toggleMap = useMallStore((s) => s.toggleMap);
  const soundOn = useMallStore((s) => s.soundOn);
  const toggleSound = useMallStore((s) => s.toggleSound);
  const controlMode = useMallStore((s) => s.controlMode);

  return (
    <>
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-20 pointer-events-none">
        <Link
          to="/"
          className="glass rounded-full px-4 py-2 text-sm font-display text-mall-text pointer-events-auto hover:border-mall-glow/50 transition-colors"
        >
          ← Exit Mall
        </Link>
        <div className="flex gap-2 pointer-events-auto">
          <button
            onClick={() => toggleSound()}
            className="glass rounded-full w-10 h-10 flex items-center justify-center text-mall-text hover:border-mall-glow/50 transition-colors"
            aria-label="Toggle sound"
            title={soundOn ? "Sound: On" : "Sound: Off"}
          >
            {soundOn ? "🔊" : "🔇"}
          </button>
          <button
            onClick={() => toggleMap()}
            className="glass rounded-full px-4 h-10 flex items-center justify-center text-sm text-mall-text hover:border-mall-glow/50 transition-colors"
            aria-label="Toggle map"
          >
            Map
          </button>
        </div>
      </div>

      {/* Crosshair */}
      {isLocked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
        </div>
      )}

      {/* Store name banner */}
      {activeStoreName && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="glass rounded-full px-5 py-2 text-sm font-display text-mall-text">
            {activeStoreName}
          </div>
        </div>
      )}

      {/* Click-to-play overlay */}
      {!isLocked && controlMode === "keyboard" && (
        <button
          onClick={onRequestLock}
          className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-mall-void/80 gap-4"
        >
          <span className="font-display text-2xl text-mall-text">Click to walk around</span>
          <div className="glass rounded-xl px-6 py-4 text-xs text-mall-muted grid grid-cols-2 gap-x-8 gap-y-1 text-left">
            <span><b className="text-mall-text">W A S D</b> — Move</span>
            <span><b className="text-mall-text">Mouse</b> — Look around</span>
            <span><b className="text-mall-text">Click</b> — Interact</span>
            <span><b className="text-mall-text">ESC</b> — Release cursor</span>
          </div>
        </button>
      )}
    </>
  );
}
