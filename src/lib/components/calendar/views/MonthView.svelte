<script lang="ts">
  import EventCard from "$lib/components/calendar/EventCard.svelte";
  import type { CalendarEvent } from "$lib/types/calendar";
  import { getMonthGridDates, toDayKey } from "$lib/utils/dateUtils";

  let {
    currentDate,
    eventsByDay,
    onEmptySlotClick,
    onEventClick,
    onEventDrop
  }: {
    currentDate: Date;
    eventsByDay: Map<string, CalendarEvent[]>;
    onEmptySlotClick?: (start: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
    onEventDrop?: (id: string, start: Date, end: Date) => void;
  } = $props();

  const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  const gridDates = $derived.by(() => getMonthGridDates(currentDate));

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
  };

  const shiftDateByDays = (iso: string, diffDays: number) => {
    const d = new Date(iso);
    d.setDate(d.getDate() + diffDays);
    return d;
  };

  const handleDropOnDay = (e: DragEvent, targetDay: Date) => {
    e.preventDefault();

    const raw = e.dataTransfer?.getData("application/x-calendar-event");
    if (!raw) return;

    let payload: { id: string };
    try {
      payload = JSON.parse(raw);
    } catch {
      return;
    }

    const allEvents = Array.from(eventsByDay.values()).flat();
    const ev = allEvents.find((x) => x.id === payload.id);
    if (!ev) return;

    const oldStart = new Date(ev.startDate);
    const oldEnd = new Date(ev.endDate);

    const diffDays =
      targetDay.getFullYear() === oldStart.getFullYear() &&
      targetDay.getMonth() === oldStart.getMonth() &&
      targetDay.getDate() === oldStart.getDate()
        ? 0
        : (() => {
            const a = new Date(oldStart);
            a.setHours(0, 0, 0, 0);
            const b = new Date(targetDay);
            b.setHours(0, 0, 0, 0);
            return Math.round((b.getTime() - a.getTime()) / 86400000);
          })();

    if (diffDays === 0) return;

    const newStart = shiftDateByDays(ev.startDate, diffDays);
    const newEnd = shiftDateByDays(ev.endDate, diffDays);

    onEventDrop?.(payload.id, newStart, newEnd);
  };
</script>

<div class="flex h-full min-h-0 w-full flex-col">
  <div class="grid flex-none grid-cols-7 border-b border-base-300 bg-base-200/30 py-3">
    {#each weekDays as day}
      <div class="py-2 text-center text-[10px] font-bold tracking-widest uppercase opacity-50">
        {day}
      </div>
    {/each}
  </div>

  <div class="grid h-full flex-1 grid-cols-7 grid-rows-5 divide-x divide-y divide-base-200">
    {#each gridDates as day}
      <div
        role="gridcell"
        tabindex="0"
        aria-label={day
          ? day.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
          : undefined}
        class="group flex min-h-0 cursor-default flex-col bg-base-100 p-2 transition-colors hover:bg-base-200/30"
        ondragover={handleDragOver}
        ondrop={(e) => day && handleDropOnDay(e, day)}
      >
        {#if day}
          {@const key = toDayKey(day)}
          {@const dayEvents = eventsByDay.get(key) ?? []}

          <span
            class="flex h-7 w-7 items-center justify-center self-center rounded-full text-xs font-medium opacity-70 transition-colors group-hover:opacity-100"
          >
            {day.getDate()}
          </span>

          {#if dayEvents.length > 0}
            <div class="mt-2 flex items-center justify-center gap-1 md:hidden">
              {#each dayEvents.slice(0, 3) as event (event.id)}
                <span class="h-1.5 w-1.5 rounded-full" style={`background-color:${event.color};`}
                ></span>
              {/each}

              {#if dayEvents.length > 3}
                <span class="text-[10px] opacity-60">+{dayEvents.length - 3}</span>
              {/if}
            </div>
          {/if}

          <div class="mt-2 hidden flex-1 space-y-1 overflow-hidden md:block">
            {#each dayEvents.slice(0, 2) as event (event.id)}
              <EventCard {event} />
            {/each}

            {#if dayEvents.length > 2}
              <div class="pl-1 text-[10px] opacity-60">+{dayEvents.length - 2} mais</div>
            {/if}
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>
