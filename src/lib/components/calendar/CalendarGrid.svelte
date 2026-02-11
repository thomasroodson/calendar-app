<script lang="ts">
    import { calendarStore } from '$lib/stores/calendar.svelte';
    import { getWeekDays, formatDayHeader, filterEventsByDate } from '$lib/utils/dateUtils';
    import EventCard from './EventCard.svelte';

    const weekDays = $derived(getWeekDays(calendarStore.currentDate));
    const today = new Date().toDateString();
</script>

<div class="flex flex-col h-full w-full bg-base-100 border border-base-200 rounded-xl overflow-hidden shadow-sm">
    
    <!-- Cabeçalho -->
    <div class="grid grid-cols-7 border-b border-base-200 bg-base-200/30">
        {#each weekDays as day}
            <div class="py-3 flex flex-col items-center border-r border-base-200 last:border-r-0">
                <span class="text-[11px] font-bold tracking-wider uppercase text-base-content/50">
                    {formatDayHeader(day).split(' ')[0]}
                </span>
                <div class="mt-1">
                    <span class="text-lg font-medium w-9 h-9 flex items-center justify-center rounded-full transition-all
                        {day.toDateString() === today 
                            ? 'bg-primary text-primary-content shadow-md' 
                            : 'hover:bg-base-200 text-base-content'}">
                        {day.getDate()}
                    </span>
                </div>
            </div>
        {/each}
    </div>

    <!-- Corpo (Apenas UM grid e UM loop) -->
    <div class="grid grid-cols-7 flex-1 divide-x divide-base-200 overflow-y-auto scrollbar-hide">
        {#each weekDays as day}
            <div class="min-h-[500px] p-2 bg-transparent hover:bg-base-200/5 transition-colors duration-300">
                {#each filterEventsByDate(calendarStore.events, day) as event (event.id)}
                    <EventCard {event} />
                {/each}
            </div>
        {/each}
    </div>
</div>

<style>
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>