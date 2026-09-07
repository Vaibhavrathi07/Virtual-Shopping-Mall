import { useEffect, useMemo, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useSearchParams } from "react-router-dom";
import * as storeService from "../services/storeService";
import * as productService from "../services/productService";
import MallEnvironment from "../components/3D/MallEnvironment";
import StoreFront from "../components/3D/StoreFront";
import Player from "../components/3D/Player";
import Loader from "../components/UI/Loader";
import SceneErrorBoundary from "../components/UI/SceneErrorBoundary";
import MallHUD from "../components/Mall/MallHUD";
import TouchControls from "../components/Mall/TouchControls";
import Minimap from "../components/3D/Minimap";
import ProductPanel from "../components/Modals/ProductPanel";
import useMallStore from "../store/useMallStore";
import useIsTouchDevice from "../hooks/useIsTouchDevice";
import { MALL } from "../data/mallConfig";

export default function Mall() {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [searchParams] = useSearchParams();
  const isTouch = useIsTouchDevice();

  const selectedProduct = useMallStore((s) => s.selectedProduct);
  const setSelectedProduct = useMallStore((s) => s.setSelectedProduct);
  const navigateTarget = useMallStore((s) => s.navigateTarget);
  const setNavigateTarget = useMallStore((s) => s.setNavigateTarget);
  const setControlMode = useMallStore((s) => s.setControlMode);
  const activeStoreId = useMallStore((s) => s.activeStoreId);
  const setActiveStoreId = useMallStore((s) => s.setActiveStoreId);

  useEffect(() => {
    setControlMode(isTouch ? "touch" : "keyboard");
  }, [isTouch, setControlMode]);

  useEffect(() => {
    storeService.fetchStores().then(setStores).catch(() => setStores([]));
    productService
      .fetchProducts({ limit: 200 })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]));
  }, []);

  // Support "Take me to store" deep links: /mall?store=<id> or ?product=<id>
  useEffect(() => {
    const storeId = searchParams.get("store");
    const productId = searchParams.get("product");
    if (storeId && stores.length) {
      const store = stores.find((s) => s._id === storeId);
      if (store) setNavigateTarget({ x: store.location.x, z: store.location.z + MALL.STORE_DEPTH });
    }
    if (productId && products.length) {
      const product = products.find((p) => p._id === productId);
      if (product) {
        const store = stores.find((s) => s._id === (product.store?._id || product.store));
        if (store) setNavigateTarget({ x: store.location.x, z: store.location.z + MALL.STORE_DEPTH });
      }
    }
  }, [searchParams, stores, products, setNavigateTarget]);

  const productsByStore = useMemo(() => {
    const map = {};
    for (const p of products) {
      const storeId = p.store?._id || p.store;
      if (!map[storeId]) map[storeId] = [];
      map[storeId].push(p);
    }
    return map;
  }, [products]);

  const obstacles = useMemo(
    () =>
      stores.map((s) => ({
        x: s.location?.x || 0,
        z: s.location?.z || 0,
        width: MALL.STORE_WIDTH,
        depth: MALL.STORE_DEPTH,
      })),
    [stores]
  );

  const activeStore = stores.find((s) => s._id === activeStoreId);

  const handleNavigateFromMap = (store) => {
    setNavigateTarget({ x: store.location.x, z: store.location.z + MALL.STORE_DEPTH });
    useMallStore.getState().toggleMap(false);
  };

  return (
    <div className="fixed inset-0 bg-mall-void">
      <SceneErrorBoundary>
        <Canvas shadows camera={{ fov: 65, near: 0.1, far: 120 }}>
          <fog attach="fog" args={["#0a0a12", 20, 70]} />
          <Suspense fallback={<Loader />}>
            <MallEnvironment />
            {stores.map((store) => (
              <StoreFront
                key={store._id}
                store={store}
                products={productsByStore[store._id] || []}
                onSelectProduct={setSelectedProduct}
                onEnter={(id, isInside) => {
                  if (isInside) setActiveStoreId(id);
                  else if (activeStoreId === id) setActiveStoreId(null);
                }}
              />
            ))}
          </Suspense>
          <Player
            obstacles={obstacles}
            onPointerLockChange={setIsLocked}
            navigateTarget={navigateTarget}
          />
        </Canvas>
      </SceneErrorBoundary>

      <MallHUD
        isLocked={isLocked || isTouch}
        onRequestLock={() => document.querySelector("canvas")?.requestPointerLock?.()}
        activeStoreName={activeStore?.name}
      />

      {isTouch && <TouchControls />}

      <Minimap stores={stores} onNavigate={handleNavigateFromMap} />

      {navigateTarget && (
        <button
          onClick={() => setNavigateTarget(null)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 glass rounded-full px-4 py-2 text-xs text-mall-text"
        >
          Navigating… tap to stop
        </button>
      )}

      {selectedProduct && (
        <ProductPanel product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
