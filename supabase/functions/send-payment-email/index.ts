import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userEmail } = await req.json();

    // Enviar correo usando Resend
    const emailData = {
      from: "Dev Resources <onboarding@resend.dev>",
      to: "ziizar2001@gmail.com",
      subject: "Nuevo Pago PRO Confirmado",
      html: `
        <h2>Nuevo Pago PRO Confirmado</h2>
        <p>Un usuario ha confirmado su pago PRO:</p>
        <ul>
          <li><strong>Email del usuario:</strong> ${userEmail}</li>
          <li><strong>Fecha:</strong> ${new Date().toLocaleString()}</li>
          <li><strong>Monto:</strong> $5 USD</li>
        </ul>
        <p>Por favor, actualiza el estado PRO del usuario en el panel de administración.</p>
      `,
    };

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailData),
    });

    const resendResult = await resendResponse.json();

    // Crear cliente de Supabase
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // Obtener el user_id basado en el email
    const { data: userData, error: userError } = await supabaseAdmin
      .from("auth.users")
      .select("id")
      .eq("email", userEmail)
      .single();

    if (userError) throw userError;

    // Registrar el pago
    const { error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        user_id: userData.id,
        amount: 5,
        status: "pending",
      });

    if (paymentError) throw paymentError;

    return new Response(
      JSON.stringify({ success: true, email: resendResult }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
