<script setup lang="ts">
interface SensorMeasurement {
  sensor: string;
  temperatura: number;
  x: number;
  y: number;
}

defineProps<{
  measurements: Record<string, SensorMeasurement>;
}>();

function isHighTemperature(
  measurement: SensorMeasurement,
): boolean {
  return measurement.temperatura > 35;
}

function getSensorStatus(
  measurement: SensorMeasurement,
): string {
  return isHighTemperature(measurement)
    ? 'Elevada'
    : 'Normal';
}

function getSensorStatusClasses(
  measurement: SensorMeasurement,
): string {
  return isHighTemperature(measurement)
    ? 'bg-red-50 text-red-700 ring-red-200'
    : 'bg-emerald-50 text-emerald-700 ring-emerald-200';
}
</script>

<template>
  <section
    class="rounded-2xl border border-slate-200 bg-white"
  >
    <!-- Encabezado -->
    <div
      class="flex flex-col gap-1 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 class="text-lg font-bold text-slate-900">
          Estado de los sensores
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          Última medición recibida de cada dispositivo
        </p>
      </div>

      <span class="text-xs text-slate-400">
        {{ Object.keys(measurements).length }} de 6 conectados
      </span>
    </div>

    <!-- Tabla -->
    <div class="overflow-x-auto">
      <table class="w-full min-w-[650px] text-left">

        <thead>
          <tr
            class="border-b border-slate-100 bg-slate-50/70"
          >
            <th
              class="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Sensor
            </th>

            <th
              class="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Temperatura
            </th>

            <th
              class="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Ubicación
            </th>

            <th
              class="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
            >
              Estado
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="measurement in measurements"
            :key="measurement.sensor"
            class="border-b border-slate-100 last:border-0"
          >
            <!-- Sensor -->
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">

                <div
                  class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700"
                >
                  {{ measurement.sensor }}
                </div>

                <span
                  class="font-medium text-slate-800"
                >
                  Sensor {{ measurement.sensor }}
                </span>

              </div>
            </td>

            <!-- Temperatura -->
            <td
              class="px-6 py-4 font-semibold text-slate-700"
            >
              {{ measurement.temperatura }} °C
            </td>

            <!-- Ubicación -->
            <td
              class="px-6 py-4 text-sm text-slate-500"
            >
              X: {{ measurement.x }}

              <span class="mx-1 text-slate-300">
                /
              </span>

              Y: {{ measurement.y }}
            </td>

            <!-- Estado -->
            <td class="px-6 py-4">
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1"
                :class="
                  getSensorStatusClasses(
                    measurement,
                  )
                "
              >
                <span
                  class="h-1.5 w-1.5 rounded-full"
                  :class="
                    isHighTemperature(
                      measurement,
                    )
                      ? 'bg-red-500'
                      : 'bg-emerald-500'
                  "
                ></span>

                {{ getSensorStatus(measurement) }}
              </span>
            </td>
          </tr>

          <!-- Sin mediciones -->
          <tr
            v-if="Object.keys(measurements).length === 0"
          >
            <td
              colspan="4"
              class="px-6 py-10 text-center text-sm text-slate-400"
            >
              Esperando mediciones...
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  </section>
</template>