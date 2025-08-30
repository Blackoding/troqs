'use client'

import Header from "../components/header";
import { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    // Se o usuário estiver logado, redireciona para o dashboard
    if (!loading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, loading, router])

  // Se estiver carregando, mostra loading
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-16 py-12 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Troque seus itens com
              <span className="text-[#0019FF] block">facilidade</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Encontre pessoas interessadas em trocar itens e faça negócios de forma segura e simples.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="bg-[#0019FF] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0015CC] transition-colors"
              >
                Começar Agora
              </Link>
              <Link
                href="/login"
                className="border-2 border-[#0019FF] text-[#0019FF] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0019FF] hover:text-white transition-colors"
              >
                Criar Conta
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-[#0019FF] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">
                🔄
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Troque Facilmente</h3>
              <p className="text-gray-600 dark:text-gray-300">Cadastre seus itens e encontre pessoas interessadas em trocar.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#0019FF] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">
                🛡️
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Seguro e Confiável</h3>
              <p className="text-gray-600 dark:text-gray-300">Sistema seguro para suas trocas com perfis verificados.</p>
            </div>
            <div className="text-center">
              <div className="bg-[#0019FF] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl mx-auto mb-4">
                💰
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Economize Dinheiro</h3>
              <p className="text-gray-600 dark:text-gray-300">Troque itens que não usa por coisas que realmente precisa.</p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Pronto para começar?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Junte-se a milhares de pessoas que já estão trocando itens na plataforma.
            </p>
            <Link
              href="/login"
              className="bg-[#0019FF] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#0015CC] transition-colors inline-block"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
