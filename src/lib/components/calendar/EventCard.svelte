<script lang="ts">
	import type { CalendarEvent } from '$lib/types/calendar';

	// Recebemos o evento como propriedade (Svelte 5 syntax)
	let { event }: { event: CalendarEvent } = $props();

	// Formata o horário para exibição (ex: 09:00)
	const startTime = new Date(event.startDate).toLocaleTimeString('pt-BR', {
		hour: '2-digit',
		minute: '2-digit'
	});
</script>

<div
	class="group relative mb-2 flex flex-col rounded-md p-2 text-[11px] leading-tight shadow-sm border-l-4"
	style="background-color: {event.color}15; border-color: {event.color}; color: {event.color};"
    draggable="true"
>
	<span class="font-bold truncate block">{event.title}</span>
	<span class="opacity-70">{startTime}</span>

    {#if event.description}
        <div class="absolute top-1 right-1 w-1 h-1 rounded-full bg-current opacity-50"></div>
    {/if}
</div>


<style>
    /* Estilo para quando o card está sendo arrastado */
    :global(.dragging) {
        opacity: 0.5;
    }
</style>