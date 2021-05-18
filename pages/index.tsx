import {Canvas} from '@react-three/fiber'
import {OrbitControls, Stars} from '@react-three/drei'
import * as THREE from 'three'

function Box(){
  return (
    <mesh>
      <boxBufferGeometry attach="geometry"/>
      <meshLambertMaterial attach = "material" color="hotpink"/>

    </mesh>
  )
}

export default function Home() {
  return (
    <div style={{width:"100%", height:"100%"}}>
     <Canvas>
      {/* <OrbitControls/> */}
      <Stars/>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.5} />

    </Canvas>
    </div>
  )
}
