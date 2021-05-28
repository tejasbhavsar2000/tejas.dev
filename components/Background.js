import Image from 'next/image'
export default function Background() {   
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