'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Scan, Send, Image as ImageIcon, X, GraduationCap, LogIn, User as UserIcon, LogOut, Sparkles, Moon, Sun, Lock, RefreshCw, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { generateChatResponse, getRemainingCredits, resetUserCredits } from './actions'
import Link from 'next/link'
import { PaywallModal } from '@/components/PaywallModal'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour ! Je peux vous aider à résoudre vos problèmes. Téléchargez une image ou posez une question.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showPaywall, setShowPaywall] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState<{ remaining: number; total: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const creditData = await getRemainingCredits()
        if (creditData && !creditData.error) {
          setCredits({ remaining: creditData.credits, total: creditData.total })
        }
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.reload()
  }

  const handleResetCredits = async () => {
    await resetUserCredits()
    const creditData = await getRemainingCredits()
    if (creditData && !creditData.error) {
      setCredits({ remaining: creditData.credits, total: creditData.total })
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || loading) return

    const userMessage = input
    const userImage = selectedImage

    setMessages(prev => [...prev, { role: 'user', content: userMessage, image: userImage || undefined }])
    setInput('')
    setSelectedImage(null)
    setLoading(true)

    try {
      // Pass history (excluding the current new message which is handled by the function args)
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const response = await generateChatResponse(userMessage, userImage || undefined, history)

      if (response === 'LIMIT_REACHED') {
        setShowPaywall(true)
        setMessages(prev => [...prev, { role: 'assistant', content: 'Limite quotidienne atteinte. Veuillez mettre à niveau pour continuer.' }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response }])
        // Update credits after successful response
        const creditData = await getRemainingCredits()
        if (!creditData.error) {
          setCredits({ remaining: creditData.credits, total: creditData.total })
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Désolé, une erreur est survenue. Veuillez réessayer.' }])
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-100 dark:selection:bg-blue-900 transition-colors duration-300">
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 dark:bg-purple-900/20 blur-[120px]" />
      </div>

      <header className="relative z-10 flex h-16 items-center justify-between border-b border-white/20 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 px-6 backdrop-blur-xl shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-lg shadow-purple-500/20 group cursor-pointer transition-transform hover:scale-105">
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <GraduationCap className="h-6 w-6 text-white relative z-10" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">
              Homework<span className="text-purple-600 dark:text-purple-400">AI</span>
            </h1>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 tracking-wider uppercase">Tuteur Personnel</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link href="/pricing">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex gap-2 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 dark:border-purple-800 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40 transition-all"
            >
              <Sparkles size={16} className="text-purple-600 dark:text-purple-400" />
              Premium
            </Button>
          </Link>
          {user && (
            <div className="flex flex-col items-end mr-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Crédits Restants</span>
              {credits ? (
                <div className="flex items-center gap-1">
                  {credits.remaining === 0 && <Lock size={12} className="text-red-500" />}
                  <span className={`text-sm font-bold ${credits.remaining === 0 ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'}`}>
                    {credits.remaining} / {credits.total}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-bold text-gray-400">...</span>
              )}
            </div>
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                    <UserIcon size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleResetCredits}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset Credits (Debug)
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Se déconnecter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <LogIn size={16} />
                Connexion
              </Button>
            </Link>
          )}
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col gap-6 p-4 md:p-6 lg:flex-row lg:gap-8 overflow-hidden">
        {/* Left Panel: Upload & Features */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 lg:w-1/3 lg:max-w-sm"
        >
          <Card className="border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md hover:bg-white/80 dark:hover:bg-gray-900/80 transition-colors duration-300 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-6 py-12">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm group-hover:scale-105 transition-transform">
                  <Scan className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Scanner une question</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px]">
                  Téléchargez une image ou prenez une photo pour obtenir une aide instantanée
                </p>
              </div>
              <Button
                size="lg"
                className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 font-medium shadow-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Télécharger une image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Panel: Chat Interface */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-1 flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md shadow-xl overflow-hidden"
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {messages.map((msg, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${msg.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700'
                    }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="User upload"
                      className="mb-3 max-w-full rounded-lg border border-white/20"
                      style={{ maxHeight: '200px' }}
                    />
                  )}
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-2 rounded-2xl bg-white dark:bg-gray-800 px-4 py-3 border border-gray-100 dark:border-gray-700 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Réflexion...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="relative border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-4 backdrop-blur-lg">
            {credits?.remaining === 0 && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-2">
                  <Lock className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Limite quotidienne atteinte</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Mettez à niveau pour continuer</p>
                <Button
                  variant="link"
                  className="text-blue-600 dark:text-blue-400 text-xs mt-1"
                  onClick={() => setShowPaywall(true)}
                >
                  Voir les offres
                </Button>
              </div>
            )}
            <div className="relative flex items-center gap-2">
              {selectedImage && (
                <div className="absolute bottom-full left-0 mb-2">
                  <div className="relative">
                    <img src={selectedImage} alt="Selected" className="h-20 w-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700 shadow-md" />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute -right-2 -top-2 rounded-full bg-white dark:bg-gray-800 p-1 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X size={12} className="text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon size={20} />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Posez votre question..."
                className="flex-1 bg-transparent border-none focus-visible:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
              />
              <Button
                size="icon"
                className={`rounded-xl transition-all duration-300 ${input.trim() || selectedImage
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}
                onClick={handleSend}
                disabled={(!input.trim() && !selectedImage) || loading}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
