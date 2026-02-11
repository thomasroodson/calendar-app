<script lang="ts">
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import CalendarGrid from '$lib/components/calendar/CalendarGrid.svelte';
    import { calendarStore } from '$lib/stores/calendar.svelte';
	import { formatMonthYear } from '$lib/utils/dateUtils';

    const title = $derived(formatMonthYear(calendarStore.currentDate));
</script>

<svelte:head>
	<title>Calendário App</title>
	<meta name="description" content="Calendário App" />
</svelte:head>

<main class="p-4 md:p-8 max-w-7xl mx-auto h-screen flex flex-col gap-6">
    <!-- Cabeçalho Superior -->
    <header class="flex items-center justify-between bg-base-100 px-6 py-4 rounded-2xl border border-base-200 shadow-sm">
    <div class="flex items-center gap-6">
        <h1 class="text-2xl font-semibold tracking-tight text-base-content">
            {title}
        </h1>
        <button class="btn btn-ghost btn-sm border-base-300 hover:border-primary normal-case font-medium">
            Hoje
        </button>
    </div>
    
    <div class="flex items-center gap-2">
        <div class="join border border-base-200">
            <button class="btn btn-ghost btn-sm join-item">❮</button>
            <button class="btn btn-ghost btn-sm join-item">❯</button>
        </div>
		<ThemeToggle />        
    </div>
</header>

    <!-- O Grid do Calendário -->
    <section class="flex-1 overflow-hidden">
        <CalendarGrid />
    </section>
</main>