import { supabase } from '@/lib/supabase'
import type { Tables, InsertDto, UpdateDto } from '@/lib/supabase-utils'

export type Order = Tables<'orders'>
export type OrderInsert = InsertDto<'orders'>
export type OrderUpdate = UpdateDto<'orders'>

export class OrderService {
  // Buscar todos os pedidos
  static async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        categories(name),
        users(name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Buscar pedidos por status
  static async getByStatus(status: 'A' | 'I') {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        categories(name),
        users(name, email)
      `)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Buscar pedidos por categoria
  static async getByCategory(categoryId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        categories(name),
        users(name, email)
      `)
      .eq('category_id', categoryId)
      .eq('status', 'A')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Buscar pedidos por usuário
  static async getByUser(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        categories(name),
        users(name, email)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Buscar pedido por ID
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        categories(name),
        users(name, email)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // Buscar pedidos por preço
  static async getByPriceRange(minPrice: number, maxPrice: number) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        categories(name),
        users(name, email)
      `)
      .gte('price', minPrice)
      .lte('price', maxPrice)
      .eq('status', 'A')
      .order('price', { ascending: true })

    if (error) throw error
    return data
  }

  // Buscar pedidos por interesses
  static async getByInterests(interests: string[]) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        categories(name),
        users(name, email)
      `)
      .overlaps('interests', interests)
      .eq('status', 'A')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Criar novo pedido
  static async create(orderData: OrderInsert) {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select(`
        *,
        categories(name),
        users(name, email)
      `)
      .single()

    if (error) throw error
    return data
  }

  // Atualizar pedido
  static async update(id: string, orderData: OrderUpdate) {
    const { data, error } = await supabase
      .from('orders')
      .update(orderData)
      .eq('id', id)
      .select(`
        *,
        categories(name),
        users(name, email)
      `)
      .single()

    if (error) throw error
    return data
  }

  // Deletar pedido
  static async delete(id: string) {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // Atualizar status do pedido
  static async updateStatus(id: string, status: 'A' | 'I') {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        categories(name),
        users(name, email)
      `)
      .single()

    if (error) throw error
    return data
  }
}
