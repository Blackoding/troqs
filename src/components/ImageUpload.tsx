'use client'

import React, { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 5 
}) => {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Verifica se não excedeu o limite
    if (images.length + files.length > maxImages) {
      alert(`Você pode fazer upload de no máximo ${maxImages} imagens`)
      return
    }


    
    // Testar conexão com Supabase
          setUploading(true)

    try {
      const uploadedUrls: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Verifica o tipo do arquivo
        if (!file.type.startsWith('image/')) {
          alert('Por favor, selecione apenas arquivos de imagem')
          continue
        }

        // Verifica o tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Cada imagem deve ter no máximo 5MB')
          continue
        }

        // Gera um nome único para o arquivo
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
        

        
        // Faz upload para o Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('items')
          .upload(fileName, file) // Usa apenas o nome do arquivo, não o caminho completo

        if (uploadError) {
          alert(`Erro ao fazer upload da imagem: ${uploadError.message}`)
          continue
        }
        


        // Obtém a URL assinada da imagem (com token)
        const { data: signedData } = await supabase.storage
          .from('items')
          .createSignedUrl(fileName, 60 * 60 * 24 * 365) // URL válida por 1 ano

        if (signedData?.signedUrl) {
          uploadedUrls.push(signedData.signedUrl)
        }
      }

      console.log('📋 URLs finais:', uploadedUrls)
      // Adiciona as novas URLs à lista de imagens
      onImagesChange([...images, ...uploadedUrls])

    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload das imagens')
    } finally {
      setUploading(false)
      // Limpa o input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    
    const files = Array.from(event.dataTransfer.files)
    if (files.length === 0) return

    // Verifica se não excedeu o limite
    if (images.length + files.length > maxImages) {
      alert(`Você pode fazer upload de no máximo ${maxImages} imagens`)
      return
    }

    setUploading(true)

    try {
      const uploadedUrls: string[] = []

      for (const file of files) {
        // Verifica o tipo do arquivo
        if (!file.type.startsWith('image/')) {
          alert('Por favor, selecione apenas arquivos de imagem')
          continue
        }

        // Verifica o tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Cada imagem deve ter no máximo 5MB')
          continue
        }

        // Gera um nome único para o arquivo
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`

        // Faz upload para o Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('items')
          .upload(fileName, file) // Usa apenas o nome do arquivo

        if (uploadError) {
          alert('Erro ao fazer upload da imagem')
          continue
        }

        // Obtém a URL assinada da imagem (com token)
        const { data: signedData } = await supabase.storage
          .from('items')
          .createSignedUrl(fileName, 60 * 60 * 24 * 365) // URL válida por 1 ano

        if (signedData?.signedUrl) {
          uploadedUrls.push(signedData.signedUrl)
        }
      }

      console.log('📋 URLs finais:', uploadedUrls)
      // Adiciona as novas URLs à lista de imagens
      onImagesChange([...images, ...uploadedUrls])

    } catch (error) {
      console.error('Erro no upload:', error)
      alert('Erro ao fazer upload das imagens')
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Imagens do Item ({images.length}/{maxImages})
      </label>
      
      {/* Área de upload */}
      <div
        className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center hover:border-[#0019FF] transition-colors ${
          uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        {uploading ? (
          <div>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0019FF] mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Fazendo upload...</p>
          </div>
        ) : (
          <div>
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Clique para selecionar ou arraste imagens aqui
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              PNG, JPG, GIF até 5MB cada
            </p>
          </div>
        )}
      </div>

      {/* Preview das imagens */}
      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <img
                  src={imageUrl}
                  alt={`Imagem ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md"
                  onLoad={() => {}}
                  onError={() => {}}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default ImageUpload
