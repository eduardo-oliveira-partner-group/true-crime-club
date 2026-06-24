export type ProductType = "product" | "box"

export type AvailabilityStatus =
  | "available"
  | "limited"
  | "out_of_stock"
  | "coming_soon"

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  shortDescription: string
  type: ProductType
  price: number
  subscriberPrice?: number
  images: string[]
  categories: string[]
  inStock: boolean
  availability: AvailabilityStatus
  featured?: boolean
  includedItems?: string[]
  relatedProductIds?: string[]
  editionMonth?: string
  cycleNumber?: number
}

export interface Box extends Product {
  type: "box"
  editionMonth: string
  cycleNumber: number
  categoriesIncluded: string[]
}

export type BillingInterval = "monthly" | "annual" | "one_time"

export interface SubscriptionPlan {
  id: string
  slug: string
  name: string
  description: string
  billingInterval: BillingInterval
  price: number
  pricePerMonth?: number
  isRecommended?: boolean
  features: string[]
  commitmentMonths?: number
}

export interface SubscriberPreferences {
  shirtSize?: string
  shoeSize?: string
  notes?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  preferences?: SubscriberPreferences
}

export interface Address {
  id: string
  label: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  isDefault: boolean
}

export type PaymentMethodType = "credit_card" | "pix"

export interface PaymentMethod {
  id: string
  type: PaymentMethodType
  label: string
  lastFour?: string
  brand?: string
  isDefault: boolean
}

export interface CartItem {
  id: string
  productId: string
  productSlug: string
  productName: string
  productType: ProductType
  quantity: number
  unitPrice: number
  image?: string
}

export interface Cart {
  id: string
  items: CartItem[]
  couponCode?: string
  couponDiscount?: number
  shippingEstimate?: number
  shippingRegion?: string
}

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "awaiting_shipment"
  | "shipped"
  | "delivered"
  | "cancelled"

export type PaymentStatus =
  | "pending"
  | "paid"
  | "refused"
  | "expired"
  | "refunded"

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  items: CartItem[]
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: number
  shipping: number
  discount: number
  total: number
  createdAt: string
  billingCycleNote?: string
  shippingCycleNote?: string
  trackingCode?: string
  trackingUrl?: string
  invoicePlaceholder?: string
}

export interface Payment {
  id: string
  orderId?: string
  subscriptionId?: string
  amount: number
  status: PaymentStatus
  method: PaymentMethodType
  dueDate: string
  paidAt?: string
  pixQrCode?: string
  pixExpiresAt?: string
  refusalReason?: string
}

export interface Invoice {
  id: string
  number: string
  paymentId: string
  amount: number
  issuedAt: string
  receiptUrl?: string
  downloadUrl?: string
}

export type SubscriptionStatus =
  | "active"
  | "pending_payment"
  | "cancelled"
  | "paused"
  | "past_due"

export interface Subscription {
  id: string
  customerId: string
  planId: string
  planName: string
  status: SubscriptionStatus
  startedAt: string
  nextBillingDate: string
  nextBillingAmount: number
  currentCycleBoxId?: string
  currentCycleBoxName?: string
  canCancel: boolean
  canReactivate: boolean
  cancelledAt?: string
}

export type ContentStatus = "liberado" | "bloqueado"

export interface CaseFile {
  id: string
  name: string
  type: "pdf" | "image" | "audio" | "video"
  downloadUrl: string
  sizeLabel?: string
}

export interface ExclusiveContent {
  id: string
  slug: string
  title: string
  description: string
  status: ContentStatus
  cycleNumber: number
  releaseCycle?: number
  blockedReason?: string
  type: "clue" | "video" | "document" | "article"
  files?: CaseFile[]
}

export interface DynamicContentBlock {
  key: string
  type: "text" | "banner" | "image" | "html"
  value: string
  route?: string
}

export interface SeoEntry {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  noindex?: boolean
}

export interface Case {
  id: string
  slug: string
  title: string
  description: string
  year: number
  totalClues: number
  liveEventDate: string
  liveEventTitle: string
}

export interface Clue {
  id: string
  slug: string
  caseId: string
  title: string
  description: string
  cycleNumber: number
  status: ContentStatus
  blockedReason?: string
  files: CaseFile[]
  releasedAt?: string
}

export interface SubscriberProgress {
  caseId: string
  collectedClues: number
  totalClues: number
  currentCycle: number
  liveEventDate: string
  liveEventTitle: string
  percentComplete: number
}

export interface ShippingEstimate {
  region: string
  price: number
  estimatedDays: string
}

export interface CouponResult {
  valid: boolean
  code: string
  discount: number
  message: string
}

export interface RepositoryResult<T> {
  data: T | null
  error?: string
  loading?: boolean
}
