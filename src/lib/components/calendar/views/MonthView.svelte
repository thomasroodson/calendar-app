<script lang="ts">
  import type { CalendarEvent } from "$lib/types/calendar";
  import EventCard from "$lib/components/calendar/EventCard.svelte";
  import { getMonthGridDates, toDayKey } from "$lib/utils/dateUtils";

  let {
    currentDate,
    eventsByDay
  }: {
    currentDate: Date;
    eventsByDay: Map<string, CalendarEvent[]>;
  } = $props();

  const weekDays = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  const gridDates = $derived.by(() => getMonthGridDates(currentDate));
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
        class="group flex min-h-0 cursor-pointer flex-col bg-base-100 p-2 transition-colors hover:bg-base-200/30"
      >
        {#if day}
          {@const key = toDayKey(day)}
          {@const dayEvents = eventsByDay.get(key) ?? []}

          <span
            class="flex h-7 w-7 items-center justify-center self-center rounded-full text-xs font-medium opacity-70 transition-colors group-hover:opacity-100"
          >
            {day.getDate()}
          </span>

          <!-- MVP: eventos em lista (limitado) -->
          <div class="mt-2 flex-1 space-y-1 overflow-hidden">
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
