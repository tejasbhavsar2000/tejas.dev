"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/theme/theme-provider";
import {
  ACCENTS,
  CURSORS,
  FLOWS,
  GRIDS,
  SHOWS,
  TERRAINS,
} from "@/lib/theme";

/**
 * The noise terrain behind the whole page.
 *
 * v1 of this site had the same idea and a weaker execution: a 3000 unit plane at
 * 256 by 256 segments, displaced once on the CPU, drawn as a flat grey wireframe
 * at 0.1 opacity, with the plane slowly rotating. It never actually flowed.
 *
 * Here the displacement lives in the vertex shader, so the field genuinely
 * moves, the per frame CPU cost is one uniform write, and grid density becomes a
 * setting a visitor can safely turn up.
 *
 * This is the only thing on the site that animates continuously and above the
 * fold, so it renders in one draw call, caps the pixel ratio hard, and stops
 * entirely when the tab is hidden.
 */

/**
 * three's `Color.setStyle` does not understand `oklch()`: it warns and falls
 * back to white. The palette is authored in oklch, so convert it here.
 * Returns linear light sRGB, which is what `setRGB` wants.
 */
function oklchToLinearRgb(L: number, C: number, hDeg: number): THREE.Color {
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;

  const clamp = (v: number) => Math.max(0, Math.min(1, v));
  return new THREE.Color().setRGB(
    clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
    THREE.LinearSRGBColorSpace,
  );
}

const PLANE = 900;
const CAMERA_Y = 30;
const CAMERA_Z = 130;

/** 2D simplex noise, Ashima Arts and Stefan Gustavson, MIT licensed. */
const SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                          dot(x12.zw, x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmplitude;
uniform float uScale;
uniform vec2  uPointer;
uniform float uLift;
uniform float uGlow;
varying float vHeight;
varying float vFade;
varying float vNear;

${SIMPLEX}

void main() {
  vec3 p = position;

  // The plane is authored flat in XY, so z is height until it is rotated.
  //
  // Two low frequency layers crossing each other, and deliberately no high
  // frequency octave. An octave at roughly twice the frequency is what turns
  // this into jagged peaks: at coarse grid density its features span only a few
  // cells, so they render as triangles rather than curves. Long wavelengths
  // sampled by many cells are what read as rolling waves.
  vec2 q = p.xy * uScale;
  float a = snoise(q + vec2(uTime, uTime * 0.45));
  float b = snoise(q * 0.55 - vec2(uTime * 0.7, uTime * 0.3));
  float h = (a * 0.68 + b * 0.52) * uAmplitude;

  // The cursor swell: a smooth bump that falls off with distance.
  float d = distance(p.xy, uPointer);
  float bump = exp(-(d * d) / 5200.0);
  h += bump * uAmplitude * 1.6 * uLift;

  p.z += h;
  vHeight = clamp(h / max(uAmplitude, 0.001) * 0.5 + 0.5, 0.0, 1.0);
  vNear = bump * uGlow;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  // Dissolve toward the horizon, and again right at the camera, so the grid has
  // no visible edges in either direction.
  float dist = -mv.z;
  vFade = smoothstep(40.0, 190.0, dist) * (1.0 - smoothstep(150.0, 370.0, dist));

  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3  uLow;
uniform vec3  uHigh;
uniform float uOpacity;
varying float vHeight;
varying float vFade;
varying float vNear;

void main() {
  vec3 c = mix(uLow, uHigh, vHeight);
  float a = vFade * uOpacity * (0.38 + vNear * 0.8);
  if (a <= 0.001) discard;
  gl_FragColor = vec4(c, a);
}
`;

/**
 * Horizontal and vertical grid lines only. `wireframe: true` on a plane draws
 * the triangle diagonals too, which reads as busy noise rather than a grid.
 */
function gridLines(size: number, segments: number) {
  const step = size / segments;
  const half = size / 2;
  const positions: number[] = [];

  for (let i = 0; i <= segments; i++) {
    const v = -half + i * step;
    for (let j = 0; j < segments; j++) {
      const a = -half + j * step;
      const b = a + step;
      positions.push(a, v, 0, b, v, 0); // along X
      positions.push(v, a, 0, v, b, 0); // along Y
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  return geometry;
}

export function Terrain() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const accent = ACCENTS[theme.accent] ?? ACCENTS.ember;
  const dark = theme.mode === "dark";
  const flow = FLOWS[theme.flow] ?? FLOWS.slow;
  const terrain = TERRAINS[theme.terrain] ?? TERRAINS.gentle;
  const grid = GRIDS[theme.grid] ?? GRIDS.medium;
  const show = SHOWS[theme.show] ?? SHOWS.visible;
  const cursor = CURSORS[theme.cursor] ?? CURSORS.swell;
  const motionOff = theme.motion === "none";

  useEffect(() => {
    const host = hostRef.current;
    if (!host || show.opacity === 0) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Ambient drift and direct interaction are separate ideas. `Flow: still`
    // stops the field drifting but the cursor should still answer, because that
    // is the visitor moving it rather than the page moving on its own. Only
    // `Motion: none` or the OS preference silences both.
    const quiet = motionOff || reduced;
    const still = quiet || flow.speed === 0;
    const reactive = !quiet && (cursor.lift > 0 || cursor.glow > 0);

    // Lower than anywhere else on the site: this is a soft backdrop where extra
    // resolution buys nothing and costs every frame.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    const el = renderer.domElement;
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.display = "block";
    host.appendChild(el);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / Math.max(1, window.innerHeight),
      1,
      1200,
    );
    camera.position.set(0, CAMERA_Y, CAMERA_Z);
    camera.lookAt(0, 54, -300);

    const geometry = gridLines(PLANE, grid.segments);
    const uniforms = {
      uTime: { value: 0 },
      uAmplitude: { value: terrain.amplitude },
      uScale: { value: terrain.scale },
      uPointer: { value: new THREE.Vector2(1e6, 1e6) },
      uLift: { value: cursor.lift },
      uGlow: { value: cursor.glow },
      uOpacity: { value: show.opacity },
      uLow: {
        value: oklchToLinearRgb(dark ? 0.42 : 0.86, accent.c * 0.5, accent.h),
      },
      uHigh: {
        value: oklchToLinearRgb(dark ? 0.86 : 0.55, accent.c, accent.h),
      },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      depthWrite: false,
    });

    const lines = new THREE.LineSegments(geometry, material);
    lines.rotation.x = -Math.PI / 2;
    scene.add(lines);

    // ---- pointer, with no layout reads ------------------------------------
    // The canvas is fixed at inset 0, so device coordinates come straight from
    // the viewport size. Nothing here touches the DOM for geometry.
    const target = new THREE.Vector2(1e6, 1e6);
    const current = new THREE.Vector2(1e6, 1e6);
    let hasPointer = false;

    const ray = new THREE.Ray();
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const hit = new THREE.Vector3();
    const ndc = new THREE.Vector3();

    const onPointerMove = (e: PointerEvent) => {
      if (!reactive) return;
      ndc.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1,
        0.5,
      );
      // Camera ray against the ground plane, solved directly rather than with a
      // Raycaster, since there is nothing to traverse.
      ndc.unproject(camera);
      ray.origin.copy(camera.position);
      ray.direction.copy(ndc.sub(camera.position).normalize());
      if (!ray.intersectPlane(plane, hit)) return;
      // The plane is rotated flat, so world XZ maps to the shader's local XY.
      target.set(hit.x, -hit.z);
      hasPointer = true;
      // A still field still needs a frame to show the swell move.
      request();
    };
    const onPointerLeave = () => {
      hasPointer = false;
      request();
    };

    // ---- loop --------------------------------------------------------------
    let frame = 0;
    let running = true;
    const clock = new THREE.Clock();

    const draw = () => {
      frame = 0;
      const dt = Math.min(clock.getDelta(), 0.05);

      if (!still) uniforms.uTime.value += dt * flow.speed;

      // Ease the swell toward the cursor so it trails rather than snaps, and
      // retreats off screen when the pointer leaves.
      let settling = false;
      if (hasPointer) {
        current.lerp(target, 1 - Math.pow(0.0015, dt));
        settling = current.distanceToSquared(target) > 0.25;
      } else {
        current.set(1e6, 1e6);
      }
      uniforms.uPointer.value.copy(current);

      renderer.render(scene, camera);
      // Keep drawing while the field drifts, or while the swell is catching up.
      if (running && (!still || settling)) request();
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / Math.max(1, window.innerHeight);
      camera.updateProjectionMatrix();
      request();
    };

    // A background animating in a hidden tab is pure wasted battery.
    const onVisibility = () => {
      running = !document.hidden;
      if (running) {
        clock.getDelta();
        request();
      } else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      el.remove();
    };
  }, [
    accent.c,
    accent.h,
    dark,
    flow.speed,
    terrain.amplitude,
    terrain.scale,
    grid.segments,
    show.opacity,
    cursor.lift,
    cursor.glow,
    motionOff,
  ]);

  return <div ref={hostRef} className="size-full" />;
}
