<script setup lang="ts">
defineProps<{
  sensorCount: number;
  averageTemperature: number;
  totalAlerts: number;
}>();
</script>

<template>
  <section
    class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
  >
    <!-- Sensores activos -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">
            Sensores activos
          </p>

          <p class="mt-2 text-3xl font-bold tracking-tight">
            {{ sensorCount }}

            <span
              class="text-lg font-medium text-slate-400"
            >
              / 6
            </span>
          </p>
        </div>

        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v18m9-9H3"
            />
          </svg>
        </div>
      </div>

      <p class="mt-3 text-xs text-slate-400">
        Dispositivos reportando mediciones
      </p>
    </div>

    <!-- Temperatura promedio -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">
            Temperatura promedio
          </p>

          <p class="mt-2 text-3xl font-bold tracking-tight">
            {{ averageTemperature.toFixed(1) }}

            <span
              class="text-lg font-medium text-slate-400"
            >
              °C
            </span>
          </p>
        </div>

        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14 14.76V3a2 2 0 0 0-4 0v11.76a5 5 0 1 0 4 0Z"
            />
          </svg>
        </div>
      </div>

      <p class="mt-3 text-xs text-slate-400">
        Promedio de los sensores activos
      </p>
    </div>

    <!-- Alertas -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">
            Alertas recibidas
          </p>

          <p class="mt-2 text-3xl font-bold tracking-tight">
            {{ totalAlerts }}
          </p>
        </div>

        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 9v3m0 4h.01M10.29 3.86 2.82 17a2 2 0 0 0 1.74 3h14.88a2 2 0 0 0 1.74-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            />
          </svg>
        </div>
      </div>

      <p class="mt-3 text-xs text-slate-400">
        Temperaturas superiores a 35 °C
      </p>
    </div>

    <!-- Frecuencia de actualización -->
    <div
      class="rounded-2xl border border-slate-200 bg-white p-5"
    >
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">
            Actualización
          </p>

          <p class="mt-2 text-3xl font-bold tracking-tight">
            2

            <span
              class="text-lg font-medium text-slate-400"
            >
              seg.
            </span>
          </p>
        </div>

        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 8v4l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      </div>

      <p class="mt-3 text-xs text-slate-400">
        Frecuencia de medición
      </p>
    </div>
  </section>
</template>