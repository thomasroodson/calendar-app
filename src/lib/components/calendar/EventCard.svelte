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

  const durationMinutes = $derived.by(() => {
    const start = new Date(event.startDate).getTime();
    const end = new Date(event.endDate).getTime();
    return Math.max(15, Math.round((end - start) / 60000));
  });

  const handleDragStart = (e: DragEvent) => {
    const dt = e.dataTransfer;
    if (!dt) return;

    const payload = JSON.stringify({
      id: event.id,
      durationMinutes
    });

    dt.setData("application/x-calendar-event", payload);
    dt.setData("text/plain", event.id);
    dt.effectAllowed = "move";

    (e.currentTarget as HTMLElement).classList.add("dragging");
  };

  const handleDragEnd = (e: DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove("dragging");
  };
</script>

<div
  role="button"
  tabindex="0"
  data-testid="event-card"
  data-event-id={event.id}
  class={`group relative flex flex-col overflow-hidden rounded-md border-l-4 shadow-sm ${
    compact ? "p-1 text-[10px] leading-tight" : "p-2 text-[11px] leading-tight"
  } ${stretch ? "h-full" : "mb-2"}`}
  style="background-color: {event.color}15; border-color: {event.color}; color: {event.color};"
  draggable="true"
  ondragstart={handleDragStart}
  ondragend={handleDragEnd}
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
