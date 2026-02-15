<script lang="ts">
  import CalendarGrid from "$lib/components/calendar/CalendarGrid.svelte";
  import Sidebar from "$lib/components/calendar/Sidebar.svelte";
  import EventPopover from "$lib/components/calendar/EventPopover.svelte";
  import { HamburgerIcon, SearchIcon } from "$lib/components/icons";
  import EventModal from "$lib/components/modals/EventModal.svelte";
  import type { CalendarEvent } from "$lib/types/calendar";

  let isSidebarOpen = $state(true);

  // --- Modal controller (SINGLE SOURCE OF TRUTH) ---
  let isModalOpen = $state(false);
  let modalMode = $state<"create" | "edit">("create");
  let selectedEvent = $state<CalendarEvent | null>(null);

  // Prefill para create (clicou no grid)
  let initialStart = $state<Date | null>(null);
  let initialEnd = $state<Date | null>(null);

  let isPopoverOpen = $state(false);
  let anchorRect = $state<DOMRect | null>(null);

  const closeModal = () => {
    isModalOpen = false;
    selectedEvent = null;
    initialStart = null;
    initialEnd = null;
  };

  const openCreate = (start?: Date) => {
    modalMode = "create";
    selectedEvent = null;
    closePopover();

    if (start) {
      initialStart = start;
      initialEnd = new Date(start.getTime() + 30 * 60 * 1000); // +30min
    } else {
      initialStart = null;
      initialEnd = null;
    }

    isModalOpen = true;
  };

  const openEdit = (event: CalendarEvent) => {
    modalMode = "edit";
    selectedEvent = event;
    initialStart = null;
    initialEnd = null;
    isModalOpen = true;
  };

  type ViewMode = "day" | "week" | "month";
  let view = $state<ViewMode>("week");

  const handleSelectDay = () => {
    view = "day";
  };

  const openPopover = (event: CalendarEvent, rect?: DOMRect) => {
    selectedEvent = event;
    anchorRect = rect ?? null;
    isPopoverOpen = true;
  };

  const closePopover = () => {
    isPopoverOpen = false;
    selectedEvent = null;
    anchorRect = null;
  };
</script>

<svelte:head>
  <title>Agenda</title>
</svelte:head>

<div class="flex h-screen flex-col overflow-hidden bg-base-200">
  <header
    class="flex items-center justify-between gap-4 border-b border-base-300 bg-base-100 px-4 py-3"
  >
    <div class="flex items-center gap-3">
      <button
        class="btn hidden btn-circle btn-ghost btn-sm md:inline-flex"
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

    <div class="flex items-center gap-3">
      <label for="global-search" class="sr-only">Pesquisar</label>

      <div class="relative flex items-center">
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
      <div class="h-auto border-base-300 md:h-full md:border-r">
        <!-- ✅ Sidebar emite ação -->
        <Sidebar onCreate={() => openCreate()} onSelectDay={handleSelectDay} />
      </div>
    {/if}

    <main class="box-border flex min-h-0 flex-1 flex-col overflow-hidden p-4 pb-5 md:p-6">
      <!-- ✅ Grid emite ações -->
      <CalendarGrid
        onEmptySlotClick={(start: Date) => openCreate(start)}
        onEventClick={(event: CalendarEvent, rect?: DOMRect) => openPopover(event, rect)}
        bind:view
      />
    </main>
  </div>
</div>

<EventPopover isOpen={isPopoverOpen} event={selectedEvent} {anchorRect} onClose={closePopover} />

<!-- ✅ Modal controlado pela page -->
<EventModal
  isOpen={isModalOpen}
  mode={modalMode}
  event={selectedEvent}
  {initialStart}
  {initialEnd}
  onClose={closeModal}
/>
