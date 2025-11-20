'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { DAILY_CREDITS, checkUsageAndLimit, incrementUsage } from '@/lib/usage'
import { createClient } from '@/utils/supabase/server'

// UTILISE UNE VARIABLE D'ENVIRONNEMENT !
const apiKey = process.env.GEMINI_API_KEY || '';
console.log('DEBUG: API Key present?', !!apiKey); // Debug log

const genAI = new GoogleGenerativeAI(apiKey);

const systemInstruction = `Tu es un professeur pédagogue et patient.
Ton but est d'aider l'élève à comprendre par lui-même, sans donner la réponse directement si possible.
Utilise des exemples, pose des questions pour guider la réflexion, et explique les concepts clairement.
Si l'élève envoie une photo d'exercice, analyse-la et aide-le à résoudre le problème étape par étape.
Sois encourageant et bienveillant.`;

export async function generateChatResponse(message: string, imageBase64?: string, history: { role: string, content: string }[] = []) {
    const msg = message.toLowerCase();

    // 2. Vérification de la clé
    if (!apiKey) {
        console.error("ERREUR: Clé API manquante");
        return "Erreur de configuration serveur (API Key).";
    }

    // 2.5 Vérification du quota (Guard)
    const usageCheck = await checkUsageAndLimit();

    if (!usageCheck.allowed) {
        if (usageCheck.reason === 'limit_reached') {
            return "LIMIT_REACHED";
        }
        if (usageCheck.reason === 'unauthenticated') {
            // Treat unauthenticated as limit reached for now to trigger modal/login
            return "LIMIT_REACHED";
        }
        return "Une erreur est survenue lors de la vérification du quota.";
    }

    try {
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemInstruction
        });

        // Convert history to Gemini format
        const chatHistory = history.map(h => ({
            role: h.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: h.content }]
        }));

        const chat = model.startChat({
            history: chatHistory,
        });

        // 3. Construction propre des "parts"
        const parts: any[] = [{ text: message }];

        if (imageBase64) {
            // Gestion dynamique du MimeType et nettoyage du base64
            const match = imageBase64.match(/^data:(.+);base64,(.+)$/);

            if (match) {
                parts.push({
                    inlineData: {
                        data: match[2], // La partie encodée pure
                        mimeType: match[1], // Le type réel (png, jpeg, webp)
                    },
                });
            } else {
                // Fallback si on reçoit du base64 pur sans header
                parts.push({
                    inlineData: {
                        data: imageBase64,
                        mimeType: 'image/jpeg', // On suppose jpeg par défaut
                    },
                });
            }
        }

        const result = await chat.sendMessage(parts);
        const response = await result.response;

        // Increment usage only on success
        if (usageCheck.user) {
            await incrementUsage(usageCheck.user.id);
        }

        return response.text();

    } catch (error: any) {
        // 4. Log détaillé pour comprendre le problème
        console.error('ERREUR GEMINI DÉTAILLÉE :', error);

        if (error.message?.includes('API key not valid')) {
            return "Erreur: Clé API invalide.";
        }
        if (error.message?.includes('candidate')) {
            return "L'IA a refusé de répondre (contenu bloqué par sécurité).";
        }

        return 'Désolé, je rencontre des difficultés techniques.';
    }
}

export async function getRemainingCredits() {
    const usageCheck = await checkUsageAndLimit()
    if (!usageCheck.user) {
        return { credits: 0, total: DAILY_CREDITS, error: 'unauthenticated' }
    }

    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('credits_used, tier')
        .eq('id', usageCheck.user.id)
        .single()

    if (!profile) {
        return { credits: 0, total: DAILY_CREDITS, error: 'profile_error' }
    }

    const remaining = Math.max(0, DAILY_CREDITS - (profile.credits_used || 0))
    return { credits: remaining, total: DAILY_CREDITS }
}

export async function resetUserCredits() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { success: false }

    await supabase
        .from('profiles')
        .update({ credits_used: 0 })
        .eq('id', user.id)

    return { success: true }
}