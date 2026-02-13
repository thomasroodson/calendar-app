<script lang="ts">
  import type { CalendarEvent } from "$lib/types/calendar";

  let {
    event,
    stretch = false,
    compact = false
  }: { event: CalendarEvent; stretch?: boolean; compact?: boolean } = $props();

  const startTime = $derived.by(() =>
    new Date(event.startDate).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit"
    })
  );
</script>

<div
  class={`group relative flex flex-col overflow-hidden rounded-md border-l-4 shadow-sm ${
    compact ? "p-1 text-[10px] leading-tight" : "p-2 text-[11px] leading-tight"
  } ${stretch ? "h-full" : "mb-2"}`}
  style="background-color: {event.color}15; border-color: {event.color}; color: {event.color};"
  draggable="true"
>
  {#if compact}
    <span class="block truncate font-bold">{startTime}</span>
  {:else}
    <span class="block truncate font-bold">{event.title}</span>
    <span class="opacity-70">{startTime}</span>
  {/if}

  {#if event.description}
    <div class="absolute top-1 right-1 h-1 w-1 rounded-full bg-current opacity-50"></div>
  {/if}
</div>

<style>
  :global(.dragging) {
    opacity: 0.5;
  }
</style>
