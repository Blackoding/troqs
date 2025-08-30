export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          title: string
          description: string
          image: string
          images: string[]
          interests: string[]
          opportunities: string[]
          price: number
          category_id: string
          user_id: string
          status: 'A' | 'I'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image: string
          images?: string[]
          interests: string[]
          opportunities: string[]
          price: number
          category_id: string
          user_id: string
          status?: 'A' | 'I'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image?: string
          images?: string[]
          interests?: string[]
          opportunities?: string[]
          price?: number
          category_id?: string
          user_id?: string
          status?: 'A' | 'I'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          name: string
          email: string
          address: {
            city: string
            country: string
            line: string
            neighborhood: string
            number: string
            state: string
            street: string
            zipCode: string
          }
          rating: number
          rating_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          address: {
            city: string
            country: string
            line: string
            neighborhood: string
            number: string
            state: string
            street: string
            zipCode: string
          }
          rating?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          address?: {
            city: string
            country: string
            line: string
            neighborhood: string
            number: string
            state: string
            street: string
            zipCode: string
          }
          rating?: number
          rating_count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
