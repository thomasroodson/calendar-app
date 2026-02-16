<script lang="ts">
  import DayView from "./views/DayView.svelte";
  import MonthView from "./views/MonthView.svelte";
  import WeekView from "./views/WeekView.svelte";
  import ThemeToggle from "$lib/components/ui/ThemeToggle.svelte";
  import DragUpdateAlert from "$lib/components/ui/DragUpdateAlert.svelte";
  import { ChevronLeftIcon, ChevronRightIcon } from "$lib/components/icons";
  import type { CalendarEvent } from "$lib/types/calendar";
  import { calendarStore, updateEventDates, loadRange } from "$lib/stores/calendar.svelte";

  import {
    buildEventsByDay,
    endOfDay,
    formatMonthYear,
    getMonthGridDates,
    getWeekDays,
    startOfDay,
    toDayKey
  } from "$lib/utils/dateUtils";

  type ViewMode = "day" | "week" | "month";

  let {
    view = $bindable(),
    onViewChange,
    onEmptySlotClick,
    onEventClick,
    onEventDrop,
    focusRequest
  }: {
    view: ViewMode;
    onViewChange?: (v: ViewMode) => void;
    onEmptySlotClick?: (start: Date) => void;
    onEventClick?: (event: CalendarEvent, rect?: DOMRect) => void;
    onEventDrop?: (id: string, start: Date, end: Date, oldStart: Date, oldEnd: Date) => void;
    focusRequest?: { id: string; nonce: number } | null;
  } = $props();

  let loadTimeout: ReturnType<typeof setTimeout> | null = null;
  let lastKey = "";

  const currentDate = $derived.by(() => calendarStore.currentDate);
  const events = $derived.by(() => calendarStore.events);

  const visibleDays = $derived.by(() => {
    if (view === "day") return [currentDate];
    if (view === "week") return getWeekDays(currentDate);
    return getMonthGridDates(currentDate).filter(Boolean) as Date[];
  });

  const rangeStart = $derived.by(() => startOfDay(visibleDays[0]));
  const rangeEnd = $derived.by(() => endOfDay(visibleDays[visibleDays.length - 1]));

  $effect(() => {
    // rangeStart e rangeEnd precisam existir aqui
    const start = rangeStart;
    const end = rangeEnd;

    const key = `${start.toISOString()}|${end.toISOString()}`;
    if (key === lastKey) return;
    lastKey = key;

    if (loadTimeout) clearTimeout(loadTimeout);

    loadTimeout = setTimeout(() => {
      loadRange(start, end);
    }, 250); // 👈 aumenta/diminui se quiser (250–400 fica ótimo)
  });

  $effect(() => {
    return () => {
      if (loadTimeout) clearTimeout(loadTimeout);
    };
  });

  const eventsByDay = $derived.by(() => buildEventsByDay(events, rangeStart, rangeEnd));
  const headerLabel = $derived.by(() => formatMonthYear(currentDate));
  const dayBadge = $derived.by(() => currentDate.getDate());
  const currentDayKey = $derived.by(() => toDayKey(currentDate));
  const dayEvents = $derived.by(() => eventsByDay.get(currentDayKey) ?? []);

  const goToday = () => (calendarStore.currentDate = new Date());

  const handleSelectChange = (e: Event) => {
    const next = (e.currentTarget as HTMLSelectElement).value as ViewMode;
    onViewChange?.(next);
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

  const handleEventDrop = async (id: string, start: Date, end: Date) => {
    const prev = calendarStore.events.find((e) => e.id === id);
    if (!prev) return;

    // otimista: atualiza imediatamente
    calendarStore.events = calendarStore.events.map((ev) =>
      ev.id === id ? { ...ev, startDate: start.toISOString(), endDate: end.toISOString() } : ev
    );

    try {
      onEventDrop?.(id, start, end, new Date(prev.startDate), new Date(prev.endDate));
      await updateEventDates(id, start, end);
    } catch (err) {
      calendarStore.events = calendarStore.events.map((ev) => (ev.id === id ? prev : ev));
      console.error(err);
    }
  };
</script>

<header
  class="calendar-header mb-6 flex items-center justify-between rounded-2xl border border-base-200 bg-base-100 px-4 py-4 shadow-sm md:px-6"
>
  <div class="flex min-w-0 items-center gap-4">
    <div
      class="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-content shadow-sm md:h-10 md:w-10"
    >
      {dayBadge}
    </div>

    <h2 class="font-normal md:text-xl">{headerLabel}</h2>

    <button
      class="btn ml-2 hidden border border-base-300 px-4 btn-ghost btn-sm lg:inline-flex"
      onclick={goToday}
      type="button"
    >
      Hoje
    </button>
  </div>

  <div class="flex flex-col items-center gap-4 md:flex-row">
    <select
      bind:value={view}
      class="select-bordered select select-sm font-medium"
      onchange={handleSelectChange}
    >
      <option value="day">Dia</option>
      <option value="week">Semana</option>
      <option value="month">Mês</option>
    </select>

    <div class="flex items-center gap-4">
      <div class="join border border-base-200">
        <button class="btn join-item btn-ghost btn-sm" onclick={goPrev} type="button"
          ><ChevronLeftIcon size={16} /></button
        >
        <button class="btn join-item btn-ghost btn-sm" onclick={goNext} type="button"
          ><ChevronRightIcon size={16} /></button
        >
      </div>

      <ThemeToggle />
    </div>
  </div>
</header>

<div class="h-full overflow-hidden rounded-xl border border-base-200 bg-base-100 shadow-sm">
  {#if view === "day"}
    <DayView
      date={currentDate}
      events={dayEvents}
      {onEmptySlotClick}
      {onEventClick}
      onEventDrop={handleEventDrop}
      {focusRequest}
    />
  {:else if view === "week"}
    <WeekView
      days={visibleDays}
      {eventsByDay}
      {onEmptySlotClick}
      {onEventClick}
      onEventDrop={handleEventDrop}
      onNavigateWeek={(dir) => (dir === "prev" ? goPrev() : goNext())}
    />
  {:else}
    <MonthView
      {currentDate}
      {eventsByDay}
      {onEmptySlotClick}
      {onEventClick}
      onEventDrop={handleEventDrop}
    />
  {/if}
</div>
