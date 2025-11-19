'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateChatResponse(message: string, imageBase64?: string) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        let prompt = message
        const parts: any[] = [{ text: prompt }]

        if (imageBase64) {
            parts.push({
                inlineData: {
                    data: imageBase64.split(',')[1],
                    mimeType: 'image/jpeg', // Assuming JPEG for simplicity, can be dynamic
                },
            })
        }

        const result = await model.generateContent(parts)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error('Error generating content:', error)
        return 'Sorry, I encountered an error processing your request.'
    }
}
