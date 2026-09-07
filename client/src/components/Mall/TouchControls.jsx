import { useRef } from "react";
import useMallStore from "../../store/useMallStore";

const STICK_RADIUS = 44;

export default function TouchControls() {
  const setTouchMove = useMallStore((s) => s.setTouchMove);
  const setTouchLook = useMallStore((s) => s.setTouchLook);
  const stickOrigin = useRef(null);
  const stickTouchId = useRef(null);
  const lookTouchId = useRef(null);
  const lastLook = useRef({ x: 0, y: 0 });
  const knobRef = useRef(null);

  const handleStickStart = (e) => {
    const touch = e.changedTouches[0];
    stickTouchId.current = touch.identifier;
    const rect = e.currentTarget.getBoundingClientRect();
    stickOrigin.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const handleStickMove = (e) => {
    if (stickTouchId.current === null) return;
    const touch = [...e.changedTouches].find((t) => t.identifier === stickTouchId.current);
    if (!touch || !stickOrigin.current) return;
    let dx = touch.clientX - stickOrigin.current.x;
    let dy = touch.clientY - stickOrigin.current.y;
    const dist = Math.min(Math.hypot(dx, dy), STICK_RADIUS);
    const angle = Math.atan2(dy, dx);
    dx = Math.cos(angle) * dist;
    dy = Math.sin(angle) * dist;
    if (knobRef.current) knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    setTouchMove({ x: dx / STICK_RADIUS, z: -dy / STICK_RADIUS });
  };

  const handleStickEnd = () => {
    stickTouchId.current = null;
    stickOrigin.current = null;
    if (knobRef.current) knobRef.current.style.transform = "translate(0px, 0px)";
    setTouchMove({ x: 0, z: 0 });
  };

  const handleLookStart = (e) => {
    const touch = e.changedTouches[0];
    lookTouchId.current = touch.identifier;
    lastLook.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookMove = (e) => {
    if (lookTouchId.current === null) return;
    const touch = [...e.changedTouches].find((t) => t.identifier === lookTouchId.current);
    if (!touch) return;
    const dx = touch.clientX - lastLook.current.x;
    const dy = touch.clientY - lastLook.current.y;
    lastLook.current = { x: touch.clientX, y: touch.clientY };
    setTouchLook({ x: dx * -1, y: dy });
  };

  const handleLookEnd = () => {
    lookTouchId.current = null;
  };

  return (
    <div className="absolute inset-0 z-20" style={{ touchAction: "none" }}>
      {/* Look zone: right half of the screen */}
      <div
        className="absolute inset-y-0 right-0 w-1/2"
        onTouchStart={handleLookStart}
        onTouchMove={handleLookMove}
        onTouchEnd={handleLookEnd}
      />
      {/* Joystick: bottom left */}
      <div
        className="absolute bottom-8 left-8 rounded-full glass"
        style={{ width: STICK_RADIUS * 2, height: STICK_RADIUS * 2 }}
        onTouchStart={handleStickStart}
        onTouchMove={handleStickMove}
        onTouchEnd={handleStickEnd}
      >
        <div
          ref={knobRef}
          className="absolute top-1/2 left-1/2 w-9 h-9 -mt-[18px] -ml-[18px] rounded-full bg-mall-glow/80 transition-transform"
        />
      </div>
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-mall-muted">
        Joystick to move · Drag right side to look · Tap a product to view it
      </p>
    </div>
  );
}
