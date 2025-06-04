
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    // Verificar webhook signature (em produção, adicione o endpoint secret)
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, Deno.env.get("STRIPE_WEBHOOK_SECRET") || "");
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return new Response("Webhook signature verification failed", { status: 400 });
    }

    logStep("Event type", { type: event.type });

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const planType = session.metadata?.plan_type;

        if (!userId) {
          logStep("No user_id in session metadata");
          break;
        }

        // Atualizar transação como completed
        await supabaseClient
          .from("transactions")
          .update({ 
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('stripe_session_id', session.id);

        // Se for uma assinatura, criar registro na tabela subscriptions
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          await supabaseClient.from("subscriptions").insert({
            user_id: userId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: session.customer as string,
            plan_type: planType || 'monthly',
            status: 'active',
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          });

          // Atualizar perfil do usuário
          await supabaseClient
            .from("profiles")
            .update({
              plano_id: planType || 'monthly',
              status_plano: 'active',
              data_vencimento_plano: new Date(subscription.current_period_end * 1000).toISOString(),
              stripe_customer_id: session.customer as string
            })
            .eq('id', userId);
        }

        logStep("Checkout completed", { userId, planType, sessionId: session.id });
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Buscar usuário pelo customer_id
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("id")
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const status = subscription.status === 'active' ? 'active' : 
                        subscription.status === 'canceled' ? 'cancelled' : 'expired';

          // Atualizar subscription
          await supabaseClient
            .from("subscriptions")
            .update({
              status: status,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancelled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null
            })
            .eq('stripe_subscription_id', subscription.id);

          // Atualizar perfil
          await supabaseClient
            .from("profiles")
            .update({
              status_plano: status,
              data_vencimento_plano: new Date(subscription.current_period_end * 1000).toISOString()
            })
            .eq('id', profile.id);
        }

        logStep("Subscription updated", { subscriptionId: subscription.id, status: subscription.status });
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
