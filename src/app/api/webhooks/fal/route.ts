import { NextRequest, NextResponse } from 'next/server';
import { processWebhookEvent } from './services';

/**
 * POST /api/webhooks/fal
 * Webhook endpoint pour recevoir les notifications de fal.ai
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📥 Webhook fal.ai reçu:', JSON.stringify(body, null, 2));

    // Traiter l'événement webhook
    await processWebhookEvent(body);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Erreur lors du traitement du webhook fal.ai:', error);
    
    // Retourner 200 pour éviter que fal.ai continue à réessayer
    // En production, on pourrait logger l'erreur et investiguer manuellement
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook' },
      { status: 200 }
    );
  }
}