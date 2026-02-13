<script lang="ts">
  import CalendarGrid from "$lib/components/calendar/CalendarGrid.svelte";
  import Sidebar from "$lib/components/calendar/Sidebar.svelte";
  import { HamburgerIcon, SearchIcon } from "$lib/components/icons";
  import EventModal from "$lib/components/modals/EventModal.svelte";

  let isSidebarOpen: boolean = true;
</script>

<!-- ISSO define o título na aba do navegador -->
<svelte:head>
  <title>Agenda</title>
</svelte:head>

<div class="flex h-screen flex-col overflow-hidden bg-base-200">
  <!-- Header Superior Global -->
  <header
    class="flex items-center gap-4 border-b border-base-300 bg-base-100 px-4 py-3 md:justify-between"
  >
    <!-- left: hamburger + brand -->
    <div class="flex items-center gap-3">
      <button
        class="btn hidden btn-circle btn-ghost btn-sm md:block"
        onclick={() => (isSidebarOpen = !isSidebarOpen)}
        aria-label="Alternar menu"
        type="button"
      >
        <HamburgerIcon size={20} />
      </button>

      <div class="ml-1 flex items-center gap-2">
        <span class="text-xl font-normal text-base-content opacity-80">AGENDA</span>
      </div>
    </div>

    <!-- right: search -->
    <div class="flex items-center gap-3">
      <label for="global-search" class="sr-only">Pesquisar</label>

      <div class="relative flex items-center">
        <!-- Container do ícone com posicionamento forçado -->
        <div
          class="pointer-events-none absolute left-4 z-10 flex items-center justify-center text-base-content/50"
        >
          <SearchIcon size={20} />
        </div>

        <input
          id="global-search"
          type="search"
          placeholder="Pesquisar eventos"
          class="input-bordered input h-11 max-w-[560px] min-w-[290px] rounded-full border-base-300 bg-base-100 pr-4 pl-12 transition-all focus:border-primary md:w-[min(560px,90vw)]"
        />
      </div>
    </div>
  </header>

  <div class="flex flex-1 flex-col overflow-hidden md:flex-row">
    {#if isSidebarOpen}
      <div class="border-r border-base-300 md:h-full">
        <Sidebar />
      </div>
    {/if}

    <main class="md: box-border flex min-h-0 flex-1 flex-col overflow-hidden p-4 pt-0 pb-6 md:p-6">
      <CalendarGrid />
    </main>
  </div>
</div>

<EventModal isOpen={false} />
