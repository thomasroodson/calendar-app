<script lang="ts">
  import { PlusIcon, ChevronLeftIcon, ChevronRightIcon } from "$lib/components/icons";
  // Por enquanto, apenas design estático
  const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
</script>

<aside class="flex h-full w-64 flex-col gap-8 bg-base-200/50 p-4 transition-all duration-300">
  <!-- Botão Criar Estilo Google -->
  <div
    role="button"
    tabindex="0"
    class="group btn flex rounded-2xl border-none bg-base-100 px-6 normal-case shadow-md btn-lg hover:bg-base-200"
  >
    <PlusIcon size={15} color="currentColor" class="transition-transform group-hover:scale-110" />
    <span class="text-base font-normal uppercase">Criar</span>
  </div>

  <!-- Mini Calendário -->
  <div class="px-2">
    <div class="mb-4 flex items-center justify-between">
      <span class="px-2 text-sm font-medium">Março de 2026</span>
      <div class="flex gap-1">
        <button class="btn btn-circle btn-ghost btn-xs"
          ><ChevronLeftIcon size={16} color="currentColor" /></button
        >
        <button class="btn btn-circle btn-ghost btn-xs"
          ><ChevronRightIcon size={16} color="currentColor" /></button
        >
      </div>
    </div>
    <div class="grid grid-cols-7 gap-y-1 text-center">
      {#each weekDays as day}
        <span class="text-[10px] font-bold opacity-40">{day}</span>
      {/each}
      {#each days as day}
        <button
          class="flex h-8 w-8 items-center justify-center rounded-full text-[11px] transition-colors hover:bg-base-300 {day ===
          1
            ? 'bg-primary text-primary-content'
            : ''}"
        >
          {day}
        </button>
      {/each}
    </div>
  </div>
</aside>
