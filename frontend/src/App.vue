<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface SensorMeasurement {
  sensor: string;
  temperatura: number;
  x: number;
  y: number;
}

const measurements = ref<Record<string, SensorMeasurement>>({});

let eventSource: EventSource | null = null;

onMounted(() => {
  eventSource = new EventSource('http://localhost:8001/events');

  eventSource.onmessage = (event) => {
    const measurement: SensorMeasurement = JSON.parse(event.data);

    measurements.value[measurement.sensor] = measurement;
  };

  eventSource.onerror = () => {
    console.error('Error connecting to dashboard SSE');
  };
});

onUnmounted(() => {
  eventSource?.close();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-gray-900 px-6 py-4 text-white shadow">
      <div class="mx-auto max-w-7xl">
        <h1 class="text-2xl font-bold">
          Monitor de Sensores
        </h1>

        <p class="mt-1 text-sm text-gray-300">
          Monitoreo de temperatura en tiempo real
        </p>
      </div>
    </header>

    <main class="mx-auto max-w-7xl p-6">
      <div class="grid gap-6 md:grid-cols-3">
        <section class="rounded-lg bg-white p-6 shadow">
          <h2 class="text-lg font-semibold text-gray-800">
            Sensores
          </h2>

          <p class="mt-2 text-3xl font-bold text-gray-900">
            {{ Object.keys(measurements).length }}
          </p>

          <p class="mt-1 text-sm text-gray-500">
            Sensores activos
          </p>
        </section>

        <section class="rounded-lg bg-white p-6 shadow">
          <h2 class="text-lg font-semibold text-gray-800">
            Estado
          </h2>

          <p
            class="mt-2 text-3xl font-bold"
            :class="
              Object.keys(measurements).length === 6
                ? 'text-green-600'
                : 'text-yellow-600'
            "
          >
            {{
              Object.keys(measurements).length === 6
                ? 'Conectado'
                : 'Conectando...'
            }}
          </p>

          <p class="mt-1 text-sm text-gray-500">
            Conexión con el sistema de sensores
          </p>
        </section>

        <section class="rounded-lg bg-white p-6 shadow">
          <h2 class="text-lg font-semibold text-gray-800">
            Mediciones
          </h2>

          <p class="mt-2 text-3xl font-bold text-gray-900">
            {{ Object.keys(measurements).length }}
          </p>

          <p class="mt-1 text-sm text-gray-500">
            Últimas mediciones recibidas
          </p>
        </section>
      </div>

      <section class="mt-6 rounded-lg bg-white p-6 shadow">
        <h2 class="text-xl font-semibold text-gray-800">
          Sensores
        </h2>

        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="px-4 py-3 text-sm font-semibold text-gray-600">
                  Sensor
                </th>

                <th class="px-4 py-3 text-sm font-semibold text-gray-600">
                  Temperatura
                </th>

                <th class="px-4 py-3 text-sm font-semibold text-gray-600">
                  Posición
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="measurement in measurements"
                :key="measurement.sensor"
                class="border-b border-gray-100"
              >
                <td class="px-4 py-3 font-medium text-gray-800">
                  {{ measurement.sensor }}
                </td>

                <td class="px-4 py-3">
                  <span
                    class="font-semibold"
                    :class="
                      measurement.temperatura > 35
                        ? 'text-red-600'
                        : 'text-gray-700'
                    "
                  >
                    {{ measurement.temperatura }} °C
                  </span>
                </td>

                <td class="px-4 py-3 text-gray-600">
                  ({{ measurement.x }}, {{ measurement.y }})
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>