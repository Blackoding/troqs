import { useState, useCallback } from 'react'

export const usePriceMask = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue)

  // Função para aplicar máscara de preço
  const formatPrice = useCallback((rawValue: string) => {
    // Remove tudo que não é número
    const numbers = rawValue.replace(/\D/g, '')
    
    // Se não há números, retorna vazio
    if (numbers === '') return ''
    
    // Converte para centavos
    const cents = parseInt(numbers, 10)
    
    // Converte centavos para reais
    const reais = Math.floor(cents / 100)
    const centavos = cents % 100
    
    // Formata reais com pontos
    const formattedReais = reais.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    
    // Formata centavos com zero à esquerda se necessário
    const formattedCentavos = centavos.toString().padStart(2, '0')
    
    return `R$ ${formattedReais},${formattedCentavos}`
  }, [])

  // Função para remover máscara e retornar apenas números
  const unformatPrice = useCallback((formattedValue: string) => {
    return formattedValue.replace(/\D/g, '')
  }, [])

  // Função para converter centavos para reais
  const centsToReais = useCallback((cents: string) => {
    return parseFloat(cents) / 100 || 0
  }, [])

  // Função para converter reais para centavos
  const reaisToCents = useCallback((reais: number) => {
    return Math.round(reais * 100).toString()
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = unformatPrice(e.target.value)
    setValue(rawValue)
  }, [unformatPrice])

  const formattedValue = value ? formatPrice(value) : ''

  return {
    value,
    formattedValue,
    setValue,
    handleChange,
    formatPrice,
    unformatPrice,
    centsToReais,
    reaisToCents
  }
}
