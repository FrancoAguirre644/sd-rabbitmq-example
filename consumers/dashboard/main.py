import asyncio
import json

import aio_pika
from fastapi import FastAPI
from fastapi.responses import StreamingResponse


RABBITMQ_URL = "amqp://sensores:sensores@localhost:5672/"
EXCHANGE_NAME = "sensor.exchange"
QUEUE_NAME = "dashboard.queue"


app = FastAPI()

clients: set[asyncio.Queue] = set()


async def consume_messages():
    connection = await aio_pika.connect_robust(RABBITMQ_URL)

    channel = await connection.channel()

    exchange = await channel.declare_exchange(
        EXCHANGE_NAME,
        aio_pika.ExchangeType.FANOUT,
        durable=True,
    )

    queue = await channel.declare_queue(
        QUEUE_NAME,
        durable=True,
    )

    await queue.bind(exchange)

    print("Connected to RabbitMQ")
    print(f"Exchange: {EXCHANGE_NAME}")
    print(f"Queue: {QUEUE_NAME}")

    async with queue.iterator() as queue_iter:
        async for message in queue_iter:
            async with message.process():
                measurement = json.loads(message.body)

                print("Received:", measurement)

                for client_queue in clients:
                    await client_queue.put(measurement)


async def event_stream(client_queue: asyncio.Queue):
    while True:
        measurement = await client_queue.get()

        yield f"data: {json.dumps(measurement)}\n\n"


@app.get("/events")
async def events():
    client_queue = asyncio.Queue()
    clients.add(client_queue)

    async def stream():
        try:
            async for event in event_stream(client_queue):
                yield event
        finally:
            clients.discard(client_queue)

    return StreamingResponse(
        stream(),
        media_type="text/event-stream",
    )


@app.on_event("startup")
async def startup():
    asyncio.create_task(consume_messages())