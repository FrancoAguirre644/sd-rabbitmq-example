<script setup lang="ts">
interface SensorAlert {
  sensor: string;
  temperatura: number;
  x: number;
  y: number;
  mensaje: string;
}

defineProps<{
  alerts: SensorAlert[];
  totalAlerts: number;
}>();
</script>

<template>
  <aside
    class="flex min-h-0 flex-col rounded-2xl border border-slate-200 bg-white p-6"
  >
    <!-- Encabezado -->
    <div
      class="flex items-start justify-between gap-3"
    >
      <div>
        <h2 class="text-lg font-bold text-slate-900">
          Alertas
        </h2>

        <p class="mt-1 text-sm text-slate-500">
          Últimos eventos detectados
        </p>
      </div>

      <span
        v-if="totalAlerts > 0"
        class="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700"
      >
        {{ totalAlerts }}
      </span>
    </div>

    <!-- Sin alertas -->
    <div
      v-if="alerts.length === 0"
      class="flex flex-1 items-center justify-center py-12"
    >
      <div class="text-center">

        <div
          class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m5 12 4 4L19 6"
            />
          </svg>
        </div>

        <p class="mt-3 font-medium text-slate-700">
          Sin alertas
        </p>

        <p class="mt-1 text-xs text-slate-400">
          No se detectaron temperaturas elevadas.
        </p>

      </div>
    </div>

    <!-- Lista de alertas -->
    <div
      v-else
      class="mt-5 space-y-3"
    >
      <article
        v-for="(alert, index) in alerts"
        :key="`${alert.sensor}-${index}`"
        class="rounded-xl border border-red-100 bg-red-50/60 p-4"
      >
        <div
          class="flex items-start justify-between gap-3"
        >
          <div class="min-w-0">

            <div class="flex items-center gap-2">
              <span
                class="h-2 w-2 shrink-0 rounded-full bg-red-500"
              ></span>

              <span
                class="font-semibold text-red-800"
              >
                {{ alert.sensor }}
              </span>
            </div>

            <p
              class="mt-2 text-sm leading-5 text-red-700"
            >
              {{ alert.mensaje }}
            </p>

          </div>

          <span
            class="shrink-0 text-sm font-bold text-red-700"
          >
            {{ alert.temperatura }} °C
          </span>
        </div>
      </article>
    </div>

    <!-- Pie -->
    <p
      v-if="alerts.length > 0"
      class="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-400"
    >
      Mostrando las últimas
      {{ alerts.length }}
      alertas.
    </p>
  </aside>
</template>