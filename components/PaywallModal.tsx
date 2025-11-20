'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaywallModalProps {
    isOpen: boolean
    onClose: () => void
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-[50%] top-[50%] z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
                    >
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl">
                            {/* Decorative Background */}
                            <div className="absolute inset-0 z-0">
                                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-100 blur-3xl" />
                                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-100 blur-3xl" />
                            </div>

                            <div className="relative z-10 p-6 text-center">
                                <button
                                    onClick={onClose}
                                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>

                                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                                    <Lock className="h-8 w-8 text-white" />
                                </div>

                                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                                    Daily Limit Reached
                                </h2>

                                <p className="mb-8 text-gray-600">
                                    You've used your 3 free credits for today. Upgrade to Pro for unlimited access and exclusive features.
                                </p>

                                <div className="space-y-3">
                                    <Button
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                                        size="lg"
                                        onClick={() => window.open('https://buy.stripe.com/test_placeholder', '_blank')}
                                    >
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        Unlock Unlimited Access
                                    </Button>

                                    <p className="text-xs text-gray-400 mt-4">
                                        Resets daily at midnight • Cancel anytime
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
