'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import Header from '@/components/header'
import Select from '@/components/select'
import { OrderService, CategoryService } from '@/services/supabase'
import type { Order, Category } from '@/services/supabase'
import Item from '@/components/item'

export default function FeedPage() {
  const { loading } = useAuthContext()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'A' | 'I'>('all')

  const filterOrders = useCallback(() => {
    let filtered = orders

    // Filtrar por status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus)
    }

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(order => order.category_id === selectedCategory)
    }

    // Filtrar por termo de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(order => 
        order.title.toLowerCase().includes(term) ||
        order.description.toLowerCase().includes(term) ||
        order.interests.some(interest => interest.toLowerCase().includes(term))
      )
    }

    setFilteredOrders(filtered)
  }, [orders, selectedStatus, selectedCategory, searchTerm])

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [filterOrders])

  const loadData = async () => {
    try {
      setLoadingOrders(true)
      
      // Carregar todos os pedidos
      const ordersData = await OrderService.getAll()
      setOrders(ordersData)
      
      // Carregar categorias
      const categoriesData = await CategoryService.getAll()
      setCategories(categoriesData)
    } catch {
      // Erro ao carregar dados
    } finally {
      setLoadingOrders(false)
    }
  }

  const hasActiveFilters = () => {
    return searchTerm !== '' || selectedCategory !== '' || selectedStatus !== 'all'
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedStatus('all')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0019FF] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-16 py-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Feed de Itens</h1>
          <p className="text-gray-600 dark:text-gray-300">Encontre itens interessantes para trocar</p>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Buscar
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título, descrição..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-[#0019FF] focus:border-[#0019FF] text-black dark:text-white bg-white dark:bg-gray-700"
              />
            </div>

            {/* Categoria */}
            <div>
              <Select
                label="Categoria"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: '', label: 'Todas as categorias' },
                  ...categories.map((category) => ({
                    value: category.id,
                    label: category.name
                  }))
                ]}
                placeholder="Todas as categorias"
              />
            </div>

            {/* Status */}
            <div>
              <Select
                label="Status"
                value={selectedStatus}
                onChange={(value) => setSelectedStatus(value as 'all' | 'A' | 'I')}
                options={[
                  { value: 'all', label: 'Todos os status' },
                  { value: 'A', label: 'Ativos' },
                  { value: 'I', label: 'Inativos' }
                ]}
                placeholder="Todos os status"
              />
            </div>

            {/* Botão Limpar */}
            {hasActiveFilters() && (
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Itens */}
        {loadingOrders ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0019FF] mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Carregando itens...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
              {hasActiveFilters() ? 'Nenhum item encontrado' : 'Nenhum item disponível'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {hasActiveFilters() 
                ? 'Tente ajustar os filtros ou buscar por outros termos'
                : 'Aguarde novos itens serem cadastrados'
              }
            </p>
            {hasActiveFilters() && (
              <button
                onClick={clearFilters}
                className="bg-[#0019FF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0015CC] transition-colors"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <Item
                key={order.id}
                title={order.title}
                image={order.image}
                images={order.images}
                description={order.description}
                category={categories.find(c => c.id === order.category_id)?.name || 'Sem categoria'}
                user={{
                  name: 'Usuário', // TODO: Buscar dados do usuário
                  address: {
                    city: 'Cidade',
                    country: '',
                    line: '',
                    neighborhood: '',
                    number: '',
                    state: '',
                    street: '',
                    zipCode: ''
                  },
                  rating: 0,
                  ratingCount: 0
                }}
                interests={order.interests}
                opportunities={order.opportunities}
                price={order.price}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
