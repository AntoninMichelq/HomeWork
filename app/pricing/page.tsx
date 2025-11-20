'use client'

'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, X, ArrowLeft, Sparkles, Zap, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans selection:bg-purple-100 dark:selection:bg-purple-900 transition-colors duration-300">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 dark:bg-blue-900/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-100/50 dark:bg-purple-900/20 blur-[120px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12 max-w-5xl">
                <div className="mb-12 text-center">
                    <Link href="/">
                        <Button variant="ghost" className="absolute left-4 top-4 md:left-8 md:top-8 gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                            <ArrowLeft size={16} />
                            Retour
                        </Button>
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
                            Passez au niveau <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Supérieur</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Débloquez tout le potentiel de votre tuteur IA personnel et excellez dans vos études.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl p-8 shadow-lg"
                    >
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Gratuit</h3>
                            <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                                <span className="text-5xl font-bold tracking-tight">0€</span>
                                <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">/mois</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Pour découvrir et commencer à apprendre.</p>
                        </div>
                        <ul className="mb-8 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                <span>10 crédits par jour</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                <span>Réponses standard</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                                <span>Support communautaire</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
                                <X className="h-5 w-5 flex-shrink-0" />
                                <span>Mode conversationnel avancé</span>
                            </li>
                        </ul>
                        <Button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700" disabled>
                            Plan Actuel
                        </Button>
                    </motion.div>

                    {/* Premium Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative rounded-3xl border border-purple-200 dark:border-purple-900/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 shadow-xl ring-1 ring-purple-500/10"
                    >
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-medium text-white shadow-lg">
                            Recommandé
                        </div>
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                Premium <Sparkles className="h-5 w-5 text-purple-500" />
                            </h3>
                            <div className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                                <span className="text-5xl font-bold tracking-tight">9.99€</span>
                                <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">/mois</span>
                            </div>
                            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Pour les étudiants sérieux qui veulent réussir.</p>
                        </div>
                        <ul className="mb-8 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                            <li className="flex items-center gap-3">
                                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1">
                                    <Zap className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">Crédits illimités</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1">
                                    <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">Réponses plus rapides</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1">
                                    <Shield className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">Support prioritaire</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-1">
                                    <Sparkles className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="font-medium text-gray-900 dark:text-white">Accès aux nouvelles fonctionnalités</span>
                            </li>
                        </ul>
                        <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                            onClick={async () => {
                                try {
                                    const response = await fetch('/api/stripe/checkout', {
                                        method: 'POST',
                                    });

                                    if (!response.ok) {
                                        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                                        console.error('Payment API Error:', errorData);
                                        alert(`Erreur: ${errorData.error || 'Une erreur est survenue'}`);
                                        return;
                                    }

                                    const data = await response.json();
                                    if (data.url) {
                                        window.location.href = data.url;
                                    } else {
                                        alert('Erreur lors de la redirection vers le paiement.');
                                    }
                                } catch (error) {
                                    console.error('Payment error:', error);
                                    alert('Une erreur est survenue lors de la connexion au serveur.');
                                }
                            }}
                        >
                            Devenir Premium
                        </Button>
                    </motion.div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Paiement sécurisé via Stripe. Annulation possible à tout moment.
                    </p>
                </div>
            </div>
        </div>
    )
}
