<script lang="ts">
  import type { CalendarEvent } from "$lib/types/calendar";
  import EventCard from "$lib/components/calendar/EventCard.svelte";
  import { toDayKey, clampEventToDay } from "$lib/utils/dateUtils";

  let { days, eventsByDay }: { days: Date[]; eventsByDay: Map<string, CalendarEvent[]> } = $props();

  const hours: number[] = Array.from({ length: 24 }, (_, i) => i);
  const weekDaysShort: string[] = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  const HOUR_HEIGHT = 80;
  const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
  const MIN_EVENT_HEIGHT = 28;

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
</script>

<div class="flex h-full min-h-0 w-full flex-col overflow-hidden bg-base-100">
  <!-- Cabeçalho dos Dias -->
  <div class="grid flex-none grid-cols-[60px_1fr] border-b border-base-300 bg-base-200/20 md:pr-4">
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

  <!-- Área de Scroll -->
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="relative grid min-h-fit grid-cols-[60px_1fr]">
      <!-- Coluna de Horas -->
      <div class="bg-base-50/50 flex-none border-r border-base-200">
        {#each hours as hour}
          <div class="h-20 pt-1 pr-2 text-right text-[11px] font-medium opacity-40">
            {hour.toString().padStart(2, "0")}:00
          </div>
        {/each}
      </div>

      <!-- Grid 7 colunas -->
      <div class="relative grid grid-cols-7 divide-x divide-base-200">
        <!-- Linhas horizontais -->
        <div class="pointer-events-none absolute inset-0">
          {#each hours as _}
            <div class="h-20 border-b border-base-200/40"></div>
          {/each}
        </div>

        {#each days as day (day.toISOString())}
          {@const key = toDayKey(day)}
          {@const dayEvents = eventsByDay.get(key) ?? []}

          <div
            class="relative h-full min-h-[1920px] cursor-cell transition-colors hover:bg-base-200/5"
          >
            {#each dayEvents as event (event.id)}
              <div style={getEventStyle(event, day)}>
                <!-- MOBILE: compacto (evita esmagar título e ficar "E..") -->
                <div class="md:hidden">
                  <EventCard {event} stretch compact />
                </div>

                <!-- DESKTOP -->
                <div class="hidden md:block">
                  <EventCard {event} stretch />
                </div>
              </div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>
