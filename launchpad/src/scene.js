import * as THREE from 'three';

export function createScene(container, params) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 1.1, 6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.append(renderer.domElement);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.3);
  key.position.set(3, 5, 4);
  scene.add(key);

  const rocket = buildProceduralRocket(params.color);
  scene.add(rocket);

  let raf = 0;
  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();
    rocket.rotation.y = t * 0.5;
    rocket.position.y = Math.sin(t * 1.5) * 0.15;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();

  function onResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener('resize', onResize);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

function buildProceduralRocket(color) {
  const group = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(color), metalness: 0.3, roughness: 0.4 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x1f2933, metalness: 0.2, roughness: 0.6 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 2, 24), bodyMat);
  group.add(body);

  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.9, 24), bodyMat);
  nose.position.y = 1.45;
  group.add(nose);

  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.6, 0.5), trimMat);
    const a = (i / 3) * Math.PI * 2;
    fin.position.set(Math.cos(a) * 0.5, -0.9, Math.sin(a) * 0.5);
    fin.lookAt(0, -0.9, 0);
    group.add(fin);
  }
  return group;
}
