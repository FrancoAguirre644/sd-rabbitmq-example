import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import * as amqp from 'amqplib';
import { SensorsService } from './sensors/sensors.service';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private connection!: amqp.ChannelModel;
  private channel!: amqp.Channel;
  private interval?: NodeJS.Timeout;

  constructor(
    private readonly sensorsService: SensorsService,
  ) {}

  async onModuleInit() {
    await this.connectRabbitMQ();
    this.startPublishing();
  }

  async onModuleDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }

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

  private startPublishing() {
    this.interval = setInterval(() => {
      this.publishMeasurements();
    }, 2000);
  }

  private publishMeasurements() {
    const sensors = this.sensorsService.getSensors();

    sensors.forEach((sensor) => {
      const measurement =
        this.sensorsService.createMeasurement(sensor);

      this.channel.publish(
        'sensor.exchange',
        '',
        Buffer.from(JSON.stringify(measurement)),
        {
          persistent: true,
          contentType: 'application/json',
        },
      );

      console.log('Published:', measurement);
    });
  }
}