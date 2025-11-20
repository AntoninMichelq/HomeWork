import { createClient } from '@/utils/supabase/server'

export const DAILY_CREDITS = 10

export async function checkUsageAndLimit() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { allowed: false, reason: 'unauthenticated' }
    }

    // Admin Override
    if (user.email === 'starl0rd1211100@gmail.com' || user.email === 'starl0rd1211100') {
        return { allowed: true, user }
    }

    // Fetch profile
    let { data: profile, error } = await supabase
        .from('profiles')
        .select('credits_used, last_reset_date, tier')
        .eq('id', user.id)
        .single()

    // Handle case where profile might not exist yet (create it)
    if (error || !profile) {
        console.log('Profile missing or error, attempting to create...', error)
        const today = new Date().toISOString().split('T')[0]

        const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert([
                {
                    id: user.id,
                    tier: 'free',
                    credits_used: 0,
                    last_reset_date: today
                }
            ])
            .select()
            .single()

        if (createError || !newProfile) {
            console.error('Profile creation failed:', createError)
            return { allowed: false, reason: 'profile_error' }
        }
        profile = newProfile
    }

    if (!profile) {
        return { allowed: false, reason: 'profile_error' }
    }

    const today = new Date().toISOString().split('T')[0]

    // Lazy Reset
    if (profile.last_reset_date !== today) {
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ credits_used: 0, last_reset_date: today })
            .eq('id', user.id)

        if (updateError) {
            console.error('Reset error:', updateError)
            // If update fails, we might still want to allow if local check passes, 
            // but better to fail safe or retry. For now, fail safe.
            return { allowed: false, reason: 'database_error' }
        }
        // Reset local values for check
        profile.credits_used = 0
    }

    // Check Limit
    // Free tier: limit to DAILY_CREDITS
    // Premium tier: unlimited (or high limit)
    if (profile.tier === 'free' && profile.credits_used >= DAILY_CREDITS) {
        return { allowed: false, reason: 'limit_reached' }
    }

    return { allowed: true, user }
}

export async function incrementUsage(userId: string) {
    const supabase = await createClient()

    // We use RPC or simple increment. Simple increment:
    // But we need to be careful about race conditions. 
    // For this MVP, simple read-modify-write or SQL increment is fine.
    // Supabase doesn't have a direct 'increment' in JS client without RPC usually, 
    // but we can fetch and update.

    // Better: create a stored procedure 'increment_credits'
    // But to keep it simple without SQL migrations for now:

    const { data: profile } = await supabase
        .from('profiles')
        .select('credits_used')
        .eq('id', userId)
        .single()

    if (profile) {
        await supabase
            .from('profiles')
            .update({ credits_used: profile.credits_used + 1 })
            .eq('id', userId)
    }
}
