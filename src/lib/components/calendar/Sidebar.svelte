<script lang="ts">
  import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "$lib/components/icons";
  import { calendarStore } from "$lib/stores/calendar.svelte";
  import { formatMonthYear } from "$lib/utils/dateUtils";

  let { onCreate, onSelectDay }: { onCreate: () => void; onSelectDay: (date: Date) => void } =
    $props();

  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

  const currentDate = $derived.by(() => calendarStore.currentDate);
  const year = $derived.by(() => currentDate.getFullYear());
  const month = $derived.by(() => currentDate.getMonth());

  const daysInMonth = $derived.by(() => new Date(year, month + 1, 0).getDate());
  const days = $derived.by(() => Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const activeDay = $derived.by(() => currentDate.getDate());
  const monthLabel = $derived.by(() => formatMonthYear(currentDate));

  const firstDayOfWeek = $derived.by(() => new Date(year, month, 1).getDay());
  const calendarCells = $derived.by(() => {
    const blanks = Array.from({ length: firstDayOfWeek }, () => null);
    return [...blanks, ...days];
  });

  const goPrevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    calendarStore.currentDate = d;
  };

  const goNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    calendarStore.currentDate = d;
  };

  const handleDayClick = (day: number) => {
    const d = new Date(currentDate);
    d.setDate(day);
    d.setHours(0, 0, 0, 0);

    calendarStore.currentDate = d;
    onSelectDay?.(d); // ✅ pede para trocar para DayView
  };
</script>

<aside
  class="flex w-full flex-col gap-6 bg-base-200/50 p-4 transition-all duration-300 md:w-64 md:gap-8"
>
  <!-- Botão Criar -->
  <button
    type="button"
    class="group btn flex rounded-2xl border-none bg-base-100 px-6 normal-case shadow-md btn-lg hover:bg-base-200"
    onclick={onCreate}
  >
    <PlusIcon size={15} class="transition-transform group-hover:scale-110" />
    <span class="text-base font-normal uppercase">Criar</span>
  </button>

  <!-- Mini Calendário -->
  <div class="px-2">
    <div class="mb-4 flex items-center justify-between">
      <span class="px-2 text-sm font-medium">{monthLabel}</span>
      <div class="flex gap-1">
        <button class="btn btn-circle btn-ghost btn-xs" type="button" onclick={goPrevMonth}
          ><ChevronLeftIcon size={14} /></button
        >
        <button class="btn btn-circle btn-ghost btn-xs" type="button" onclick={goNextMonth}
          ><ChevronRightIcon size={14} /></button
        >
      </div>
    </div>

    <div class="grid grid-cols-7 gap-y-1 text-center">
      {#each weekDays as d}
        <span class="text-[10px] font-bold opacity-40">{d}</span>
      {/each}

      {#each calendarCells as day}
        {#if day === null}
          <div class="h-7 w-7"></div>
        {:else}
          <button
            type="button"
            class={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition-colors ${
              day === activeDay
                ? "pointer-events-none bg-primary text-primary-content"
                : "hover:bg-base-300"
            }`}
            onclick={() => handleDayClick(day)}
          >
            {day}
          </button>
        {/if}
      {/each}
    </div>
  </div>
</aside>
