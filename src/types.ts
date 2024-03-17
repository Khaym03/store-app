export type Order = [string, number, number]

export type PaymentMethod = 'bio' | 'punto' | 'efectivo' | 'pago-movil' | null

export type Sale = {
  name: string
  price: number
  unit: number
  type: string
  date: string
  status: 'debt-free' | 'debt'
  foreign_key: number | null
  payment_method: PaymentMethod
}

export type ProductNames =
  | 'ariel'
  | 'cera'
  | 'desengrasante'
  | 'desinfectante'
  | 'lavaplatos'
  | 'suavizante'
  | 'limpia poceta'
  | 'cloro'
  | 'shampoo'

export type Product = {
  name: string
  price: number
  color: string
}

export type Gaza = {
  name: string
  price: number
}

export type CalcPurchase = [Sale[], Gaza[], number]
