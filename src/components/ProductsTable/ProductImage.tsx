type ProductImageProps = {
  src: string
}

export const ProductImage = ({ src }: ProductImageProps) => {
  return (
    <img src={`https://app.spiritx.co.nz/storage/${src}`} alt='' width='100' />
  )
}
