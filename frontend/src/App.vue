<script setup lang="ts">
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'vue';

import DashboardHeader from './components/DashboardHeader.vue';
import SummaryCards from './components/SummaryCards.vue';
import SensorMap from './components/SensorMap.vue';
import AlertsPanel from './components/AlertsPanel.vue';
import SensorStatusTable from './components/SensorStatusTable.vue';

interface SensorMeasurement {
  sensor: string;
  temperatura: number;
  x: number;
  y: number;
}

interface SensorAlert extends SensorMeasurement {
  mensaje: string;
}

const measurements = ref<
  Record<string, SensorMeasurement>
>({});

const alerts = ref<SensorAlert[]>([]);

const totalAlerts = ref(0);

let measurementEventSource: EventSource | null = null;
let alertEventSource: EventSource | null = null;

const sensorCount = computed(
  () => Object.keys(measurements.value).length,
);

const averageTemperature = computed(() => {
  const values = Object.values(
    measurements.value,
  );

  if (values.length === 0) {
    return 0;
  }

  const total = values.reduce(
    (sum, measurement) =>
      sum + measurement.temperatura,
    0,
  );

  return total / values.length;
});

const recentAlerts = computed(() => {
  return alerts.value.slice(0, 5);
});

const connectionStatus = computed(() => {
  return sensorCount.value === 6;
});

onMounted(() => {
  measurementEventSource = new EventSource(
    'http://localhost:8001/events',
  );

  measurementEventSource.onmessage = (event) => {
    const measurement: SensorMeasurement =
      JSON.parse(event.data);

    measurements.value[measurement.sensor] =
      measurement;
  };

  measurementEventSource.onerror = () => {
    console.error(
      'Error connecting to dashboard SSE',
    );
  };

  alertEventSource = new EventSource(
    'http://localhost:8002/events',
  );

  alertEventSource.onmessage = (event) => {
    const alert: SensorAlert =
      JSON.parse(event.data);

    alerts.value.unshift(alert);

    totalAlerts.value++;

    if (alerts.value.length > 20) {
      alerts.value.pop();
    }
  };

  alertEventSource.onerror = () => {
    console.error(
      'Error connecting to alerts SSE',
    );
  };
});

onUnmounted(() => {
  measurementEventSource?.close();
  alertEventSource?.close();
});
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-900">

    <DashboardHeader
      :online="connectionStatus"
    />

    <main
      class="mx-auto max-w-7xl space-y-6 px-6 py-6"
    >

      <SummaryCards
        :sensor-count="sensorCount"
        :average-temperature="averageTemperature"
        :total-alerts="totalAlerts"
      />

      <section class="grid gap-6 lg:grid-cols-3">

        <SensorMap
          :measurements="measurements"
        />

        <AlertsPanel
          :alerts="recentAlerts"
          :total-alerts="totalAlerts"
        />

      </section>

      <SensorStatusTable
        :measurements="measurements"
      />

    </main>
  </div>
</template>