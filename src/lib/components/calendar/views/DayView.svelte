<script lang="ts">
  import type { CalendarEvent } from "$lib/types/calendar";
  import EventCard from "$lib/components/calendar/EventCard.svelte";
  import { clampEventToDay } from "$lib/utils/dateUtils";

  let { date, events }: { date: Date; events: CalendarEvent[] } = $props();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const HOUR_HEIGHT = 80;
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
  const MIN_EVENT_HEIGHT = 28;

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
      >
        {#each events as event (event.id)}
          <div style={getEventStyle(event)}>
            <EventCard {event} stretch />
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
