export interface Data {
  id: number
  title: string
  description: string
  price: number
  image?: JSX.Element
  actions: JSX.Element
}

export interface SortableData {
  id: number
  title: string
  description: string
  price: string
}

export type Order = "asc" | "desc"
