<!-- src/lib/components/CalendarGrid.svelte -->
<script lang="ts">
  import ThemeToggle from "$lib/components/ui/ThemeToggle.svelte";
  import DayView from "./views/DayView.svelte";
  import WeekView from "./views/WeekView.svelte";
  import MonthView from "./views/MonthView.svelte";
  import { ChevronLeftIcon, ChevronRightIcon } from "$lib/components/icons";

  import { calendarStore } from "$lib/stores/calendar.svelte";
  import {
    getWeekDays,
    getMonthGridDates,
    buildEventsByDay,
    startOfDay,
    endOfDay,
    formatMonthYear,
    toDayKey
  } from "$lib/utils/dateUtils";

  type ViewMode = "day" | "week" | "month";
  let view = $state<ViewMode>("week");

  // --- Base state (store) ---
  const currentDate = $derived.by(() => calendarStore.currentDate);
  const events = $derived.by(() => calendarStore.events);

  // --- Visible dates for each view ---
  const visibleDays = $derived.by(() => {
    if (view === "day") return [currentDate];
    if (view === "week") return getWeekDays(currentDate);
    // month: remove nulls (grid still renderable inside MonthView)
    return getMonthGridDates(currentDate).filter(Boolean) as Date[];
  });

  // --- Range derived from visible days ---
  const rangeStart = $derived.by(() => startOfDay(visibleDays[0]));
  const rangeEnd = $derived.by(() => endOfDay(visibleDays[visibleDays.length - 1]));

  // --- Single source of truth for all views ---
  const eventsByDay = $derived.by(() => buildEventsByDay(events, rangeStart, rangeEnd));

  // --- Header label ---
  const headerLabel = $derived.by(() => formatMonthYear(currentDate));

  // --- Navigation helpers (UI only, no API yet) ---
  const goToday = () => {
    calendarStore.currentDate = new Date();
  };

  const goPrev = () => {
    const d = new Date(currentDate);
    if (view === "day") d.setDate(d.getDate() - 1);
    else if (view === "week") d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    calendarStore.currentDate = d;
  };

  const goNext = () => {
    const d = new Date(currentDate);
    if (view === "day") d.setDate(d.getDate() + 1);
    else if (view === "week") d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    calendarStore.currentDate = d;
  };

  // Badge (dia do mês do currentDate)
  const dayBadge = $derived.by(() => currentDate.getDate());

  // Day key of currentDate (useful for DayView)
  const currentDayKey = $derived.by(() => toDayKey(currentDate));
  const dayEvents = $derived.by(() => eventsByDay.get(currentDayKey) ?? []);
</script>

<!-- Header fixo -->
<header
  class="calendar-header mb-6 flex items-center justify-between rounded-2xl border border-base-200 bg-base-100 px-6 py-4 shadow-sm"
>
  <div class="flex items-center gap-4">
    <div
      class="ml-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-content shadow-sm"
    >
      {dayBadge}
    </div>

    <h2 class="text-xl font-normal capitalize">{headerLabel}</h2>

    <button class="btn ml-2 border border-base-300 px-4 btn-ghost btn-sm" onclick={goToday}>
      Hoje
    </button>
  </div>

  <div class="flex items-center gap-4">
    <select bind:value={view} class="select-bordered no-opacity-fix select select-sm font-medium">
      <option value="day">Dia</option>
      <option value="week">Semana</option>
      <option value="month">Mês</option>
    </select>

    <div class="join border border-base-200">
      <button class="btn join-item btn-ghost btn-sm" onclick={goPrev}>
        <ChevronLeftIcon size={16} />
      </button>
      <button class="btn join-item btn-ghost btn-sm" onclick={goNext}>
        <ChevronRightIcon size={16} />
      </button>
    </div>

    <ThemeToggle />
  </div>
</header>

<!-- Container das Views -->
<div class="h-full overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
  {#if view === "day"}
    <DayView date={currentDate} events={dayEvents} />
  {:else if view === "week"}
    <WeekView days={visibleDays} {eventsByDay} />
  {:else}
    <!-- MonthView pode renderizar o grid por conta própria; passamos currentDate + map -->
    <MonthView {currentDate} {eventsByDay} />
  {/if}
</div>
