<script lang="ts">
	// Geramos as 24 horas do dia
	const hours: number[] = Array.from({ length: 24 }, (_, i) => i);
	
	// Dias da semana para o cabeçalho
	const weekDays: string[] = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
	
	// Array fixo para as 7 colunas
	const columns: number[] = Array.from({ length: 7 }, (_, i) => i);
</script>

<div class="flex flex-col h-full w-full overflow-hidden bg-base-100 min-h-0">
	<!-- Cabeçalho dos Dias (Fixo no topo) -->
	<div class="grid grid-cols-[60px_1fr] border-b border-base-300 bg-base-200/20 flex-none pr-4">
		<div class="border-r border-base-300"></div>
		<div class="grid grid-cols-7 divide-x divide-base-300">
			{#each weekDays as day}
				<div class="py-3 text-center">
					<span class="text-[11px] font-bold opacity-50 uppercase tracking-widest">{day}</span>
				</div>
			{/each}
		</div>
	</div>

	<!-- Área de Scroll (Ocupa o resto da altura) -->
	<div class="flex-1 overflow-y-auto min-h-0">
		<div class="grid grid-cols-[60px_1fr] relative min-h-fit">
			
			<!-- Coluna Lateral de Horas -->
			<div class="bg-base-50/50 border-r border-base-200 flex-none">
				{#each hours as hour}
					<div class="h-20 pr-2 text-[11px] text-right opacity-40 font-medium pt-1">
						{hour.toString().padStart(2, '0')}:00
					</div>
				{/each}
			</div>

			<!-- Grid de Conteúdo (7 Colunas) -->
			<div class="grid grid-cols-7 divide-x divide-base-200 relative">
				<!-- Linhas Horizontais de Fundo (Google Style) -->
				<div class="absolute inset-0 pointer-events-none">
					{#each hours as _}
						<div class="h-20 border-b border-base-200/40"></div>
					{/each}
				</div>

				<!-- Colunas Interativas -->
				{#each columns as _}
					<div 
						class="h-full min-h-[1920px] hover:bg-base-200/5 transition-colors cursor-cell relative"
						role="presentation"
					>
						<!-- Aqui entrarão os EventCards posicionados absolutamente -->
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>