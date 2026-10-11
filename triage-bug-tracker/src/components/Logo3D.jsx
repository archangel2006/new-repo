"use client";

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { Edges } from "@react-three/drei";
// Default dark colors — can be overridden via props
const DEFAULT_BG_HEX = "#0e0e10";
const DEFAULT_LINE_HEX = "#58585e";
const LINE_WIDTH = 1.2;
// Module-level color refs so inner components can read them
let activeBgHex = DEFAULT_BG_HEX;
let activeLineHex = DEFAULT_LINE_HEX;
let activeStripeOpacityBase = 0.35;
// Generate a horizontal-line texture via canvas
function makeStripeTexture(opacity = 0.35) {
    const size = 64;
    const lineSpacing = 4;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = `rgba(${activeLineHex === DEFAULT_LINE_HEX ? '88, 88, 94' : '120, 120, 130'}, ${opacity})`;
    ctx.lineWidth = 1;
    for (let y = 0; y < size; y += lineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(size, y + 0.5);
        ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 1);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
}
function useStripeMaterial(opacity = 0.35) {
    const texture = useMemo(() => makeStripeTexture(opacity), [opacity]);
    const mat = useMemo(() => new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
    }), [texture]);
    return mat;
}
// Shared slow rotation
function SlowSpin({ children }) {
    const ref = useRef(null);
    useFrame((_, delta) => {
        ref.current.rotation.y += delta * 0.3;
    });
    return _jsx("group", { ref: ref, children: children });
}
// Helper: a face mesh that uses canvas-based stripes
function StripeFace({ position, rotation, args, opacity = 0.35, }) {
    const texture = useMemo(() => makeStripeTexture(opacity), [opacity]);
    return (_jsxs("mesh", { position: position, rotation: rotation, children: [_jsx("planeGeometry", { args: args || [1.3, 1.3] }), _jsx("meshBasicMaterial", { map: texture, transparent: true, side: THREE.FrontSide, depthWrite: false })] }));
}
// Box with stripes on all 6 faces
function StripedBox({ width = 1.3, height = 1.3, depth = 1.3, opacity = 0.25, }) {
    const hx = width / 2 + 0.01;
    const hy = height / 2 + 0.01;
    const hz = depth / 2 + 0.01;
    const faces = [
        { pos: [0, 0, hz], rot: [0, 0, 0], args: [width, height] },
        { pos: [0, 0, -hz], rot: [0, Math.PI, 0], args: [width, height] },
        { pos: [hx, 0, 0], rot: [0, Math.PI / 2, 0], args: [depth, height] },
        { pos: [-hx, 0, 0], rot: [0, -Math.PI / 2, 0], args: [depth, height] },
        { pos: [0, hy, 0], rot: [-Math.PI / 2, 0, 0], args: [width, depth] },
        { pos: [0, -hy, 0], rot: [Math.PI / 2, 0, 0], args: [width, depth] },
    ];
    return (_jsx(_Fragment, { children: faces.map((f, i) => (_jsx(StripeFace, { position: f.pos, rotation: f.rot, args: f.args, opacity: opacity }, i))) }));
}
// 1. Single cube with one highlighted face
function CubeHighlight() {
    return (_jsx(SlowSpin, { children: _jsxs("group", { rotation: [Math.PI * 0.15, Math.PI * 0.25, 0], children: [_jsxs("mesh", { children: [_jsx("boxGeometry", { args: [1.3, 1.3, 1.3] }), _jsx("meshBasicMaterial", { transparent: true, opacity: 0 }), _jsx(Edges, { lineWidth: LINE_WIDTH, color: activeLineHex })] }), _jsx(StripedBox, { width: 1.3, height: 1.3, depth: 1.3, opacity: 0.3 })] }) }));
}
// 2. Three stacked offset cubes (priority tiers)
function StackedCubes() {
    return (_jsx(SlowSpin, { children: _jsx("group", { rotation: [Math.PI * 0.15, Math.PI * 0.25, 0], children: [0.5, 0, -0.5].map((y, i) => (_jsxs("group", { position: [i * 0.12, y, -i * 0.12], children: [_jsxs("mesh", { children: [_jsx("boxGeometry", { args: [0.7, 0.35, 0.7] }), _jsx("meshBasicMaterial", { color: activeBgHex, toneMapped: false }), _jsx(Edges, { lineWidth: LINE_WIDTH, color: activeLineHex })] }), _jsx(StripedBox, { width: 0.7, height: 0.35, depth: 0.7, opacity: 0.2 })] }, i))) }) }));
}
// 3. Triangular prism
function Prism() {
    const geometry = useMemo(() => {
        const shape = new THREE.Shape();
        const s = 0.75;
        shape.moveTo(0, s);
        shape.lineTo(-s * 0.866, -s * 0.5);
        shape.lineTo(s * 0.866, -s * 0.5);
        shape.closePath();
        const extrudeSettings = { depth: 0.8, bevelEnabled: false };
        return new THREE.ExtrudeGeometry(shape, extrudeSettings);
    }, []);
    const mat = useStripeMaterial(0.25);
    return (_jsx(SlowSpin, { children: _jsxs("group", { rotation: [Math.PI * 0.15, Math.PI * 0.25, 0], children: [_jsx("mesh", { geometry: geometry, position: [0, 0, -0.4], material: mat }), _jsxs("mesh", { geometry: geometry, position: [0, 0, -0.4], children: [_jsx("meshBasicMaterial", { transparent: true, opacity: 0 }), _jsx(Edges, { lineWidth: LINE_WIDTH, color: activeLineHex })] })] }) }));
}
// 4. Open cube with inner diagonal plane
function OpenCube() {
    const diagMat = useStripeMaterial(0.15);
    return (_jsx(SlowSpin, { children: _jsxs("group", { rotation: [Math.PI * 0.15, Math.PI * 0.25, 0], children: [_jsxs("mesh", { children: [_jsx("boxGeometry", { args: [1.3, 1.3, 1.3] }), _jsx("meshBasicMaterial", { transparent: true, opacity: 0 }), _jsx(Edges, { lineWidth: LINE_WIDTH, color: activeLineHex })] }), _jsx(StripedBox, { width: 1.3, height: 1.3, depth: 1.3, opacity: 0.2 }), _jsx("mesh", { rotation: [0, Math.PI * 0.25, 0], material: diagMat, children: _jsx("planeGeometry", { args: [1.8, 1.3] }) })] }) }));
}
// 5. Three converging planes
function ConvergingPlanes() {
    return (_jsx(SlowSpin, { children: _jsxs("group", { rotation: [Math.PI * 0.1, Math.PI * 0.2, 0], children: [[0, 1, 2].map((i) => (_jsx(StripeFace, { rotation: [0, (Math.PI * 2 * i) / 3, 0], position: [
                        Math.sin((Math.PI * 2 * i) / 3) * 0.15,
                        0,
                        Math.cos((Math.PI * 2 * i) / 3) * 0.15,
                    ], args: [1, 1.3], opacity: i === 0 ? 0.35 : i === 1 ? 0.2 : 0.1 }, i))), _jsxs("mesh", { children: [_jsx("cylinderGeometry", { args: [0.02, 0.02, 1.3, 8] }), _jsx("meshBasicMaterial", { color: "#fff", transparent: true, opacity: 0.5 })] })] }) }));
}
const LOGOS = [
    { name: "Cube", component: CubeHighlight },
    { name: "Stacked", component: StackedCubes },
    { name: "Prism", component: Prism },
    { name: "Open Cube", component: OpenCube },
    { name: "Planes", component: ConvergingPlanes },
];
function CameraZoomController({ zoom }) {
    const { camera } = useThree();
    useEffect(() => {
        const ortho = camera;
        ortho.zoom = zoom;
        ortho.updateProjectionMatrix();
    }, [camera, zoom]);
    return null;
}
export { LOGOS };
export function Logo3D({ variant = 0, size = 28, zoom: zoomOverride, bgHex, lineHex }) {
    const LogoComponent = LOGOS[variant]?.component || CubeHighlight;
    // Update module-level colors so inner components pick them up
    activeBgHex = bgHex || DEFAULT_BG_HEX;
    activeLineHex = lineHex || DEFAULT_LINE_HEX;
    const zoom = zoomOverride ?? size * (200 / 28);
    return (_jsx("div", { style: { width: size, height: size }, className: "shrink-0", children: _jsxs(Canvas, { flat: true, orthographic: true, dpr: [2, 3], camera: { position: [0, 0, 4], zoom: zoom }, style: { background: "transparent" }, gl: { alpha: true, antialias: true }, children: [_jsx(CameraZoomController, { zoom: zoom }), _jsx(LogoComponent, {})] }) }));
}
