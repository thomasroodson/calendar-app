<script lang="ts">
  import type { CalendarEvent } from "$lib/types/calendar";
  import EventCard from "$lib/components/calendar/EventCard.svelte";
  import { clampEventToDay } from "$lib/utils/dateUtils";
  import { updateEventDates } from "$lib/stores/calendar.svelte";

  let {
    date,
    events,
    onEmptySlotClick,
    onEventClick,
    onEventDrop
  }: {
    date: Date;
    events: CalendarEvent[];
    onEmptySlotClick?: (start: Date) => void;
    onEventClick?: (event: CalendarEvent, rect?: DOMRect) => void;
    onEventDrop?: (id: string, start: Date, end: Date) => void;
  } = $props();

  let isDragging = $state(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const HOUR_HEIGHT = 80;
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
  const MIN_EVENT_HEIGHT = 28;
  const SNAP_MINUTES = 15;

  const snapMinutes = (minutes: number) => Math.round(minutes / SNAP_MINUTES) * SNAP_MINUTES;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const getEventStyle = (event: CalendarEvent) => {
    const rawStart = new Date(event.startDate);
    const rawEnd = new Date(event.endDate);

    const { start, end, isVisible } = clampEventToDay(rawStart, rawEnd, date);
    if (!isVisible) return "display:none;";

    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();

    const top = startMinutes * MINUTE_HEIGHT;
    const rawHeight = (endMinutes - startMinutes) * MINUTE_HEIGHT;
    const height = Math.max(rawHeight, MIN_EVENT_HEIGHT);

    return `top:${top}px; height:${height}px; position:absolute; left:8px; right:8px;`;
  };
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

  const isInsideAnyEvent = (clicked: Date) => {
    const clickedMs = clicked.getTime();

    return events.some((event) => {
      const rawStart = new Date(event.startDate);
      const rawEnd = new Date(event.endDate);

      const { start, end, isVisible } = clampEventToDay(rawStart, rawEnd, date);
      if (!isVisible) return false;

      return clickedMs >= start.getTime() && clickedMs < end.getTime();
    });
  };

  const handleEmptyClick = (e: MouseEvent) => {
    if (isDragging) return;
    if (!onEmptySlotClick) return;

    const targetEl = e.target as HTMLElement;
    if (targetEl.closest('[data-event-card="true"]')) return;

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;

    const minutes = minutesFromOffsetY(offsetY);
    const start = buildDateAtMinutes(date, minutes);

    onEmptySlotClick(start);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();

    const raw = e.dataTransfer?.getData("application/x-calendar-event");
    if (!raw) return;

    let payload: { id: string; durationMinutes: number };
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }

    const container = e.currentTarget as HTMLElement;
    const rect = container.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;

    const rawMinutes = minutesFromOffsetY(offsetY);
    const duration = Math.max(15, payload.durationMinutes);

    const maxStart = Math.max(0, 24 * 60 - duration);

    const snapped = snapMinutes(rawMinutes);
    const startMinutes = clamp(snapped, 0, maxStart);

    const newStart = buildDateAtMinutes(date, startMinutes);
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    onEventDrop?.(payload.id, newStart, newEnd);

    isDragging = false;
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  };
</script>

<div class="flex h-full min-h-0 flex-col overflow-hidden">
  <!-- Cabeçalho do dia -->
  <div class="grid grid-cols-[60px_1fr] border-b border-base-300">
    <div class="border-r border-base-300"></div>
    <div class="p-2 text-center font-semibold text-base-content/70">
      {date.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}
    </div>
  </div>

  <!-- Conteúdo com scroll -->
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="relative grid min-h-0 grid-cols-[60px_1fr]">
      <!-- Coluna de horas -->
      <div class="divide-y divide-transparent border-r border-base-300">
        {#each hours as hour}
          <div class="h-20 pt-1 pr-2 text-right text-[11px] font-medium opacity-50">
            {hour.toString().padStart(2, "0")}:00
          </div>
        {/each}
      </div>

      <!-- Área para eventos (MVP: lista no topo) -->
      <div
        class="relative min-h-[1920px] border-l border-base-300 p-2 transition-colors hover:bg-base-200/10"
        role="presentation"
        onclick={handleEmptyClick}
        ondragover={handleDragOver}
        ondrop={handleDrop}
      >
        <!-- ✅ Linhas horizontais (fundo) -->
        <div class="pointer-events-none absolute inset-0">
          {#each hours as _}
            <div class="h-20 border-b border-base-300"></div>
          {/each}
        </div>

        <!-- Eventos -->
        {#each events as event (event.id)}
          <div style={getEventStyle(event)}>
            <div
              class="h-full"
              data-event-card="true"
              role="presentation"
              ondragstart={() => (isDragging = true)}
              ondragend={() => (isDragging = false)}
              onclick={(ev) => {
                ev.stopPropagation();

                const el = ev.currentTarget as HTMLElement;
                const rect = el.getBoundingClientRect();

                onEventClick?.(event, rect);
              }}
            >
              <EventCard {event} stretch />
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
