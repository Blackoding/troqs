'use client'

import React, { useState, useRef, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";

export default function Header() {
  const { user, isAuthenticated, signOut, loading } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowDropdown(false);
    } catch {
      // Erro ao fazer logout
    }
  };

  const getUserInitials = (email: string | undefined) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#0019FF] w-full mb-8">
      <div className="flex items-center justify-between px-8 py-4">
        <Link href="/feed" className="text-white font-extrabold text-3xl tracking-tight flex items-center hover:opacity-90 transition-opacity">
          TROQS
          <sup className="ml-1 text-xs font-bold align-super">®</sup>
        </Link>
        
        <div className="flex items-center gap-4">
          {/* Link Feed - sempre visível */}
          <Link
            href="/feed"
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Feed
          </Link>
          
          {loading ? (
            <div className="bg-gray-200 text-gray-800 font-semibold rounded-full w-14 h-14 flex items-center justify-center text-xl animate-pulse">
              ...
            </div>
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {/* Dropdown do usuário */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="bg-white text-[#0019FF] font-semibold rounded-full w-14 h-14 flex items-center justify-center text-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  {getUserInitials(user.email)}
                </button>
                
                {/* Dropdown menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 min-w-48 max-w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{user.email}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Usuário logado</div>
                    </div>
                    
                    <Link
                      href="/dashboard"
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors dark:text-gray-200 dark:hover:bg-gray-700"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                      </svg>
                      Dashboard
                    </Link>
                    
                    {/* Separador */}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    
                    {/* Opções de Tema */}
                    <div className="px-4 py-2">
                      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Tema</div>
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => {
                            setTheme('light');
                            setShowDropdown(false);
                          }}
                          className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                            theme === 'light'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Modo Claro
                        </button>
                        <button
                          onClick={() => {
                            setTheme('dark');
                            setShowDropdown(false);
                          }}
                          className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                            theme === 'dark'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                          </svg>
                          Modo Escuro
                        </button>
                      </div>
                    </div>
                    
                    {/* Separador */}
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    
                    <button
                      onClick={handleSignOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/login"
                className="bg-white text-[#0019FF] hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}