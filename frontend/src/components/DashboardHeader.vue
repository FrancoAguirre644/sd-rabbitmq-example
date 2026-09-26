<script setup lang="ts">
defineProps<{
  online: boolean;
}>();
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div
      class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5"
    >
      <div>
        <div class="flex items-center gap-3">

          <!-- Icono -->
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"
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
                    d="M12 3a3 3 0 0 0-3 3v7.17a5 5 0 1 0 6 0V6a3 3 0 0 0-3-3Z"
                />

                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 13V7"
                />

                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 17.5v.01"
                />
            </svg>
          </div>

          <!-- Título -->
          <div>
            <h1 class="text-xl font-bold tracking-tight">
              Monitor de Sensores
            </h1>

            <p class="text-sm text-slate-500">
              Monitoreo de temperatura en tiempo real
            </p>
          </div>

        </div>
      </div>

      <!-- Estado de conexión -->
      <div
        class="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm"
        :class="
          online
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-amber-200 bg-amber-50 text-amber-700'
        "
      >
        <span
          class="h-2 w-2 rounded-full"
          :class="
            online
              ? 'bg-emerald-500'
              : 'bg-amber-500'
          "
        ></span>

        <span>
          {{
            online
              ? 'Sistema online'
              : 'Conectando'
          }}
        </span>
      </div>

    </div>
  </header>
</template>