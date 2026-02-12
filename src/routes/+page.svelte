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
    class="flex items-center justify-between gap-4 border-b border-base-300 bg-base-100 px-4 py-3"
  >
    <!-- left: hamburger + brand -->
    <div class="flex items-center gap-3">
      <button
        class="btn btn-circle btn-ghost btn-sm"
        onclick={() => (isSidebarOpen = !isSidebarOpen)}
        aria-label="Alternar menu"
        type="button"
      >
        <HamburgerIcon size={20} />
      </button>

      <div class="ml-1 flex items-center gap-2">
        <span class="text-xl font-normal text-base-content opacity-80">Agenda</span>
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
          class="input-bordered input h-11 w-[min(560px,90vw)] max-w-[560px] rounded-full border-base-300 bg-base-100 pr-4 pl-12 transition-all focus:border-primary"
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

    <main class="box-border flex min-h-0 flex-1 flex-col overflow-hidden p-4 pb-5 md:p-6">
      <CalendarGrid />
    </main>
  </div>
</div>

<EventModal isOpen={false} />
