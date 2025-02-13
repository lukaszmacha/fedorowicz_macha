from channels.generic.websocket import AsyncJsonWebsocketConsumer

class AuctionConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.auction_id = self.scope['url_route']['kwargs']['auction_id']
        self.auction_group_name = f'auction_{self.auction_id}'

        # Dołącz do grupy aukcji
        await self.channel_layer.group_add(
            self.auction_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Opuść grupę aukcji
        await self.channel_layer.group_discard(
            self.auction_group_name,
            self.channel_name
        )

    async def auction_update(self, event):
        # Prześlij wiadomość do klienta WebSocket
        await self.send_json(event['data'])
