import { supabase } from '@/lib/supabase'
import type { Tables, InsertDto, UpdateDto } from '@/lib/supabase-utils'

export type Category = Tables<'categories'>
export type CategoryInsert = InsertDto<'categories'>
export type CategoryUpdate = UpdateDto<'categories'>

export class CategoryService {
  // Buscar todas as categorias
  static async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return data
  }

  // Buscar categoria por ID
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  // Buscar categoria por nome
  static async getByName(name: string) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('name', name)
      .single()

    if (error) throw error
    return data
  }

  // Criar nova categoria
  static async create(categoryData: CategoryInsert) {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Atualizar categoria
  static async update(id: string, categoryData: CategoryUpdate) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Deletar categoria
  static async delete(id: string) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}
