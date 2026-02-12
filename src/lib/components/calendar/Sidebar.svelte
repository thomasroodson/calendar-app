<script lang="ts">
	import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from '$lib/components/icons';
	// Por enquanto, apenas design estático
	const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
	const days = Array.from({ length: 31 }, (_, i) => i + 1);
</script>

<aside class="w-64 flex flex-col gap-8 p-4 bg-base-200/50 h-full transition-all duration-300">
	<!-- Botão Criar Estilo Google -->
		<div 
            role="button"
            tabindex="0" 
            class="btn btn-lg bg-base-100 hover:bg-base-200 shadow-md border-none rounded-2xl px-6 normal-case flex group"
        >
			<PlusIcon size={15} color="currentColor" class="transition-transform group-hover:scale-110" />
			<span class="text-base font-normal uppercase">Criar</span>
		</div>


	<!-- Mini Calendário -->
	<div class="px-2">
		<div class="flex items-center justify-between mb-4">
			<span class="text-sm font-medium px-2">Março de 2026</span>
			<div class="flex gap-1">
				<button class="btn btn-ghost btn-xs btn-circle"><ChevronLeftIcon size={16} color="currentColor" /></button>
				<button class="btn btn-ghost btn-xs btn-circle"><ChevronRightIcon size={16} color="currentColor" /></button>
			</div>
		</div>
		<div class="grid grid-cols-7 gap-y-1 text-center">
			{#each weekDays as day}
				<span class="text-[10px] font-bold opacity-40">{day}</span>
			{/each}
			{#each days as day}
				<button class="text-[11px] w-8 h-8 flex items-center justify-center rounded-full hover:bg-base-300 transition-colors {day === 1 ? 'bg-primary text-primary-content' : ''}">
					{day}
				</button>
			{/each}
		</div>
	</div>

</aside>