import { Component } from "react";

export default class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("3D scene error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-mall-void">
          <div className="glass rounded-2xl p-6 text-center max-w-sm">
            <p className="font-display text-mall-text mb-2">The 3D scene hit a snag</p>
            <p className="text-sm text-mall-muted mb-4">
              A visual asset failed to load, but your account and cart are unaffected.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-mall-glow text-white text-sm px-4 py-2"
            >
              Reload the mall
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
