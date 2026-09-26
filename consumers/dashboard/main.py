import asyncio
import json

import aio_pika


RABBITMQ_URL = "amqp://sensores:sensores@localhost:5672/"
EXCHANGE_NAME = "sensor.exchange"
QUEUE_NAME = "dashboard.queue"


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


async def main():
    await consume_messages()


if __name__ == "__main__":
    asyncio.run(main())