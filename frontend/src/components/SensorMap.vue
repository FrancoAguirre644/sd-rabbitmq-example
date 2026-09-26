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

function getSensorMapClasses(
  measurement: SensorMeasurement,
): string {
  return isHighTemperature(measurement)
    ? 'border-red-500 bg-red-50 text-red-700'
    : 'border-emerald-500 bg-emerald-50 text-emerald-700';
}
</script>

<template>
  <section
    class="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2"
  >
    <!-- Encabezado -->
    <div
      class="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
    >
      <div>
        <h2 class="text-lg font-bold text-slate-900">
          Distribución de sensores
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          Estado actual según ubicación y temperatura
        </p>
      </div>

      <!-- Referencias -->
      <div
        class="flex items-center gap-4 text-xs text-slate-500"
      >
        <div class="flex items-center gap-2">
          <span
            class="h-2.5 w-2.5 rounded-full bg-emerald-500"
          ></span>

          Normal
        </div>

        <div class="flex items-center gap-2">
          <span
            class="h-2.5 w-2.5 rounded-full bg-red-500"
          ></span>

          Elevada
        </div>
      </div>
    </div>

    <!-- Mapa -->
    <div
      class="relative mt-6 h-[430px] overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
    >
      <!-- Grid -->
      <div
        class="absolute inset-0 opacity-60"
        style="
          background-image:
            linear-gradient(
              to right,
              #e2e8f0 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              #e2e8f0 1px,
              transparent 1px
            );
          background-size: 10% 20%;
        "
      ></div>

      <!-- Eje horizontal -->
      <div
        class="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-300"
      ></div>

      <!-- Eje vertical -->
      <div
        class="absolute inset-y-0 left-1/2 border-l border-dashed border-slate-300"
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

          <!-- Sensor -->
          <div
            class="flex h-14 w-14 items-center justify-center rounded-full border-[3px] bg-white font-bold shadow-sm"
            :class="getSensorMapClasses(measurement)"
          >
            {{ measurement.sensor }}
          </div>

          <!-- Temperatura -->
          <div
            class="mt-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm"
          >
            {{ measurement.temperatura }} °C
          </div>

        </div>
      </div>

      <!-- Estado inicial -->
      <div
        v-if="Object.keys(measurements).length === 0"
        class="absolute inset-0 flex items-center justify-center"
      >
        <div class="text-center">
          <p class="font-medium text-slate-600">
            Esperando sensores...
          </p>

          <p class="mt-1 text-sm text-slate-400">
            Las mediciones aparecerán automáticamente.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>