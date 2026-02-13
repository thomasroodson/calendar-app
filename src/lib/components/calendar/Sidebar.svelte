<script lang="ts">
  import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "$lib/components/icons";
  import { calendarStore } from "$lib/stores/calendar.svelte";
  import { formatMonthYear } from "$lib/utils/dateUtils";

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  // Estado atual
  const currentDate = $derived.by(() => calendarStore.currentDate);

  const year = $derived.by(() => currentDate.getFullYear());
  const month = $derived.by(() => currentDate.getMonth());

  // Total de dias do mês
  const daysInMonth = $derived.by(() => new Date(year, month + 1, 0).getDate());

  // Lista de dias (1..n)
  const days = $derived.by(() => Array.from({ length: daysInMonth }, (_, i) => i + 1));

  // Descobrir em qual dia da semana começa o mês
  const firstDayOfWeek = $derived.by(() => new Date(year, month, 1).getDay());

  // Construir células com blanks no início
  const calendarCells = $derived.by(() => {
    const totalCells = 42; // 6 semanas * 7 dias
    const cells: (number | null)[] = Array.from({ length: totalCells }, () => null);

    for (let i = 0; i < daysInMonth; i++) {
      cells[firstDayOfWeek + i] = i + 1;
    }

    return cells;
  });

  const activeDay = $derived.by(() => currentDate.getDate());
  const monthLabel = $derived.by(() => formatMonthYear(currentDate));
</script>

<aside
  class="flex w-full flex-col gap-6 bg-base-200/50 p-4 transition-all duration-300 md:w-64 md:gap-8"
>
  <!-- Botão Criar -->
  <div
    role="button"
    tabindex="0"
    class="group btn flex rounded-2xl border-none bg-base-100 px-4 py-6 normal-case shadow-md btn-sm hover:bg-base-200 md:px-6 md:py-0 md:btn-lg"
  >
    <PlusIcon size={15} class="transition-transform group-hover:scale-110" />
    <span class="text-base font-normal uppercase">Criar</span>
  </div>

  <!-- Mini Calendário -->
  <div class="px-2">
    <div class="mb-4 flex items-center justify-between">
      <span class="px-2 text-sm font-medium">{monthLabel}</span>

      <div class="flex gap-1">
        <button class="btn btn-circle btn-ghost btn-xs">
          <ChevronLeftIcon size={14} />
        </button>
        <button class="btn btn-circle btn-ghost btn-xs">
          <ChevronRightIcon size={14} />
        </button>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-y-1 text-center">
      <!-- Cabeçalho da semana -->
      {#each weekDays as day}
        <span class="text-[10px] font-bold opacity-40 md:pl-0">{day}</span>
      {/each}

      <!-- Dias do mês -->
      {#each calendarCells as day, i (i)}
        {#if day === null}
          <div class="h-7 w-7"></div>
        {:else}
          <div class="flex items-center justify-center">
            <button
              class={`h-7 w-7 rounded-full text-[11px] transition-colors ${
                day === activeDay
                  ? "pointer-events-none bg-primary text-primary-content"
                  : "hover:bg-base-300"
              }`}
            >
              {day}
            </button>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</aside>
