import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function PrivatePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Private Page</h1>
            <p>Hello {user.email}</p>
        </div>
    )
}
