// ─── DATABASE ROW TYPES ───────────────────────────────────────────────────────

export type UserRole = 'customer' | 'admin'
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed'
export type PaymentMethod = 'cash'

export interface Profile {
  id: string
  name: string
  email: string
  avatar_url: string | null
  role: UserRole
  password_hash: string | null
  bio: string | null
  phone: string | null
  banner_url: string | null
  created_at: string
}

export interface Address {
  id: string
  user_id: string
  label: string
  full_address: string
  is_default: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
  created_at: string
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string | null
  is_available: boolean
  is_sold_out: boolean
  created_at: string
  category?: Category
  item_customizations?: ItemCustomization
}

export interface ItemCustomization {
  id: string
  menu_item_id: string
  sizes: string[]
  sugar_levels: string[]
  temperatures: string[]
}

export interface Order {
  id: string
  customer_id: string
  status: OrderStatus
  payment_method: PaymentMethod
  total_amount: number
  delivery_address: string | null
  order_notes: string | null
  created_at: string
  customer?: Profile
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  size: string | null
  sugar_level: string | null
  temperature: string | null
  menu_item?: MenuItem
}

export interface PromoBanner {
  id: string
  message: string
  is_active: boolean
  updated_at: string
}

// ─── CART TYPES (CLIENT SIDE) ─────────────────────────────────────────────────

export interface CartItemCustomization {
  size: string | null
  sugar_level: string | null
  temperature: string | null
}

export interface CartItem {
  cartItemId: string
  menuItemId: string
  name: string
  price: number
  image_url: string | null
  quantity: number
  customization: CartItemCustomization
}

// ─── SUPABASE DATABASE TYPE MAP ───────────────────────────────────────────────
// Each table requires a Relationships field to satisfy GenericTable from @supabase/postgrest-js.

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at'> & { created_at?: string }
        Update: Partial<Omit<Profile, 'id'>>
        Relationships: []
      }
      addresses: {
        Row: Address
        Insert: Omit<Address, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Address, 'id' | 'user_id'>>
        Relationships: []
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Category, 'id'>>
        Relationships: []
      }
      menu_items: {
        Row: MenuItem
        Insert: Omit<MenuItem, 'id' | 'created_at' | 'category' | 'item_customizations'> & { id?: string; created_at?: string }
        Update: Partial<Omit<MenuItem, 'id' | 'category' | 'item_customizations'>>
        Relationships: []
      }
      item_customizations: {
        Row: ItemCustomization
        Insert: Omit<ItemCustomization, 'id'> & { id?: string }
        Update: Partial<Omit<ItemCustomization, 'id' | 'menu_item_id'>>
        Relationships: []
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'created_at' | 'customer' | 'order_items'> & { id?: string; created_at?: string }
        Update: Partial<Omit<Order, 'id' | 'customer' | 'order_items'>>
        Relationships: []
      }
      order_items: {
        Row: OrderItem
        Insert: Omit<OrderItem, 'id' | 'menu_item'> & { id?: string }
        Update: Partial<Omit<OrderItem, 'id' | 'order_id' | 'menu_item'>>
        Relationships: []
      }
      promo_banner: {
        Row: PromoBanner
        Insert: Omit<PromoBanner, 'id' | 'updated_at'> & { id?: string; updated_at?: string }
        Update: Partial<Omit<PromoBanner, 'id'>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      order_status: OrderStatus
      payment_method: PaymentMethod
    }
  }
}
