# Virtual Shopping Mall — MERN + 3D

A full-stack, real MongoDB → Express → React → Node.js application with an
interactive 3D shopping mall built in React Three Fiber. This is not a static
background with a website on top: the mall is a real, navigable 3D scene
backed by live REST APIs, and every "wow" feature (search, cart, wishlist,
navigation, admin) actually works end to end.

## 1. Project Overview

Walk through a 3D mall on two floors, connected by a working escalator ramp.
Enter any of six stores, browse products displayed as interactive 3D objects,
click one to open a full product panel with a rotatable 3D viewer, add it to
your cart or wishlist, and check out. Search for a product from anywhere in
the app and hit "Take me to store" to be walked there automatically.

## 2. Features

- Full first-person 3D mall: WASD + mouse look (pointer lock), collision
  against storefronts and boundary walls, a physically walkable
  escalator/ramp between two floors, animated sliding entrance doors,
  ambient/directional/point/spot lighting, shadows, fog, a food court, an
  info desk, benches, plants, and animated ad screens
- Touch controls (virtual joystick + drag-to-look) on mobile, auto-detected
- Six real stores (Tech World, Fashion Avenue, Sole Street, Beauty Hub,
  Home & Living, Sports Zone) each with distinct storefront colors and 30+
  seeded products
- Products render as raycast-interactive procedural 3D shapes (no missing
  GLB ever leaves a blank pedestal), with hover highlight and click-to-open
- Product panel: rotatable/zoomable 3D viewer with reset, colors/sizes,
  quantity, Add to Cart / Buy Now / Wishlist
- Global debounced search (products, brands, stores) with a
  "take me to store" action that walks the player there in the 3D scene
- Minimap with clickable store markers
- Full auth (JWT + bcrypt), protected routes, role-based admin authorization
- Persistent cart, wishlist, and simulated checkout → order creation, all in
  MongoDB
- Admin dashboard: stats, product/store CRUD, order status management, user
  list
- 2D fallback pages (Products grid, Store page, Product details) so every
  feature is also reachable without the 3D scene
- React Suspense loading screen, an error boundary around the 3D canvas so a
  bad asset can't crash the app, and empty/error states throughout

## 3. Technology Stack

**Frontend:** React 18, Vite, React Router, Three.js, React Three Fiber,
@react-three/drei, Tailwind CSS, Framer Motion, Axios, Zustand

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

## 4. Architecture

```
virtual-shopping-mall/
├── client/                  React + Vite frontend
│   └── src/
│       ├── components/3D/   Player controller, environment, storefronts, minimap
│       ├── components/Mall/ HUD, touch controls
│       ├── components/Modals/ Product panel (3D viewer + purchase)
│       ├── components/{Navbar,Products,UI}/
│       ├── pages/           Home, Mall, Store, Products, ProductDetails,
│       │                    Cart, Wishlist, Login, Register, Admin
│       ├── store/           Zustand stores (auth, cart, wishlist, mall/scene)
│       ├── services/        Axios API layer
│       └── data/mallConfig.js  World layout constants
└── server/                  Express + MongoDB backend
    ├── models/               User, Product, Store, Category, Cart, Wishlist, Order, Review
    ├── controllers/, routes/, middleware/, seed/
    └── server.js
```

## 5. 3D Architecture

- **Player.jsx** — FPS controller. Desktop uses drei's `PointerLockControls`
  for mouse look plus manual WASD movement with AABB collision against every
  storefront; mobile uses a custom touch-driven yaw/pitch + joystick branch.
  Player height follows a `getFloorHeight(x, z)` function so walking onto the
  escalator strip physically raises the camera from floor 1 to floor 2.
- **MallEnvironment.jsx** — the static shell: floors, walls, lighting rig
  (ambient/directional/point/spot with shadows), the escalator's visual
  steps, food court, info desk, benches, plants, and two animated ad screens.
- **StoreFront.jsx** — reads a store's `location` from the database and
  places its walls, sign, glass display window, and animated sliding doors
  (open on player proximity) at that position, then lays out up to 6 of its
  products across the storefront.
- **ProductObject.jsx** — a raycast-interactive procedural mesh (box, sphere,
  cylinder, cone, or torus, chosen per product) used as the visible product
  when no `.glb` is set — every product is guaranteed a visible representation.
- **Minimap.jsx** — an HTML/CSS overlay (not inside the WebGL canvas) that
  projects world coordinates onto a 2D map and lets you click a store to
  navigate there.
- **ProductPanel.jsx** — a second, independent `<Canvas>` used only for the
  product detail viewer, with `OrbitControls` for rotate/zoom/reset.

Computer graphics concepts demonstrated: perspective camera with FPS
controls, translation/rotation/scaling on every 3D object, four light types,
physically-based materials (metalness/roughness/transmission on glass
doors), shadow mapping, fog, and raycasting-based pointer interaction on
meshes.

## 6. Database Schema

- **User** — name, email, hashed password, role (user/admin), wishlist ref
- **Product** — name, price, discountPrice, category ref, store ref, brand,
  images, model3D (nullable), fallbackShape, colors, sizes, stock, rating,
  featured
- **Store** — name, slug, description, floor, location `{x,y,z,rotationY}`,
  theme colors
- **Category** — name, slug
- **Cart** — user ref (unique), items `[{product, quantity, color, size}]`
- **Wishlist** — user ref (unique), products `[ref]`
- **Order** — user ref, items (snapshot), totalAmount, shippingAddress,
  status, paymentStatus
- **Review** — product ref, user ref, rating, comment

## 7. API Documentation

All responses are `{ success, data, ... }`. Protected routes require
`Authorization: Bearer <token>`.

| Method | Endpoint | Auth | Body |
|---|---|---|---|
| POST | /api/auth/register | Public | name, email, password |
| POST | /api/auth/login | Public | email, password |
| GET | /api/auth/me | Private | — |
| GET | /api/products | Public | query: search, category, store, minPrice, maxPrice, minRating, sort, page, limit, featured |
| GET | /api/products/:id | Public | — |
| POST | /api/products | Admin | product fields |
| PUT | /api/products/:id | Admin | product fields |
| DELETE | /api/products/:id | Admin | — |
| GET | /api/stores | Public | — |
| GET | /api/stores/:id | Public | — (includes products) |
| POST/PUT/DELETE | /api/stores(/:id) | Admin | store fields |
| GET | /api/cart | Private | — |
| POST | /api/cart | Private | productId, quantity, color, size |
| PUT | /api/cart/:productId | Private | quantity |
| DELETE | /api/cart/:productId or /api/cart | Private | — |
| GET | /api/wishlist | Private | — |
| POST/DELETE | /api/wishlist/:productId | Private | — |
| POST | /api/orders | Private | shippingAddress (checks out current cart) |
| GET | /api/orders/my | Private | — |
| GET | /api/orders/:id | Private | — |
| GET | /api/orders | Admin | — |
| PUT | /api/orders/:id/status | Admin | status |
| GET/POST/DELETE | /api/categories(/:id) | Public read / Admin write | — |
| GET | /api/admin/stats | Admin | — |
| GET | /api/admin/users | Admin | — |

## 8. Installation

### Prerequisites
Node.js 18+, and a MongoDB connection (local `mongod` or MongoDB Atlas).

### Backend
```bash
cd server
npm install
cp .env.example .env   # edit MONGO_URI / JWT_SECRET if needed
npm run seed            # populates stores, products, demo + admin users
npm run dev              # http://localhost:5000
```

### Frontend
```bash
cd client
npm install
cp .env.example .env    # VITE_API_URL, defaults to http://localhost:5000/api
npm run dev              # http://localhost:5173
```

## 9. Environment Variables

`server/.env`
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

`client/.env`
```
VITE_API_URL=http://localhost:5000/api
```

### MongoDB Atlas setup
1. Create a free cluster at mongodb.com/atlas.
2. Add a database user and allow your IP (or `0.0.0.0/0` for development).
3. Copy the connection string into `server/.env` as `MONGO_URI`, with a
   database name appended, e.g. `mongodb+srv://user:pass@cluster0.mongodb.net/virtual-mall`.

## 10. Database Seeding

`npm run seed` (from `server/`) drops all collections and repopulates:
6 categories, 6 stores, 30+ products spread across them, and two accounts
(see below). Re-run any time to reset to a clean demo state.

## 11. Demo Credentials

| Role | Email | Password |
|---|---|---|
| User | demo@virtualmall.com | Demo@123 |
| Admin | admin@virtualmall.com | Admin@123 |

## 12. Future Enhancements

- Swap procedural fallback shapes for real `.glb` models per product
- Real payment gateway integration at checkout
- Product reviews UI (the Review model and relations already exist)
- Multiplayer presence (see other shoppers' avatars in the mall)
- Level-of-detail and instanced meshes for a much larger store catalog

## 13. Deploying to Vercel

The backend is already set up to run as a Vercel serverless function
(`server/vercel.json` + the `VERCEL` env check in `server.js` and
`config/db.js`), and the frontend as a static SPA (`client/vercel.json`
handles React Router refreshes). Deploy them as two separate Vercel
projects from the same GitHub repo.

1. Push this project to a GitHub repository.
2. Set up MongoDB Atlas (see section 9) and copy the connection string.
3. On vercel.com, **Add New Project** → import the repo → set
   **Root Directory** to `server` → deploy. In the project's Settings →
   Environment Variables, add `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL`
   (you'll fill in `CLIENT_URL` after step 4). Redeploy after adding them.
4. **Add New Project** again on the same repo → set **Root Directory** to
   `client` → Vercel auto-detects Vite (build command `npm run build`,
   output `dist`) → before deploying, add environment variable
   `VITE_API_URL` set to your backend's Vercel URL plus `/api`, e.g.
   `https://your-backend.vercel.app/api` → deploy.
5. Go back to the backend project's environment variables and set
   `CLIENT_URL` to your frontend's Vercel URL, then redeploy the backend so
   CORS allows it.
6. Seed the production database once, from your machine, by pointing your
   local `server/.env` `MONGO_URI` at the same Atlas cluster and running
   `npm run seed` from `server/`.

## 14. Academic / Computer Graphics Concepts Demonstrated

Transformations (translation, rotation, scaling on every mesh), a
perspective camera with first-person controls, four light types (ambient,
directional, point, spot) with shadow mapping, physically-based materials
including transmissive glass, fog, and raycasting for object selection,
hover, and click interaction — all implemented with Three.js / WebGL via
React Three Fiber.
