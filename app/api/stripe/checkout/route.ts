import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-01-27.acacia', // Use latest or match your dashboard
});

export async function POST(req: Request) {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('Stripe Error: STRIPE_SECRET_KEY is missing');
            return NextResponse.json({ error: 'Configuration Error: Missing Stripe Key' }, { status: 500 });
        }

        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        console.log('Stripe Checkout: Creating session for user', user.id, 'URL:', appUrl);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'HomeworkAI Premium',
                            description: 'Accès illimité et fonctionnalités exclusives',
                        },
                        unit_amount: 999, // 9.99 EUR
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${appUrl}/?success=true`,
            cancel_url: `${appUrl}/pricing?canceled=true`,
            metadata: {
                userId: user.id,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: `Internal Error: ${error.message}` }, { status: 500 });
    }
}
