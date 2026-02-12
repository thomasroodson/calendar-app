<script lang="ts">
	const year = 2026;
	const month = 2; 
	let daysInMonth = new Date(year, month + 1, 0).getDate();
	let firstDayOfWeek = new Date(year, month, 1).getDay();

	let calendarCells = $derived.by(() => {
		return Array.from({ length: 35 }, (_, i) => {
			const dayNumber = i - firstDayOfWeek + 1;
			return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
		});
	});

	const weekDays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
</script>

<div class="flex flex-col h-full w-full min-h-0">
	<div class="grid grid-cols-7 border-b border-base-300 bg-base-200/30 flex-none py-3">
	  {#each weekDays as day}
		<div class="py-2 text-center text-[10px] font-bold opacity-50 uppercase tracking-widest">{day}</div>
	  {/each}
	</div>
  
	<!-- h-full e grid-rows-5 garantem que ocupe tudo -->
	<div class="grid grid-cols-7 grid-rows-5 flex-1 h-full divide-x divide-y divide-base-200">
	  {#each calendarCells as day}
		<div class="p-2 bg-base-100 hover:bg-base-200/30 transition-colors cursor-pointer group flex flex-col min-h-0">
		  {#if day}
			<span class="text-xs font-medium opacity-70 group-hover:opacity-100 self-center w-7 h-7 flex items-center justify-center rounded-full transition-colors {day === 12 ? 'bg-primary text-primary-content opacity-100' : ''}">
			  {day}
			</span>
			<div class="flex-1 mt-1 overflow-hidden"></div>
		  {/if}
		</div>
	  {/each}
	</div>
</div>