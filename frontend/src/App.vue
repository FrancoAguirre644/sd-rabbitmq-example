<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface SensorMeasurement {
  sensor: string;
  temperatura: number;
  x: number;
  y: number;
}

interface SensorAlert extends SensorMeasurement {
  mensaje: string;
}

const measurements = ref<Record<string, SensorMeasurement>>({});

const alerts = ref<SensorAlert[]>([]);

let measurementEventSource: EventSource | null = null;

let alertEventSource: EventSource | null = null;

onMounted(() => {
  measurementEventSource = new EventSource(
    'http://localhost:8001/events',
  );

  measurementEventSource.onmessage = (event) => {
    const measurement: SensorMeasurement =
      JSON.parse(event.data);

    measurements.value[measurement.sensor] = measurement;
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
    const alert: SensorAlert = JSON.parse(event.data);

    alerts.value.unshift(alert);

    if (alerts.value.length > 10) {
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

      <!-- Resumen -->
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
            Alertas
          </h2>

          <p class="mt-2 text-3xl font-bold text-red-600">
            {{ alerts.length }}
          </p>

          <p class="mt-1 text-sm text-gray-500">
            Alertas recientes
          </p>
        </section>

      </div>

      <!-- Mapa -->
      <section class="mt-6 rounded-lg bg-white p-6 shadow">

        <div>
          <h2 class="text-xl font-semibold text-gray-800">
            Mapa de sensores
          </h2>

          <p class="mt-1 text-sm text-gray-500">
            Ubicación y temperatura actual de cada sensor
          </p>
        </div>

        <div
          class="relative mt-6 h-[500px] overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
        >

          <!-- Línea horizontal -->
          <div
            class="absolute inset-x-0 top-1/2 border-t border-dashed border-gray-300"
          ></div>

          <!-- Línea vertical -->
          <div
            class="absolute inset-y-0 left-1/2 border-l border-dashed border-gray-300"
          ></div>

          <!-- Sensores -->
          <div
            v-for="measurement in measurements"
            :key="measurement.sensor"
            class="absolute -translate-x-1/2 -translate-y-1/2"
            :style="{
              left: `${measurement.x}%`,
              top: `${measurement.y}%`,
            }"
          >

            <div class="flex flex-col items-center">

              <div
                class="flex h-16 w-16 items-center justify-center rounded-full border-4 shadow-lg"
                :class="
                  measurement.temperatura > 35
                    ? 'border-red-500 bg-red-100'
                    : 'border-green-500 bg-green-100'
                "
              >
                <span class="text-sm font-bold text-gray-800">
                  {{ measurement.sensor }}
                </span>
              </div>

              <div
                class="mt-2 rounded-md bg-white px-3 py-1 text-sm font-semibold shadow"
              >
                {{ measurement.temperatura }} °C
              </div>

            </div>

          </div>

        </div>

        <!-- Referencia -->
        <div class="mt-4 flex flex-wrap gap-6 text-sm text-gray-600">

          <div class="flex items-center gap-2">
            <span
              class="h-4 w-4 rounded-full bg-green-100 ring-2 ring-green-500"
            ></span>

            Temperatura normal
          </div>

          <div class="flex items-center gap-2">
            <span
              class="h-4 w-4 rounded-full bg-red-100 ring-2 ring-red-500"
            ></span>

            Temperatura elevada
          </div>

        </div>

      </section>

      <!-- Alertas -->
      <section class="mt-6 rounded-lg bg-white p-6 shadow">

        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl font-semibold text-gray-800">
              Alertas recientes
            </h2>

            <p class="mt-1 text-sm text-gray-500">
              Alertas recibidas desde el consumidor de alertas
            </p>
          </div>

          <span
            class="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700"
          >
            {{ alerts.length }}
          </span>
        </div>

        <!-- Sin alertas -->
        <div
          v-if="alerts.length === 0"
          class="mt-4 rounded-lg border border-dashed border-gray-300 p-8 text-center"
        >
          <p class="text-gray-500">
            No hay alertas registradas.
          </p>
        </div>

        <!-- Lista de alertas -->
        <div
          v-else
          class="mt-4 space-y-3"
        >

          <div
            v-for="(alert, index) in alerts"
            :key="`${alert.sensor}-${index}`"
            class="rounded-lg border border-red-200 bg-red-50 p-4"
          >

            <div class="flex items-center justify-between">

              <div>
                <p class="font-semibold text-red-800">
                  {{ alert.sensor }}
                </p>

                <p class="mt-1 text-sm text-red-700">
                  {{ alert.mensaje }}
                </p>
              </div>

              <div class="text-right">
                <p class="text-lg font-bold text-red-700">
                  {{ alert.temperatura }} °C
                </p>

                <p class="text-xs text-red-600">
                  ({{ alert.x }}, {{ alert.y }})
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      <!-- Detalle -->
      <section class="mt-6 rounded-lg bg-white p-6 shadow">

        <h2 class="text-xl font-semibold text-gray-800">
          Detalle de sensores
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
                  Coordenadas
                </th>

                <th class="px-4 py-3 text-sm font-semibold text-gray-600">
                  Estado
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

                <td class="px-4 py-3 font-semibold">
                  {{ measurement.temperatura }} °C
                </td>

                <td class="px-4 py-3 text-gray-600">
                  ({{ measurement.x }}, {{ measurement.y }})
                </td>

                <td class="px-4 py-3">

                  <span
                    v-if="measurement.temperatura > 35"
                    class="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700"
                  >
                    Temperatura elevada
                  </span>

                  <span
                    v-else
                    class="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700"
                  >
                    Normal
                  </span>

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      </section>

    </main>
  </div>
</template>