"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Component, useEffect, useMemo, type ErrorInfo, type ReactNode, type RefObject } from "react";
import * as THREE from "three";
import { buildHouse } from "./three/buildHouse";
import { createCameraPath } from "./three/cameraPath";

export interface SceneBridge {
  progress: number;
  invalidate?: () => void;
}

interface Props {
  bridge: RefObject<SceneBridge>;
  quality: "high" | "low";
  onReady?: () => void;
  onError?: () => void;
}

function Rig({ bridge, quality, onReady }: Pick<Props, "bridge" | "quality" | "onReady">) {
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);

  const house = useMemo(() => buildHouse(quality), [quality]);
  const path = useMemo(() => createCameraPath(), []);

  useEffect(() => {
    const b = bridge.current;
    b.invalidate = invalidate;
    invalidate();
    const id = requestAnimationFrame(() => onReady?.());
    return () => {
      b.invalidate = undefined;
      cancelAnimationFrame(id);
    };
  }, [bridge, invalidate, onReady]);

  useEffect(
    () => () => {
      house.dispose();
      scene.fog = null;
    },
    [house, scene],
  );

  useFrame(() => {
    if (gl.toneMapping !== THREE.NeutralToneMapping) gl.toneMapping = THREE.NeutralToneMapping;
    const p = bridge.current.progress;
    house.update(p, scene);
    path.apply(camera, p, size.width / Math.max(size.height, 1));
  });

  return <primitive object={house.root} />;
}

class SceneErrorBoundary extends Component<{ onError?: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ArchitecturalJourney] 3D scene failed, using fallback.", error, info.componentStack);
    this.props.onError?.();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HouseConstructionScene({ bridge, quality, onReady, onError }: Props) {
  return (
    <SceneErrorBoundary onError={onError}>
      <Canvas
        frameloop="demand"
        shadows
        dpr={quality === "high" ? [1, 1.75] : [1, 1.25]}
        camera={{ fov: 35, near: 0.1, far: 500, position: [0.8, 46, 9.5] }}
        gl={{ antialias: quality === "high", powerPreference: "high-performance", alpha: false, stencil: false }}
        onCreated={({ gl }) => {
          gl.localClippingEnabled = true;
          gl.toneMapping = THREE.NeutralToneMapping;
          gl.toneMappingExposure = 1;
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              onError?.();
            },
            { once: true },
          );
        }}
        fallback={null}
        aria-hidden
      >
        <Rig bridge={bridge} quality={quality} onReady={onReady} />
        <Environment resolution={128} frames={1} environmentIntensity={0.55}>
          <Lightformer form="rect" intensity={2.2} color="#fff4e4" position={[0, 9, -14]} scale={[26, 7, 1]} />
          <Lightformer
            form="rect"
            intensity={1.4}
            color="#ffe6c7"
            position={[-16, 5, 6]}
            rotation-y={Math.PI / 2}
            scale={[18, 4, 1]}
          />
          <Lightformer
            form="rect"
            intensity={1.1}
            color="#dfe6ee"
            position={[16, 6, 4]}
            rotation-y={-Math.PI / 2}
            scale={[18, 5, 1]}
          />
          <Lightformer form="ring" intensity={1.6} color="#ffd9a8" position={[0, 14, 10]} scale={6} />
        </Environment>
      </Canvas>
    </SceneErrorBoundary>
  );
}
