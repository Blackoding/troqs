import { supabase } from './supabase'
import type { Database } from '@/types/supabase'

// Tipos para as operações
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateDto<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Função genérica para buscar dados
export async function fetchData<T extends keyof Database['public']['Tables']>(
  table: T,
  query?: {
    select?: string
    filters?: Record<string, unknown>
    orderBy?: { column: string; ascending?: boolean }
    limit?: number
  }
) {
  let queryBuilder = supabase.from(table).select(query?.select || '*')

  if (query?.filters) {
    Object.entries(query.filters).forEach(([key, value]) => {
      queryBuilder = queryBuilder.eq(key, value)
    })
  }

  if (query?.orderBy) {
    queryBuilder = queryBuilder.order(query.orderBy.column, {
      ascending: query.orderBy.ascending ?? true
    })
  }

  if (query?.limit) {
    queryBuilder = queryBuilder.limit(query.limit)
  }

  const { data, error } = await queryBuilder

  if (error) {
    throw new Error(`Erro ao buscar dados da tabela ${String(table)}: ${error.message}`)
  }

  return data
}

// Função genérica para inserir dados
export async function insertData<T extends keyof Database['public']['Tables']>(
  table: T,
  data: InsertDto<T>
) {
  const { data: result, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao inserir dados na tabela ${String(table)}: ${error.message}`)
  }

  return result
}

// Função genérica para atualizar dados
export async function updateData<T extends keyof Database['public']['Tables']>(
  table: T,
  id: string,
  data: UpdateDto<T>
) {
  const { data: result, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar dados na tabela ${String(table)}: ${error.message}`)
  }

  return result
}

// Função genérica para deletar dados
export async function deleteData<T extends keyof Database['public']['Tables']>(
  table: T,
  id: string
) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao deletar dados da tabela ${String(table)}: ${error.message}`)
  }

  return true
}

// Função para upload de arquivos
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file)

  if (error) {
    throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`)
  }

  return data
}

// Função para obter URL pública de arquivo
export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}
