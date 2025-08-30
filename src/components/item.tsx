'use client'

import React from "react";

type UserAddress = {
  city: string
  country: string
  line: string
  neighborhood: string
  number: string
  state: string
  street: string
  zipCode: string
}

type User = {
  name: string
  address: UserAddress
  rating: number
  ratingCount: number
}

type ItemProps = {
  title: string
  image: string
  images?: string[]
  description: string
  category: string
  user: User
  interests: string[]
  opportunities: string[]
  price: number
}

const Item: React.FC<ItemProps> = ({ title, image, images, description, category, user, interests, opportunities, price }) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const allImages = images && images.length > 0 ? images : [image]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-3 w-full md:max-w-sm mx-auto flex flex-col gap-3">
      {/* Imagem */}
      <div className="rounded-xl overflow-hidden relative">
        <img
          src={allImages[currentImageIndex]}
          alt={title}
          className="w-full h-48 object-cover"
        />
        
        {/* Navegação de imagens */}
        {allImages.length > 1 && (
          <>
            {/* Botão anterior */}
            <button
              onClick={() => setCurrentImageIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ‹
            </button>
            
            {/* Botão próximo */}
            <button
              onClick={() => setCurrentImageIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ›
            </button>
            
            {/* Indicadores */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {allImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      {/* Título e categoria */}
      <div className="flex items-center justify-between mt-2">
        <h2 className="text-2xl font-bold leading-tight text-black dark:text-white">{title}</h2>
        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm px-3 py-1 rounded-full">{category}</span>
      </div>
      {/* Descrição */}
      <p className="text-gray-600 dark:text-gray-300 text-base mt-1">{description}</p>
      {/* Usuário, avaliação e localização */}
      <div className="flex items-center gap-3 mt-2">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold">{ user.name.charAt(0) }</div>
        <div className="flex flex-col">
          <span className="font-bold text-lg text-black dark:text-white">{ user.name }</span>
          <div className="flex items-center gap-1 text-yellow-500 text-base">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" className="w-4 h-4"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.388-2.46a1 1 0 00-1.175 0l-3.388 2.46c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.045 9.394c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            <span className="font-semibold text-gray-800 dark:text-gray-200 ml-1">{ user.rating }</span>
            <span className="text-gray-400 dark:text-gray-500 text-sm">({ user.ratingCount })</span>
          </div>
        </div>
      </div>
      {/* Localização */}
      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4.5 8-10A8 8 0 104 12c0 5.5 8 10 8 10z"/></svg>
        <span>{ user.address.city }</span>
      </div>
      {/* Interesses */}
      <div className="mt-2">
        <span className="font-semibold text-black dark:text-white">Interesse em:</span>
        <div className="flex gap-2 mt-2">
          {interests.map((interest) => (
            <span key={interest} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-base">{interest}</span>
          ))}
        </div>
      </div>
      {/* Oportunidades restantes */}
      <div className="text-center text-gray-400 dark:text-gray-500 text-base mt-2">{ opportunities } oportunidades restantes</div>
      {/* Botão */}
      <button className="w-full bg-green-400 hover:bg-green-500 text-white font-semibold text-lg py-3 rounded-xl mt-2 transition-colors">
        Desbloquear Contato (R$ { price })
      </button>
    </div>
  );
}

export default Item;