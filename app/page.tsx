'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Scan, Send, Image as ImageIcon, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { generateChatResponse } from './actions'

export default function Home() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; image?: string }[]>([
    { role: 'assistant', content: 'Hello! I can help you solve problems. Upload an image or ask a question.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

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
      const response = await generateChatResponse(userMessage, userImage || undefined)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex h-screen flex-col bg-gray-50 text-gray-900 font-sans selection:bg-blue-100">
      {/* Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 blur-[120px]" />
      </div>

      <header className="relative z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white/50 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Homework
          </h1>
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
          <Card className="border-gray-200 bg-white/50 backdrop-blur-md hover:bg-white/80 transition-colors duration-300 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-6 py-12">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                  <Scan className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-xl font-semibold text-gray-900">Scan Question</h2>
                <p className="text-sm text-gray-500 max-w-[200px]">
                  Upload an image or take a photo to get instant help
                </p>
              </div>
              <Button
                size="lg"
                className="w-full bg-gray-900 text-white hover:bg-gray-800 font-medium shadow-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
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
          className="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-md shadow-xl overflow-hidden"
        >
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
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
                      : 'bg-white text-gray-800 border border-gray-100'
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
                <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 border border-gray-100 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white/80 p-4 backdrop-blur-lg">
            {selectedImage && (
              <div className="mb-4 flex items-center gap-2 rounded-lg bg-white p-2 w-fit border border-gray-200 shadow-sm">
                <img src={selectedImage} alt="Preview" className="h-12 w-12 rounded object-cover" />
                <span className="text-xs text-gray-500">Image selected</span>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="ml-2 rounded-full p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex gap-3"
            >
              <div className="relative flex-1">
                <Input
                  placeholder="Ask a question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                  className="h-12 rounded-xl border-gray-200 bg-white pl-4 pr-12 text-gray-900 placeholder:text-gray-400 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <ImageIcon size={20} />
                </button>
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={loading || (!input.trim() && !selectedImage)}
                className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-500/20"
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
