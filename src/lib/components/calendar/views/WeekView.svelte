<script lang="ts">
  import EventCard from "$lib/components/calendar/EventCard.svelte";
  import type { CalendarEvent } from "$lib/types/calendar";
  import { clampEventToDay, toDayKey } from "$lib/utils/dateUtils";

  let {
    days,
    eventsByDay,
    onEmptySlotClick,
    onEventClick,
    onEventDrop,
    onDragStateChange,
    onNavigateWeek
  }: {
    days: Date[];
    eventsByDay: Map<string, CalendarEvent[]>;
    onEmptySlotClick?: (start: Date) => void;
    onEventClick?: (event: CalendarEvent, rect?: DOMRect) => void;
    onEventDrop?: (id: string, start: Date, end: Date) => void;
    onDragStateChange?: (dragging: boolean) => void;
    onNavigateWeek?: (dir: "prev" | "next") => void;
  } = $props();

  let isDragging = $state(false);
  let navTimer: ReturnType<typeof setTimeout> | null = null;
  let activeEdge: "prev" | "next" | null = null;

  const HOUR_HEIGHT = 80;
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
  const MIN_EVENT_HEIGHT = 28;
  const SNAP_MINUTES = 15;
  const NAV_DELAY_MS = 1100;

  const hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  const weekDaysShort: string[] = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  const snapMinutes = (minutes: number) => Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const minutesFromOffsetY = (offsetY: number) => {
    const minutes = Math.floor((offsetY / HOUR_HEIGHT) * 60);
    return Math.max(0, Math.min(23 * 60 + 59, minutes));
  };

  const buildDateAtMinutes = (baseDay: Date, minutes: number) => {
    const d = new Date(baseDay);
    d.setHours(0, 0, 0, 0);
    d.setMinutes(minutes);
    return d;
  };

  const getEventStyle = (event: CalendarEvent, day: Date) => {
    const rawStart = new Date(event.startDate);
    const rawEnd = new Date(event.endDate);

    const { start, end, isVisible } = clampEventToDay(rawStart, rawEnd, day);
    if (!isVisible) return "display:none;";

    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();

    const top = startMinutes * MINUTE_HEIGHT;
    const rawHeight = (endMinutes - startMinutes) * MINUTE_HEIGHT;
    const height = Math.max(rawHeight, MIN_EVENT_HEIGHT);

    return `top:${top}px; height:${height}px; left:6px; right:6px; position:absolute;`;
  };

  const handleEmptyClick = (e: MouseEvent, day: Date) => {
    if (isDragging) return;
    if (!onEmptySlotClick) return;

    const targetEl = e.target as HTMLElement;
    if (targetEl.closest('[data-event-card="true"]')) return;

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;

    const minutes = minutesFromOffsetY(offsetY);
    const start = buildDateAtMinutes(day, minutes);

    onEmptySlotClick(start);
  };

  const handleDayDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  };

  const handleDayDrop = (e: DragEvent, day: Date) => {
    e.preventDefault();

    const raw = e.dataTransfer?.getData("application/x-calendar-event");
    if (!raw) return;

    let payload: { id: string; durationMinutes: number };
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }

    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;

    const rawMinutes = minutesFromOffsetY(offsetY);
    const duration = Math.max(15, payload.durationMinutes);

    const maxStart = Math.max(0, 24 * 60 - duration);

    const snapped = snapMinutes(rawMinutes);
    const startMinutes = clamp(snapped, 0, maxStart);

    const newStart = buildDateAtMinutes(day, startMinutes);
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    onEventDrop?.(payload.id, newStart, newEnd);

    isDragging = false;
  };

  const handleColumnEdgeDrag = (e: DragEvent, index: number) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";

    if (index === 0) {
      startNavTimer("prev");
    } else if (index === days.length - 1) {
      startNavTimer("next");
    } else {
      clearNavTimer();
    }
  };

  const clearNavTimer = () => {
    if (navTimer) {
      clearTimeout(navTimer);
      navTimer = null;
    }
    activeEdge = null;
  };

  const startNavTimer = (dir: "prev" | "next") => {
    if (activeEdge === dir) return;

    clearNavTimer();
    activeEdge = dir;

    navTimer = setTimeout(() => {
      onNavigateWeek?.(dir);
      clearNavTimer();
    }, NAV_DELAY_MS);
  };
</script>

<div class="flex h-full min-h-0 w-full flex-col overflow-hidden bg-base-100">
  <div
    class="grid flex-none grid-cols-[40px_1fr] border-b border-base-300 bg-base-200/20 pr-[15px] md:grid-cols-[60px_1fr] md:pr-4"
  >
    <div class="border-r border-base-300"></div>

    <div class="grid grid-cols-7 divide-x divide-base-300">
      {#each days as d, i}
        <div class="py-3 text-center">
          <span class="text-[11px] font-bold tracking-widest uppercase opacity-50">
            {weekDaysShort[i]}
          </span>
          <div class="mt-1 text-xs font-medium opacity-70">
            {d.getDate().toString().padStart(2, "0")}
          </div>
        </div>
      {/each}
    </div>
  </div>

  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="relative grid min-h-fit grid-cols-[40px_1fr] md:grid-cols-[60px_1fr]">
      <div class="bg-base-50/50 flex-none border-r border-base-200">
        {#each hours as hour}
          <div
            class="h-20 pt-1 pl-2 text-[11px] font-medium opacity-40 md:pr-2 md:pl-0 md:text-right"
          >
            {hour.toString().padStart(2, "0")}:00
          </div>
        {/each}
      </div>

      <div class="relative grid grid-cols-7 divide-x divide-base-300">
        <div class="pointer-events-none absolute inset-0">
          {#each hours as _}
            <div class="h-20 border-b border-base-300"></div>
          {/each}
        </div>

        {#each days as day, i (day.toISOString())}
          {@const key = toDayKey(day)}
          {@const dayEvents = eventsByDay.get(key) ?? []}

          <div
            class="relative h-full min-h-[1920px] cursor-default transition-colors hover:bg-base-200/5"
            role="presentation"
            onclick={(e) => handleEmptyClick(e, day)}
            ondragover={(e) => handleColumnEdgeDrag(e, i)}
            ondragleave={clearNavTimer}
            ondrop={(e) => handleDayDrop(e, day)}
          >
            {#each dayEvents as event (event.id)}
              <div style={getEventStyle(event, day)}>
                <div
                  class="h-full"
                  data-event-card="true"
                  role="presentation"
                  ondragstart={() => {
                    isDragging = true;
                    onDragStateChange?.(true);
                  }}
                  ondragend={() => {
                    isDragging = false;
                    onDragStateChange?.(false);
                  }}
                  onclick={(ev) => {
                    ev.stopPropagation();
                    const el = ev.currentTarget as HTMLElement;
                    const rect = el.getBoundingClientRect();
                    onEventClick?.(event, rect);
                  }}
                >
                  <div class="h-full md:hidden">
                    <EventCard {event} stretch compact />
                  </div>

                  <div class="hidden h-full md:block">
                    <EventCard {event} stretch />
                  </div>
                </div>
              </div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
