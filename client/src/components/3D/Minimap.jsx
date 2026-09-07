import { motion, AnimatePresence } from "framer-motion";
import useMallStore from "../../store/useMallStore";
import { MALL } from "../../data/mallConfig";

const WORLD_W = MALL.BOUNDARY.maxX - MALL.BOUNDARY.minX;
const WORLD_D = MALL.BOUNDARY.maxZ - MALL.BOUNDARY.minZ;
const MAP_SIZE = 260;

function toMapCoords(x, z) {
  const px = ((x - MALL.BOUNDARY.minX) / WORLD_W) * MAP_SIZE;
  const py = ((z - MALL.BOUNDARY.minZ) / WORLD_D) * MAP_SIZE;
  return { left: px, top: py };
}

export default function Minimap({ stores, onNavigate }) {
  const isMapOpen = useMallStore((s) => s.isMapOpen);
  const toggleMap = useMallStore((s) => s.toggleMap);
  const playerPosition = useMallStore((s) => s.playerPosition);

  const player = toMapCoords(playerPosition.x, playerPosition.z);
  const entrance = toMapCoords(0, MALL.ENTRANCE_Z);

  return (
    <AnimatePresence>
      {isMapOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-strong absolute top-20 right-4 rounded-2xl p-4 z-30"
          style={{ width: MAP_SIZE + 32 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-sm text-mall-text">Mall Map</h3>
            <button
              onClick={() => toggleMap(false)}
              className="text-mall-muted hover:text-mall-text text-xs"
              aria-label="Close map"
            >
              Close
            </button>
          </div>
          <div
            className="relative rounded-xl border border-mall-border"
            style={{ width: MAP_SIZE, height: MAP_SIZE, background: "rgba(10,10,18,0.6)" }}
          >
            {/* Entrance marker */}
            <div
              className="absolute w-2 h-2 rounded-full bg-mall-glow2"
              style={{ left: entrance.left - 4, top: entrance.top - 4 }}
              title="Entrance"
            />
            {/* Store markers */}
            {stores.map((store) => {
              const pos = toMapCoords(store.location?.x || 0, store.location?.z || 0);
              return (
                <button
                  key={store._id}
                  onClick={() => onNavigate(store)}
                  className="absolute flex flex-col items-center group"
                  style={{ left: pos.left - 6, top: pos.top - 6 }}
                  title={store.name}
                >
                  <span
                    className="block w-3 h-3 rounded-sm border border-white/30"
                    style={{ background: store.theme?.primaryColor || "#7c5cff" }}
                  />
                  <span className="absolute top-4 whitespace-nowrap text-[10px] text-mall-muted opacity-0 group-hover:opacity-100 transition-opacity">
                    {store.name}
                  </span>
                </button>
              );
            })}
            {/* Player marker */}
            <div
              className="absolute w-3 h-3 rounded-full bg-white shadow-glow"
              style={{ left: player.left - 6, top: player.top - 6 }}
            />
          </div>
          <p className="text-[11px] text-mall-muted mt-2">Tap a store marker to navigate there.</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
