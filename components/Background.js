import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import style from "@styles/Background.module.css";
import * as THREE from "three";
import Perlin from "lib/perlin";
import { useRef } from "react";
function Background() {
  return (
    <Canvas
      camera={{
        position: [(-15 * Math.PI) / 180, -1000, 100],
        far: 1000,
      }}
      className={style.background}
      al
    >
      <ambientLight position={[]} color={0xffffff} intensity={1.3} />
      <primitive object={new THREE.AxesHelper(10)} />
      <Mesh />
    </Canvas>
  );
}
const Mesh = () => {
  useFrame((state, delta) => {
    plain.current.rotation.z += 0.001;
  }, []);
  useEffect(() => {
    refreshVertices();
  }, []);

  function refreshVertices() {
    const perlin = new Perlin();
    plain.smooth = 500;
    plain.peak = 60;
    const vertices = plain.current.geometry.attributes.position.array;
    for (const i = 0; i <= vertices.length; i += 3) {
      vertices[i + 2] =
        plain.peak *
        perlin.noise(
          (plain.current.position.x + vertices[i]) / plain.smooth,
          (plain.current.position.z + vertices[i + 1]) / plain.smooth
        );
    }
    plain.current.geometry.attributes.position.needsUpdate = true;
    plain.current.geometry.computeVertexNormals();
  }
  const plain = useRef();

  return (
    <mesh ref={plain} position={[0, 0, -100]}>
      <planeBufferGeometry attach="geometry" args={[3000, 3000, 256, 256]} />
      <meshLambertMaterial
        transparent
        opacity={0.1}
        color={0xe9ebf0}
        wireframe={true}
      />
    </mesh>
  );
};

export default Background;
