import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private connection!: amqp.ChannelModel;
  private channel!: amqp.Channel;

  async onModuleInit() {
    await this.connectRabbitMQ();
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }

  private async connectRabbitMQ() {
    this.connection = await amqp.connect(
      'amqp://sensores:sensores@localhost:5672',
    );

    this.channel = await this.connection.createChannel();

    await this.channel.assertExchange(
      'sensor.exchange',
      'fanout',
      {
        durable: true,
      },
    );

    console.log('Connected to RabbitMQ');
    console.log('Exchange: sensor.exchange');
  }
}