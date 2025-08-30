'use client'

import { useEffect, useState } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Header from '@/components/header'
import Select from '@/components/select'
import ImageUpload from '@/components/ImageUpload'
import { OrderService, CategoryService } from '@/services/supabase'
import type { Order, Category } from '@/services/supabase'

import { usePriceMask } from '@/hooks/usePriceMask'

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuthContext()
  const router = useRouter()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeTab, setActiveTab] = useState<'my-items' | 'create'>('my-items')
  
  // Estados do formulário
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [interests, setInterests] = useState('')
  const [opportunities, setOpportunities] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [formLoading, setFormLoading] = useState(false)
  
  // Hook para máscara de preço
  const priceMask = usePriceMask('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
      return
    }
    
    if (isAuthenticated && user) {
      loadUserData()
    }
  }, [isAuthenticated, loading, router, user])

  const loadUserData = async () => {
    try {
      // Carregar pedidos do usuário
      const userOrders = await OrderService.getByUser(user!.id)
      setOrders(userOrders)
      
      // Carregar categorias do banco
      const allCategories = await CategoryService.getAll()
      setCategories(allCategories)
    } catch {
      // Erro ao carregar dados
    }
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      await OrderService.create({
        title,
        description,
        image: images.length > 0 ? images[0] : 'https://via.placeholder.com/300x200',
        images: images,
        interests: interests.split(',').map(item => item.trim()),
        opportunities: opportunities.split(',').map(item => item.trim()),
        price: priceMask.centsToReais(priceMask.value), // Converte centavos para reais
        user_id: user!.id,
        status: 'A',
        category_id: categoryId || ''
      })

      alert('Item cadastrado com sucesso!')
      
      // Limpar formulário
      setTitle('')
      setDescription('')
      setImages([])
      setInterests('')
      setOpportunities('')
      priceMask.setValue('')
      setCategoryId('')
      
      // Recarregar dados
      loadUserData()
      setActiveTab('my-items')
    } catch {
      alert('Erro ao cadastrar item. Tente novamente.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await OrderService.delete(orderId)
        alert('Item excluído com sucesso!')
        loadUserData()
      } catch {
        alert('Erro ao excluir item.')
      }
    }
  }

  const handleToggleStatus = async (orderId: string, currentStatus: 'A' | 'I') => {
    try {
      const newStatus = currentStatus === 'A' ? 'I' : 'A'
      await OrderService.updateStatus(orderId, newStatus)
      loadUserData()
    } catch {
      alert('Erro ao alterar status do item.')
    }
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 md:px-16 py-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meu Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Gerencie seus itens para troca</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
          <button
            onClick={() => setActiveTab('my-items')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'my-items'
                ? 'bg-white dark:bg-gray-700 text-[#0019FF] shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Meus Itens ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'create'
                ? 'bg-white dark:bg-gray-700 text-[#0019FF] shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Cadastrar Novo Item
          </button>
        </div>

        {activeTab === 'my-items' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📦</div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Nenhum item cadastrado</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Comece cadastrando seu primeiro item para troca</p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="bg-[#0019FF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0015CC] transition-colors"
                >
                  Cadastrar Primeiro Item
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <img
                      src={order.image}
                      alt={order.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{order.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'A' 
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                        }`}>
                          {order.status === 'A' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{order.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span>R$ {order.price}</span>
                        <span>{order.interests.length} interesses</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleStatus(order.id, order.status)}
                          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                            order.status === 'A'
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/30'
                              : 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/30'
                          }`}
                        >
                          {order.status === 'A' ? 'Desativar' : 'Ativar'}
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/30 py-2 px-3 rounded-md text-sm font-medium transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cadastrar Novo Item</h2>
              
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <Select
                    label="Categoria"
                    isRequired
                    value={categoryId}
                    onChange={setCategoryId}
                    options={categories.map((category) => ({
                      value: category.id,
                      label: category.name
                    }))}
                    placeholder="Selecione uma categoria"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Ex: Notebook Gamer"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-[#0019FF] focus:border-[#0019FF] text-black dark:text-white bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Descrição *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={3}
                    placeholder="Descreva seu produto e o que busca em troca..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-[#0019FF] focus:border-[#0019FF] text-black dark:text-white bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <ImageUpload
                    images={images}
                    onImagesChange={setImages}
                    maxImages={5}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Interesses para Troca *
                  </label>
                  <input
                    type="text"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    required
                    placeholder="Ex: Notebook Gamer, Processador i7, 16GB de RAM"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-[#0019FF] focus:border-[#0019FF] text-black dark:text-white bg-white dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separe os interesses por vírgula</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Oportunidades *
                  </label>
                  <input
                    type="text"
                    value={opportunities}
                    onChange={(e) => setOpportunities(e.target.value)}
                    required
                    placeholder="Ex: Notebook Gamer, Processador i7, 16GB de RAM"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-[#0019FF] focus:border-[#0019FF] text-black dark:text-white bg-white dark:bg-gray-700"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Separe as oportunidades por vírgula</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="text"
                    value={priceMask.formattedValue}
                    onChange={priceMask.handleChange}
                    required
                    placeholder="R$ 0,00"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-[#0019FF] focus:border-[#0019FF] text-black dark:text-white bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-[#0019FF] text-white py-3 px-4 rounded-md font-medium hover:bg-[#0015CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {formLoading ? 'Cadastrando...' : 'Cadastrar Item'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('my-items')}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
