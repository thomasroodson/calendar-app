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
  import type { CalendarEvent } from "$lib/types/calendar";

  let {
    onEmptySlotClick,
    onEventClick
  }: {
    onEmptySlotClick?: (start: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
  } = $props();

  type ViewMode = "day" | "week" | "month";
  let view = $state<ViewMode>("week");

  const currentDate = $derived.by(() => calendarStore.currentDate);
  const events = $derived.by(() => calendarStore.events);

  const visibleDays = $derived.by(() => {
    if (view === "day") return [currentDate];
    if (view === "week") return getWeekDays(currentDate);
    return getMonthGridDates(currentDate).filter(Boolean) as Date[];
  });

  const rangeStart = $derived.by(() => startOfDay(visibleDays[0]));
  const rangeEnd = $derived.by(() => endOfDay(visibleDays[visibleDays.length - 1]));

  const eventsByDay = $derived.by(() => buildEventsByDay(events, rangeStart, rangeEnd));
  const headerLabel = $derived.by(() => formatMonthYear(currentDate));

  const goToday = () => (calendarStore.currentDate = new Date());

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

  const dayBadge = $derived.by(() => currentDate.getDate());
  const currentDayKey = $derived.by(() => toDayKey(currentDate));
  const dayEvents = $derived.by(() => eventsByDay.get(currentDayKey) ?? []);
</script>

<header
  class="calendar-header mb-6 flex items-center justify-between rounded-2xl border border-base-200 bg-base-100 px-4 py-4 shadow-sm md:px-6"
>
  <div class="flex min-w-0 items-center gap-4">
    <div
      class="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-content shadow-sm md:ml-2"
    >
      {dayBadge}
    </div>

    <h2 class="min-w-0 truncate text-base font-normal capitalize md:text-xl">{headerLabel}</h2>

    <button
      class="btn ml-2 hidden border border-base-300 px-4 btn-ghost btn-sm lg:inline-flex"
      onclick={goToday}
    >
      Hoje
    </button>
  </div>

  <div class="flex items-center gap-3 md:gap-4">
    <select bind:value={view} class="select-bordered select bg-base-100 select-sm">
      <option value="day">Dia</option>
      <option value="week">Semana</option>
      <option value="month">Mês</option>
    </select>

    <div class="join border border-base-200">
      <button class="btn join-item btn-ghost btn-sm" onclick={goPrev}
        ><ChevronLeftIcon size={16} /></button
      >
      <button class="btn join-item btn-ghost btn-sm" onclick={goNext}
        ><ChevronRightIcon size={16} /></button
      >
    </div>

    <ThemeToggle />
  </div>
</header>

<div class="h-full overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
  {#if view === "day"}
    <DayView date={currentDate} events={dayEvents} {onEmptySlotClick} {onEventClick} />
  {:else if view === "week"}
    <WeekView days={visibleDays} {eventsByDay} {onEmptySlotClick} {onEventClick} />
  {:else}
    <MonthView {currentDate} {eventsByDay} {onEmptySlotClick} {onEventClick} />
  {/if}
</div>
