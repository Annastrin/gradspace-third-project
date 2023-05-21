type ProductImageProps = {
  src: string
}

export const ProductImage = ({ src }: ProductImageProps) => {
  return <img src={src} alt='' />
}
