import stripe
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta
from api.models import Offer

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET 

    
    # Verify that an event is from Stripe
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'error': 'Invalid signature'}, status=400)

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object'] 
        offer_id = session.get('metadata', {}).get('offer_id')
        if offer_id:
            try:
                offer = Offer.objects.get(id=offer_id)
                offer.active_until = timezone.now() + timedelta(days=30)
                subscription_id = session.get("subscription")
                offer.stripe_subscription_id = subscription_id
                offer.save()
            except Offer.DoesNotExist:
                pass

    return JsonResponse({'status': 'success'}, status=200)
