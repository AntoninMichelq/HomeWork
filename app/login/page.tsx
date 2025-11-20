'use client'

import { useState } from 'react'
import { login, signup } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { OAuthSignIn } from './oauth-signin'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function LoginPage() {
    const [mode, setMode] = useState<'login' | 'signup'>('login')

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-100/50 blur-[120px]" />
            </div>

            <Card className="w-full max-w-md z-10 bg-white/80 backdrop-blur-xl border-gray-200 shadow-xl">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg mb-4">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Welcome to Homework</CardTitle>
                    <CardDescription>
                        Your personal AI tutor, available 24/7.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Tabs */}
                    <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100/50 rounded-xl">
                        <button
                            onClick={() => setMode('login')}
                            className={`py-2 text-sm font-medium rounded-lg transition-all ${mode === 'login'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setMode('signup')}
                            className={`py-2 text-sm font-medium rounded-lg transition-all ${mode === 'signup'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or continue with</span>
                        </div>
                    </div>

                    <OAuthSignIn />

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-gray-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-2 text-gray-500">Or use email</span>
                        </div>
                    </div>

                    <form className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="student@example.com"
                                className="bg-white/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="bg-white/50"
                            />
                        </div>

                        <Button
                            formAction={mode === 'login' ? login : signup}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg transition-all hover:scale-[1.02]"
                            size="lg"
                        >
                            {mode === 'login' ? 'Log In' : 'Create Account'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-xs text-gray-500">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </CardFooter>
            </Card>
        </div>
    )
}
