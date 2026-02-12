<script lang="ts">
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import DayView from './views/DayView.svelte';
	import WeekView from './views/WeekView.svelte';
	import MonthView from './views/MonthView.svelte';
	import { ChevronLeftIcon, ChevronRightIcon } from '$lib/components/icons';

	let view = $state('month'); 
</script>

<!-- Header fixo -->
<header class="calendar-header flex items-center justify-between bg-base-100 px-6 py-4 rounded-2xl border border-base-200 shadow-sm mb-6">
	<div class="flex items-center gap-4">
		<div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-content font-semibold text-lg shadow-sm ml-2">
			12
		</div>
		<h2 class="text-xl font-normal">Março de 2026</h2>
		<button class="btn btn-ghost btn-sm border border-base-300 px-4 ml-2">Hoje</button>
	</div>

	<div class="flex items-center gap-4">
		<select bind:value={view} class="select select-sm select-bordered font-medium no-opacity-fix">
			<option value="day">Dia</option>
			<option value="week">Semana</option>
			<option value="month">Mês</option>
		</select>
		<div class="join border border-base-200">
			<button class="btn btn-ghost btn-sm join-item"><ChevronLeftIcon size={16} /></button>
			<button class="btn btn-ghost btn-sm join-item"><ChevronRightIcon size={16} /></button>
		</div>
		<ThemeToggle />
	</div>
</header>

<!-- Container das Views -->
<div class="h-full bg-base-100 border border-base-200 rounded-xl shadow-sm overflow-hidden">
    {#if view === 'day'}
        <DayView />
    {:else if view === 'week'}
        <WeekView />
    {:else}
        <MonthView />
    {/if}
</div>