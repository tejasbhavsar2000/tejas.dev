import Image from 'next/image'
export default function Background() {   // does not make any sense
  return (
      <Image
        alt="Mountains"
        src="/background.png"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
  )
}