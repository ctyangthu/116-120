/**
 * 東海大學精神象徵 — 路思義教堂 (The Luce Chapel) 與四大發展構面 3D 空間藍圖
 * 符合 Three.js Skill Directives:
 * - 複合 3-12 組件程序化建築模型 (THREE.Group)
 * - Studio PBR 燈光、RoomEnvironment 反射、冷暖色溫與地平線霧氣融合
 * - 軟體 WebGL (isSoftwareGl) 效能防護
 * - 零外部檔案 (純程序化紋理生成)
 * - 符合規範的底置折疊控制面板 (Collapsible Bottom Dock, 無覆蓋中樞視角)
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PILLARS_DATA, Pillar } from '../data/planData';
import { Compass, RotateCw, Sun, Moon, Sunset, Maximize2, Layers, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface Campus3DViewerProps {
  selectedPillarId: string | null;
  onSelectPillar: (pillarId: string) => void;
  onExplorePlan: (pillarId: string) => void;
}

// Procedural texture generator for Luce Chapel diamond ceramic tiles
function createChapelTileTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm ochre-yellow terracotta base (東海路思義教堂經典黃磚)
  ctx.fillStyle = '#d49b4b';
  ctx.fillRect(0, 0, 512, 512);

  // Draw diamond ceramic tile grid pattern
  ctx.strokeStyle = '#8c5823';
  ctx.lineWidth = 3;

  const tileSize = 32;
  for (let x = -512; x < 1024; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + 512, 512);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, 512);
    ctx.lineTo(x + 512, 0);
    ctx.stroke();
  }

  // Add subtle color noise and bevel highlight to individual tiles
  for (let y = 0; y < 512; y += tileSize) {
    for (let x = 0; x < 512; x += tileSize) {
      const shade = Math.random() * 25 - 12;
      ctx.fillStyle = `rgba(255, 235, 180, ${0.08 + Math.random() * 0.08})`;
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Procedural grass lawn texture
function createLawnTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2d5a27';
  ctx.fillRect(0, 0, 512, 512);

  // subtle noise blades
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const g = Math.floor(70 + Math.random() * 50);
    ctx.fillStyle = `rgb(35, ${g}, 25)`;
    ctx.fillRect(x, y, 2, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const Campus3DViewer: React.FC<Campus3DViewerProps> = ({
  selectedPillarId,
  onSelectPillar,
  onExplorePlan
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSoftwareGl, setIsSoftwareGl] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'dusk' | 'night'>('dusk');
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [hoveredPillar, setHoveredPillar] = useState<Pillar | null>(null);

  // References to keep animation loop & controls state without re-creating scene
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const pillarMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const lightsRef = useRef<{
    dirLight: THREE.DirectionalLight;
    hemiLight: THREE.HemisphereLight;
    fog: THREE.FogExp2;
  } | null>(null);

  // Camera animation target
  const cameraTargetRef = useRef<{
    position: THREE.Vector3;
    lookAt: THREE.Vector3;
    active: boolean;
  }>({
    position: new THREE.Vector3(0, 16, 26),
    lookAt: new THREE.Vector3(0, 3, 0),
    active: false
  });

  // Pillar positions in circle around Luce Chapel
  const pillarCoordinates: Record<string, { x: number; z: number; colorHex: number }> = {
    'pillar-1': { x: -14, z: 8, colorHex: 0x10b981 }, // 永續發展 (South-West)
    'pillar-2': { x: -14, z: -8, colorHex: 0xf59e0b }, // 文理融合 (North-West)
    'pillar-3': { x: 14, z: -8, colorHex: 0x0ea5e9 }, // AI 實踐 (North-East)
    'pillar-4': { x: 14, z: 8, colorHex: 0x8b5cf6 }   // 國際接軌 (South-East)
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect Software WebGL
    let softwareGlDetected = false;
    try {
      const probeCanvas = document.createElement('canvas');
      const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        softwareGlDetected = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } else {
        softwareGlDetected = true;
      }
    } catch {
      softwareGlDetected = true;
    }
    setIsSoftwareGl(softwareGlDetected);

    // 2. Initialize Three.js Scene & Renderer
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const bgColors = {
      day: 0x8ec5fc,
      dusk: 0x1a1c2e,
      night: 0x090b14
    };
    scene.background = new THREE.Color(bgColors.dusk);
    const fog = new THREE.FogExp2(bgColors.dusk, 0.015);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.5, 300);
    camera.position.set(0, 16, 28);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !softwareGlDetected,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(softwareGlDetected ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !softwareGlDetected;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Mandatory Studio Environment Reflection (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig (Warm key light + cool hemisphere fill)
    const hemiLight = new THREE.HemisphereLight(0xffecd2, 0x1e2438, 0.9);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff3db, 2.2);
    dirLight.position.set(22, 35, 18);
    dirLight.castShadow = !softwareGlDetected;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 5;
    dirLight.shadow.camera.far = 100;
    const d = 26;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);

    // Subtle blue rim light from opposite angle
    const rimLight = new THREE.DirectionalLight(0x7fb5ff, 0.7);
    rimLight.position.set(-20, 20, -20);
    scene.add(rimLight);

    lightsRef.current = { dirLight, hemiLight, fog };

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !softwareGlDetected;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below ground
    controls.minDistance = 8;
    controls.maxDistance = 60;
    controls.target.set(0, 3, 0);
    controlsRef.current = controls;

    // Cancel scripted transitions when user manually drags
    controls.addEventListener('start', () => {
      cameraTargetRef.current.active = false;
    });

    // 6. BUILD PROCEDURAL SCENE:
    // (A) Ground & Lawn Plinth (Campus lawn of Tunghai University)
    const lawnTexture = createLawnTexture();
    const groundGeo = new THREE.CylinderGeometry(36, 38, 1, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      map: lawnTexture,
      roughness: 0.85,
      metalness: 0.05
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.5;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Concrete Chapel Podium Base (Plinth)
    const baseGeo = new THREE.BoxGeometry(18, 0.4, 26);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x9fa8a3,
      roughness: 0.8,
      metalness: 0.1
    });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.set(0, 0.2, 0);
    baseMesh.receiveShadow = true;
    baseMesh.castShadow = true;
    scene.add(baseMesh);

    // Stone Steps & Entrance pathway (文理大道風格步道)
    const pathGeo = new THREE.PlaneGeometry(5, 18);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0x8a929a,
      roughness: 0.75,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1
    });
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.rotation.x = -Math.PI / 2;
    pathMesh.position.set(0, 0.41, 14);
    pathMesh.receiveShadow = true;
    scene.add(pathMesh);

    // Soft Radial Contact Shadow under Chapel
    const contactCanvas = document.createElement('canvas');
    contactCanvas.width = 256;
    contactCanvas.height = 256;
    const cctx = contactCanvas.getContext('2d')!;
    const grad = cctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0,0,0,0.6)');
    grad.addColorStop(0.6, 'rgba(0,0,0,0.25)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    cctx.fillStyle = grad;
    cctx.fillRect(0, 0, 256, 256);
    const contactTex = new THREE.CanvasTexture(contactCanvas);
    const contactPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 28),
      new THREE.MeshBasicMaterial({
        map: contactTex,
        transparent: true,
        depthWrite: false,
        opacity: 0.85
      })
    );
    contactPlane.rotation.x = -Math.PI / 2;
    contactPlane.position.y = 0.42;
    scene.add(contactPlane);

    // (B) BUILD PROCEDURAL LUCE CHAPEL (路思義教堂)
    // 3-12 component procedural group:
    // 1. Left curved front shell
    // 2. Right curved front shell
    // 3. Left curved rear shell
    // 4. Right curved rear shell
    // 5. Central glazed ridge skylight
    // 6. Front triangular stained glass wall
    // 7. Rear triangular window structure
    // 8. Top golden cross spire
    // 9. Concrete entrance porch canopy
    // 10. Foundation plinth
    const chapelGroup = new THREE.Group();
    chapelGroup.position.set(0, 0.4, 0);

    const tileTexture = createChapelTileTexture();
    const shellMat = new THREE.MeshPhysicalMaterial({
      map: tileTexture,
      roughness: 0.4,
      metalness: 0.15,
      clearcoat: 0.35,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide
    });

    // Helper to generate a conoid / hyperbolic paraboloid wing for Luce Chapel
    function createChapelWingGeometry(
      invertX: boolean,
      invertZ: boolean
    ): THREE.BufferGeometry {
      const uSegs = 24;
      const vSegs = 32;
      const positions: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      const heightMax = 11.8; // Peak height
      const lengthHalf = 9.5; // Half length of chapel

      for (let i = 0; i <= vSegs; i++) {
        const v = i / vSegs; // 0 = base, 1 = top ridge
        const y = v * heightMax;

        // Base width is wide in the middle, narrow at ends; top ridge is narrow
        const width = (1 - v * 0.85) * 6.8;
        // Inward curvature characteristic of Pei's conoid
        const curveOffset = Math.sin(v * Math.PI) * 0.9;

        for (let j = 0; j <= uSegs; j++) {
          const u = j / uSegs; // 0 = ridge, 1 = eave edge
          const zProgress = (1 - v) * 0.9 + 0.1;
          const z = (u * lengthHalf * zProgress) * (invertZ ? -1 : 1);
          const x = (Math.pow(u, 1.25) * width - curveOffset * (1 - u)) * (invertX ? -1 : 1);

          positions.push(x, y, z);
          uvs.push(u * 2, v * 3);
        }
      }

      for (let i = 0; i < vSegs; i++) {
        for (let j = 0; j < uSegs; j++) {
          const a = i * (uSegs + 1) + j;
          const b = (i + 1) * (uSegs + 1) + j;
          const c = (i + 1) * (uSegs + 1) + j + 1;
          const d = i * (uSegs + 1) + j + 1;

          if (invertX !== invertZ) {
            indices.push(a, b, d);
            indices.push(b, c, d);
          } else {
            indices.push(a, d, b);
            indices.push(b, d, c);
          }
        }
      }

      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geom.setIndex(indices);
      geom.computeVertexNormals();
      return geom;
    }

    // Four parabolic curved shells
    const wingFL = new THREE.Mesh(createChapelWingGeometry(false, false), shellMat);
    const wingFR = new THREE.Mesh(createChapelWingGeometry(true, false), shellMat);
    const wingBL = new THREE.Mesh(createChapelWingGeometry(false, true), shellMat);
    const wingBR = new THREE.Mesh(createChapelWingGeometry(true, true), shellMat);

    [wingFL, wingFR, wingBL, wingBR].forEach(wing => {
      wing.castShadow = !softwareGlDetected;
      wing.receiveShadow = true;
      chapelGroup.add(wing);
    });

    // Central Ridge Glass Skylight (黃金天窗隙縫)
    const ridgeGlassGeo = new THREE.BoxGeometry(0.5, 0.4, 18.2);
    const ridgeGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x99ddff,
      transmission: softwareGlDetected ? 0 : 0.8,
      transparent: true,
      opacity: softwareGlDetected ? 0.6 : 0.9,
      roughness: 0.1,
      metalness: 0.1,
      emissive: 0x224466,
      emissiveIntensity: 0.2
    });
    const ridgeGlassMesh = new THREE.Mesh(ridgeGlassGeo, ridgeGlassMat);
    ridgeGlassMesh.position.set(0, 11.75, 0);
    chapelGroup.add(ridgeGlassMesh);

    // Front Facade (Front glass & frame with entrance door)
    const frontFacadeGroup = new THREE.Group();
    frontFacadeGroup.position.set(0, 0, 9.4);

    // Triangular glass window pane
    const frontGlassShape = new THREE.Shape();
    frontGlassShape.moveTo(-3.2, 0);
    frontGlassShape.lineTo(3.2, 0);
    frontGlassShape.lineTo(0.2, 11.6);
    frontGlassShape.lineTo(-0.2, 11.6);
    frontGlassShape.closePath();

    const frontGlassGeo = new THREE.ShapeGeometry(frontGlassShape);
    const frontGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x6295c2,
      transmission: softwareGlDetected ? 0 : 0.6,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    const frontGlassMesh = new THREE.Mesh(frontGlassGeo, frontGlassMat);
    frontFacadeGroup.add(frontGlassMesh);

    // Front timber / steel lattice beams
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x2d1f14,
      roughness: 0.6,
      metalness: 0.4
    });

    for (let f = 1.5; f < 10.5; f += 1.8) {
      const w = ((11.6 - f) / 11.6) * 5.6;
      const bar = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, 0.15), frameMat);
      bar.position.set(0, f, 0.05);
      frontFacadeGroup.add(bar);
    }

    // Vertical center mullion
    const vertMullion = new THREE.Mesh(new THREE.BoxGeometry(0.16, 11.5, 0.18), frameMat);
    vertMullion.position.set(0, 5.75, 0.05);
    frontFacadeGroup.add(vertMullion);

    // Entrance Porch
    const porchMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2d, roughness: 0.7 });
    const porch = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.6), porchMat);
    porch.position.set(0, 1.2, 0.3);
    frontFacadeGroup.add(porch);

    chapelGroup.add(frontFacadeGroup);

    // Rear Facade (Rear glass & frame)
    const rearFacadeGroup = frontFacadeGroup.clone();
    rearFacadeGroup.position.set(0, 0, -9.4);
    rearFacadeGroup.rotation.y = Math.PI;
    chapelGroup.add(rearFacadeGroup);

    // Cross on top (路思義教堂十字架)
    const crossGroup = new THREE.Group();
    crossGroup.position.set(0, 12.0, 0);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd152,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0xaa7810,
      emissiveIntensity: 0.3
    });
    const crossVert = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.8, 12), goldMat);
    crossVert.position.y = 0.9;
    crossGroup.add(crossVert);

    const crossHoriz = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.1, 12), goldMat);
    crossHoriz.rotation.z = Math.PI / 2;
    crossHoriz.position.y = 1.25;
    crossGroup.add(crossHoriz);

    chapelGroup.add(crossGroup);
    scene.add(chapelGroup);

    // (C) SURROUNDING CAMPUS LANDSCAPE: TREES (3-12 parts procedural banyan & pine trees)
    const treeGroup = new THREE.Group();
    const treePositions = [
      { x: -18, z: 0, s: 1.1 },
      { x: -16, z: -16, s: 0.9 },
      { x: 0, z: -19, s: 1.05 },
      { x: 18, z: 0, s: 1.15 },
      { x: 17, z: 15, s: 0.95 },
      { x: -17, z: 16, s: 1.0 },
      { x: 0, z: 20, s: 0.85 }
    ];

    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.9 });
    const foliageMat1 = new THREE.MeshStandardMaterial({ color: 0x1d5928, roughness: 0.7 });
    const foliageMat2 = new THREE.MeshStandardMaterial({ color: 0x2e6f33, roughness: 0.65 });

    treePositions.forEach(tp => {
      const tree = new THREE.Group();
      tree.position.set(tp.x, 0, tp.z);
      tree.scale.setScalar(tp.s);

      // Trunk
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.6, 3.5, 8), trunkMat);
      trunk.position.y = 1.75;
      trunk.castShadow = !softwareGlDetected;
      tree.add(trunk);

      // Multi-layer organic foliage canopy
      const c1 = new THREE.Mesh(new THREE.DodecahedronGeometry(2.2, 1), foliageMat1);
      c1.position.set(0, 4.2, 0);
      c1.castShadow = !softwareGlDetected;
      tree.add(c1);

      const c2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6, 1), foliageMat2);
      c2.position.set(0.6, 5.2, -0.4);
      c2.castShadow = !softwareGlDetected;
      tree.add(c2);

      const c3 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5, 1), foliageMat1);
      c3.position.set(-0.5, 4.8, 0.5);
      c3.castShadow = !softwareGlDetected;
      tree.add(c3);

      treeGroup.add(tree);
    });
    scene.add(treeGroup);

    // (D) BUILD 4 STRATEGIC PILLAR MONOLITHS (四大構面互動石碑與能量光環)
    const pillarMeshes = new Map<string, THREE.Group>();

    PILLARS_DATA.forEach(pillar => {
      const coords = pillarCoordinates[pillar.id];
      if (!coords) return;

      const pGroup = new THREE.Group();
      pGroup.position.set(coords.x, 0, coords.z);
      pGroup.name = pillar.id;

      // Base plinth
      const pBase = new THREE.Mesh(
        new THREE.CylinderGeometry(2.0, 2.2, 0.4, 16),
        new THREE.MeshStandardMaterial({ color: 0x242d38, roughness: 0.6, metalness: 0.3 })
      );
      pBase.position.y = 0.2;
      pBase.castShadow = !softwareGlDetected;
      pBase.receiveShadow = true;
      pGroup.add(pBase);

      // Monolith Obelisk Body (Tapered architectural stone with bevel)
      const obeliskGeo = new THREE.CylinderGeometry(0.8, 1.2, 5.2, 6);
      const obeliskMat = new THREE.MeshStandardMaterial({
        color: 0x18202c,
        roughness: 0.3,
        metalness: 0.7
      });
      const obelisk = new THREE.Mesh(obeliskGeo, obeliskMat);
      obelisk.position.y = 2.8;
      obelisk.castShadow = !softwareGlDetected;
      pGroup.add(obelisk);

      // Glowing Thematic Core Crystal
      const coreGeo = new THREE.OctahedronGeometry(0.7, 0);
      const coreMat = new THREE.MeshPhysicalMaterial({
        color: coords.colorHex,
        emissive: coords.colorHex,
        emissiveIntensity: 0.85,
        roughness: 0.1,
        metalness: 0.9,
        clearcoat: 1.0
      });
      const core = new THREE.Mesh(coreGeo, coreMat);
      core.position.y = 5.8;
      core.name = `${pillar.id}_core`;
      pGroup.add(core);

      // Hovering Orbital Halo Ring
      const ringGeo = new THREE.TorusGeometry(1.4, 0.08, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: coords.colorHex,
        transparent: true,
        opacity: 0.8
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = 5.8;
      ring.rotation.x = Math.PI / 2;
      ring.name = `${pillar.id}_ring`;
      pGroup.add(ring);

      // Ground Emissive Projector Decal Ring
      const groundRingGeo = new THREE.RingGeometry(1.8, 2.3, 32);
      const groundRingMat = new THREE.MeshBasicMaterial({
        color: coords.colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
        polygonOffset: true,
        polygonOffsetFactor: -2,
        polygonOffsetUnits: -2
      });
      const groundRing = new THREE.Mesh(groundRingGeo, groundRingMat);
      groundRing.rotation.x = -Math.PI / 2;
      groundRing.position.y = 0.42;
      pGroup.add(groundRing);

      // Raycast helper box
      const hitBox = new THREE.Mesh(
        new THREE.CylinderGeometry(2.5, 2.5, 7.5, 8),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitBox.position.y = 3.5;
      hitBox.userData = { pillarId: pillar.id };
      pGroup.add(hitBox);

      scene.add(pGroup);
      pillarMeshes.set(pillar.id, pGroup);
    });

    pillarMeshesRef.current = pillarMeshes;

    // 7. Raycasting for hover & click
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const hit = intersects.find(i => i.object.userData?.pillarId);

      if (hit) {
        const pillarId = hit.object.userData.pillarId;
        const pillar = PILLARS_DATA.find(p => p.id === pillarId) || null;
        setHoveredPillar(pillar);
        container.style.cursor = 'pointer';
      } else {
        setHoveredPillar(null);
        container.style.cursor = 'default';
      }
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      const hit = intersects.find(i => i.object.userData?.pillarId);

      if (hit) {
        const pillarId = hit.object.userData.pillarId;
        onSelectPillar(pillarId);
        // Animate camera to focus on that pillar
        const coords = pillarCoordinates[pillarId];
        if (coords) {
          cameraTargetRef.current = {
            position: new THREE.Vector3(coords.x * 1.5, 8, coords.z * 1.5 + 4),
            lookAt: new THREE.Vector3(coords.x, 3.5, coords.z),
            active: true
          };
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // 8. Animation & Render Loop
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const glContext = renderer.getContext() as WebGL2RenderingContext;
      const sync = glContext.fenceSync(glContext.SYNC_GPU_COMMANDS_COMPLETE, 0);
      glContext.flush();
      const poll = () => {
        const state = sync && glContext.getSyncParameter(sync, glContext.SYNC_STATUS);
        if (state === glContext.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) glContext.deleteSync(sync);
          frameId = window.setTimeout(cb, 75);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    const animate = () => {
      const dt = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Subtle rotation of pillar cores and orbital rings
      pillarMeshes.forEach(pg => {
        const core = pg.getObjectByName(`${pg.name}_core`);
        const ring = pg.getObjectByName(`${pg.name}_ring`);
        if (core) {
          core.rotation.y += 0.8 * dt;
          core.rotation.x = Math.sin(elapsedTime * 1.5) * 0.15;
          core.position.y = 5.8 + Math.sin(elapsedTime * 2 + pg.position.x) * 0.15;
        }
        if (ring) {
          ring.rotation.z += 0.5 * dt;
          ring.rotation.x = Math.PI / 2 + Math.sin(elapsedTime) * 0.1;
        }
      });

      // Smooth camera transition if active
      if (cameraTargetRef.current.active) {
        camera.position.lerp(cameraTargetRef.current.position, 0.05);
        controls.target.lerp(cameraTargetRef.current.lookAt, 0.05);
        controls.update();

        if (camera.position.distanceTo(cameraTargetRef.current.position) < 0.2) {
          cameraTargetRef.current.active = false;
        }
      } else {
        if (isAutoRotating) {
          scene.rotation.y += 0.0025;
        }
        controls.update();
      }

      renderer.render(scene, camera);

      if (softwareGlDetected) {
        afterDraw(animate);
      } else {
        frameId = requestAnimationFrame(animate);
      }
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []); // Run once on mount

  // Watch selectedPillarId prop to orbit camera to it
  useEffect(() => {
    if (!selectedPillarId || !controlsRef.current || !cameraRef.current) return;
    const coords = pillarCoordinates[selectedPillarId];
    if (coords) {
      cameraTargetRef.current = {
        position: new THREE.Vector3(coords.x * 1.35, 7.5, coords.z * 1.35 + 5),
        lookAt: new THREE.Vector3(coords.x, 3.2, coords.z),
        active: true
      };
    }
  }, [selectedPillarId]);

  // Handle Time of Day lighting changes
  const applyTimeOfDay = useCallback((tod: 'day' | 'dusk' | 'night') => {
    setTimeOfDay(tod);
    const scene = sceneRef.current;
    const lights = lightsRef.current;
    if (!scene || !lights) return;

    if (tod === 'day') {
      scene.background = new THREE.Color(0x76b2fe);
      lights.fog.color.setHex(0x76b2fe);
      lights.dirLight.color.setHex(0xfffae8);
      lights.dirLight.intensity = 2.4;
      lights.hemiLight.color.setHex(0xffffff);
      lights.hemiLight.groundColor.setHex(0x334455);
      lights.hemiLight.intensity = 1.0;
    } else if (tod === 'dusk') {
      scene.background = new THREE.Color(0x1a1c2e);
      lights.fog.color.setHex(0x1a1c2e);
      lights.dirLight.color.setHex(0xff9944);
      lights.dirLight.intensity = 1.9;
      lights.hemiLight.color.setHex(0xffcba4);
      lights.hemiLight.groundColor.setHex(0x1e2438);
      lights.hemiLight.intensity = 0.85;
    } else {
      // night
      scene.background = new THREE.Color(0x080a14);
      lights.fog.color.setHex(0x080a14);
      lights.dirLight.color.setHex(0x5577bb);
      lights.dirLight.intensity = 0.9;
      lights.hemiLight.color.setHex(0x223355);
      lights.hemiLight.groundColor.setHex(0x06080e);
      lights.hemiLight.intensity = 0.5;
    }
  }, []);

  // Viewpoint Presets
  const setCameraView = (view: 'overview' | 'chapel' | 'pillar-1' | 'pillar-2' | 'pillar-3' | 'pillar-4') => {
    if (view === 'overview') {
      cameraTargetRef.current = {
        position: new THREE.Vector3(0, 22, 34),
        lookAt: new THREE.Vector3(0, 3, 0),
        active: true
      };
    } else if (view === 'chapel') {
      cameraTargetRef.current = {
        position: new THREE.Vector3(0, 6.5, 17),
        lookAt: new THREE.Vector3(0, 5, 0),
        active: true
      };
    } else {
      onSelectPillar(view);
    }
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Badge (Minimal top-left) */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-1.5">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg backdrop-blur-none pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-xs font-semibold text-slate-200">
            東海精神地標・路思義教堂與四大構面 3D 戰略樞紐
          </span>
          {isSoftwareGl && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
              節能渲染模式
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-400 max-w-sm pl-1">
          旋轉、縮放探索校園中心。點擊四周四大構面石碑，即可切換構面與深入工作項目。
        </p>
      </div>

      {/* Hover Info Card (Floating Near Top Right) */}
      {hoveredPillar && (
        <div className="absolute top-4 right-4 z-10 p-3.5 rounded-xl bg-slate-900/95 border border-slate-700/90 shadow-2xl max-w-xs transition-all animate-fadeIn">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: hoveredPillar.themeColor.hex }}
            />
            <h4 className="text-sm font-bold text-white">{hoveredPillar.fullName}</h4>
          </div>
          <p className="text-xs text-slate-300 line-clamp-2 mb-2">{hoveredPillar.subtitle}</p>
          <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[11px] text-slate-400">
            <span>點擊選取石碑</span>
            <button
              onClick={() => onExplorePlan(hoveredPillar.id)}
              className="text-emerald-400 hover:text-emerald-300 font-medium underline"
            >
              檢視此構面計畫 →
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Unified Bottom Control Dock (Directly adhering to Three.js Guidelines) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-4xl transition-all duration-300">
        {/* Toggle Collapse/Expand Button */}
        <div className="flex justify-center mb-1.5">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-300 bg-slate-900/90 hover:bg-slate-850 border border-slate-700 rounded-full shadow-md transition-colors"
          >
            {isDockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            {isDockCollapsed ? '展開 3D 視角控制列' : '收合控制列 (全螢幕探索)'}
          </button>
        </div>

        {/* The Dock Surfaces */}
        {!isDockCollapsed && (
          <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3">
            {/* Viewpoint Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap mr-1 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                視角切換:
              </span>
              <button
                onClick={() => setCameraView('overview')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                全景鳥瞰
              </button>
              <button
                onClick={() => setCameraView('chapel')}
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition font-medium"
              >
                路思義教堂
              </button>
              {PILLARS_DATA.map(p => (
                <button
                  key={p.id}
                  onClick={() => setCameraView(p.id as any)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition whitespace-nowrap ${
                    selectedPillarId === p.id
                      ? 'bg-slate-100 text-slate-950 font-bold border-white'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Atmosphere & Utilities */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Lighting Presets */}
              <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={() => applyTimeOfDay('day')}
                  title="晴朗日光"
                  className={`p-1.5 rounded-md text-xs transition ${
                    timeOfDay === 'day' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyTimeOfDay('dusk')}
                  title="黃金夕霞"
                  className={`p-1.5 rounded-md text-xs transition ${
                    timeOfDay === 'dusk' ? 'bg-orange-500 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sunset className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => applyTimeOfDay('night')}
                  title="智慧星夜"
                  className={`p-1.5 rounded-md text-xs transition ${
                    timeOfDay === 'night' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Auto rotate toggle */}
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                title="自動自轉鏡頭"
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs transition ${
                  isAutoRotating
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                <span>{isAutoRotating ? '自轉中' : '自轉暫停'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
