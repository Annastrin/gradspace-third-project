export interface Data {
  id: number
  title: string
  description: string
  price: number
  image: string
  actions: JSX.Element
}

export interface SortableData {
  id: number
  title: string
  description: string
  price: string
}

export type Order = "asc" | "desc"

export type Product = {
  id: number
  category_id: number
  title: string
  description: string | null
  price: string
  product_image: string
  is_active: null
  created_at: string
  updated_at: string
  product_categories: null
}

export type GetProductsResponse = Product[]

export type Products = {
  [key: number]: Product
}

export type NewProduct = {
  title: string
  price: string
  description?: string
  image?: File
  id?: string
}

export type EditedProductInitialValues = {
  title: string
  price: string
  description: string | null
  image: string
  id: string
}

export type ProductAction = "edit" | "add"
