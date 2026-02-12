<script lang="ts">
    const hours = Array.from({ length: 24 }, (_, i) => i);
  </script>
  
  <div class="flex flex-col h-full overflow-hidden min-h-0">
    <!-- Cabeçalho do dia -->
    <div class="grid grid-cols-[60px_1fr] border-b border-base-300">
      <div class="border-r border-base-300"></div>
      <div class="p-2 text-center font-semibold text-base-content/70">Dia Único</div>
    </div>
  
    <!-- Conteúdo com scroll -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <div class="grid grid-cols-[60px_1fr] relative min-h-0">
        <!-- Coluna de horas -->
        <div class="divide-y divide-transparent border-r border-base-300">
          {#each hours as hour}
            <div class="h-20 pr-2 text-[11px] text-right opacity-50 font-medium pt-1">
              {hour.toString().padStart(2, '0')}:00
            </div>
          {/each}
        </div>
  
        <!-- Área para eventos -->
        <div class="relative p-2 border-l border-base-300 min-h-[1920px] hover:bg-base-200/10 transition-colors">
          <!-- Eventos vão aqui -->
        </div>
      </div>
    </div>
  </div>