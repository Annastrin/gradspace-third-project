type Product = {
  id: number
  category_id: number
  title: string
  description: string
  price: string
  product_image: string
  is_active: null
  created_at: string
  updated_at: string
  product_categories: null
}

export type GetProductsResponse = Product[]

export type NewProduct = {
  title: string
  price: string
  description?: string
  image?: File
}
