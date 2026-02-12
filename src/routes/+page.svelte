<script lang="ts">
	import CalendarGrid from '$lib/components/calendar/CalendarGrid.svelte';
	import Sidebar from '$lib/components/calendar/Sidebar.svelte';
	import { HamburgerIcon, SearchIcon } from '$lib/components/icons';

	let isSidebarOpen: boolean = true;
</script>

<!-- ISSO define o título na aba do navegador -->
<svelte:head>
	<title>Agenda</title>
</svelte:head>

<div class="h-screen flex flex-col bg-base-200 overflow-hidden">
	<!-- Header Superior Global -->
	<header class="flex items-center justify-between gap-4 px-4 py-3 bg-base-100 border-b border-base-300">
		
		<!-- left: hamburger + brand -->
		<div class="flex items-center gap-3">
			<button
				class="btn btn-ghost btn-circle btn-sm"
				onclick={() => isSidebarOpen = !isSidebarOpen}
				aria-label="Alternar menu"
				type="button"
			>
				<HamburgerIcon size={20} />
			</button>
	  
			<div class="flex items-center gap-2 ml-1">
				<span class="text-xl font-normal text-base-content opacity-80">Agenda</span>
			</div>
		</div>
	  
		<!-- right: search -->
		<div class="flex items-center gap-3">
			<label for="global-search" class="sr-only">Pesquisar</label>
	  
			<div class="relative flex items-center">
				<!-- Container do ícone com posicionamento forçado -->
				<div class="absolute left-4 z-10 pointer-events-none flex items-center justify-center text-base-content/50">
					<SearchIcon size={20} />
				</div>
				
				<input
					id="global-search"
					type="search"
					placeholder="Pesquisar eventos"
					class="input input-bordered pl-12 pr-4 h-11 rounded-full w-[min(560px,90vw)] max-w-[560px] bg-base-100 border-base-300 focus:border-primary transition-all"
				/>
			</div>
		</div>
	</header>

	<div class="flex flex-1 overflow-hidden">
		{#if isSidebarOpen}
			<div class="h-full border-r border-base-300">
				<Sidebar />
			</div>
		{/if}

		<main class="flex-1 flex flex-col min-h-0 p-4 md:p-6 overflow-hidden pb-5 box-border">
			<CalendarGrid />
		</main>
	</div>
</div>
