interface ProductImageProps {
  src: string
}

const ProductImage = ({ src }: ProductImageProps) => {
  return src ? (
    <img src={`https://app.spiritx.co.nz/storage/${src}`} alt='' width='100' />
  ) : null
}

export default ProductImage
