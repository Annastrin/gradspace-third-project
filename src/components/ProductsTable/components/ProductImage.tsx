import { BaseStorageUrl } from "../../../environment"

interface ProductImageProps {
  src: string
}

const ProductImage = ({ src }: ProductImageProps) => {
  return src ? <img src={`${BaseStorageUrl}${src}`} alt='' width='100' /> : null
}

export default ProductImage
