import { Injectable } from '@nestjs/common';

export interface Sensor {
  id: string;
  x: number;
  y: number;
}

export interface SensorMeasurement {
  sensor: string;
  temperatura: number;
  x: number;
  y: number;
}

@Injectable()
export class SensorsService {
  private readonly sensors: Sensor[] = [
    {
      id: 'S01',
      x: 20,
      y: 20,
    },
    {
      id: 'S02',
      x: 50,
      y: 20,
    },
    {
      id: 'S03',
      x: 80,
      y: 20,
    },
    {
      id: 'S04',
      x: 20,
      y: 60,
    },
    {
      id: 'S05',
      x: 50,
      y: 60,
    },
    {
      id: 'S06',
      x: 80,
      y: 60,
    },
  ];

  getSensors(): Sensor[] {
    return this.sensors;
  }

  generateTemperature(): number {
    const min = 20;
    const max = 40;

    return Number(
      (Math.random() * (max - min) + min).toFixed(1),
    );
  }
}