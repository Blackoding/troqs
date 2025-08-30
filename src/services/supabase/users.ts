import { supabase } from '@/lib/supabase'
import type { Tables, InsertDto, UpdateDto } from '@/lib/supabase-utils'

export type User = Tables<'users'>
export type UserInsert = InsertDto<'users'>
export type UserUpdate = UpdateDto<'users'>

export class UserService {
  // Buscar todos os usuários
  static async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Buscar usuário por ID
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // Buscar usuário por email
  static async getByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) throw error
    return data
  }

  // Criar novo usuário
  static async create(userData: UserInsert) {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Atualizar usuário
  static async update(id: string, userData: UserUpdate) {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Deletar usuário
  static async delete(id: string) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }

  // Atualizar rating do usuário
  static async updateRating(id: string, rating: number, ratingCount: number) {
    const { data, error } = await supabase
      .from('users')
      .update({ rating, rating_count: ratingCount })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
