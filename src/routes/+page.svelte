<script lang="ts">
  import CalendarGrid from "$lib/components/calendar/CalendarGrid.svelte";
  import Sidebar from "$lib/components/calendar/Sidebar.svelte";
  import EventPopover from "$lib/components/calendar/EventPopover.svelte";
  import { HamburgerIcon, SearchIcon } from "$lib/components/icons";
  import EventModal from "$lib/components/modals/EventModal.svelte";
  import type { CalendarEvent } from "$lib/types/calendar";
  import DragUpdateAlert from "$lib/components/ui/DragUpdateAlert.svelte";
  import { calendarStore, updateEventDates } from "$lib/stores/calendar.svelte";
  import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";
  import { deleteEvent } from "$lib/stores/calendar.svelte";

  let isSidebarOpen = $state(true);

  // --- Modal controller (SINGLE SOURCE OF TRUTH) ---
  let isModalOpen = $state(false);
  let modalMode = $state<"create" | "edit">("create");
  let selectedEvent = $state<CalendarEvent | null>(null);
  let isConfirmOpen = $state(false);
  let eventToDelete = $state<CalendarEvent | null>(null);

  // Prefill para create (clicou no grid)
  let initialStart = $state<Date | null>(null);
  let initialEnd = $state<Date | null>(null);

  let isPopoverOpen = $state(false);
  let anchorRect = $state<DOMRect | null>(null);

  let dragAlert = $state<{
    visible: boolean;
    eventId: string;
    title: string;
    color: string;
    oldStart: Date | null;
    oldEnd: Date | null;
    newStart: Date | null;
    newEnd: Date | null;
  }>({
    visible: false,
    eventId: "",
    title: "",
    color: "#3b82f6",
    oldStart: null,
    oldEnd: null,
    newStart: null,
    newEnd: null
  });

  let alertTimeout: ReturnType<typeof setTimeout> | null = null;

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

  const handleEventDrop = (id: string, start: Date, end: Date) => {
    const ev = calendarStore.events.find((e) => e.id === id);
    if (!ev) return;

    const oldStart = new Date(ev.startDate);
    const oldEnd = new Date(ev.endDate);

    updateEventDates(id, start, end);

    dragAlert = {
      visible: true,
      eventId: id,
      title: ev.title,
      color: ev.color,
      oldStart,
      oldEnd,
      newStart: start,
      newEnd: end
    };

    if (alertTimeout) clearTimeout(alertTimeout);

    alertTimeout = setTimeout(() => {
      dragAlert.visible = false;
    }, 10000);
  };

  const undoDrag = () => {
    if (!dragAlert.oldStart || !dragAlert.oldEnd) return;

    updateEventDates(dragAlert.eventId, dragAlert.oldStart, dragAlert.oldEnd);

    dragAlert.visible = false;

    if (alertTimeout) clearTimeout(alertTimeout);
  };

  const closeDragAlert = () => {
    dragAlert.visible = false;
    if (alertTimeout) clearTimeout(alertTimeout);
  };

  const openDeleteConfirm = (event: CalendarEvent) => {
    eventToDelete = event;
    isConfirmOpen = true;
  };

  const closeDeleteConfirm = () => {
    isConfirmOpen = false;
    eventToDelete = null;
  };

  const confirmDelete = () => {
    if (!eventToDelete) return;
    deleteEvent(eventToDelete.id);
    closeDeleteConfirm();
    closePopover();
  };

  const handleDeleteFromAlert = () => {
    const ev = calendarStore.events.find((e) => e.id === dragAlert.eventId);
    if (!ev) return;

    openDeleteConfirm(ev);
    dragAlert.visible = false;
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
        onEventDrop={handleEventDrop}
        bind:view
      />
    </main>
  </div>
</div>

<EventPopover
  isOpen={isPopoverOpen}
  event={selectedEvent}
  {anchorRect}
  onClose={closePopover}
  onEdit={(event) => {
    closePopover();
    openEdit(event);
  }}
  onDelete={(event) => openDeleteConfirm(event)}
/>

<!-- ✅ Modal controlado pela page -->
<EventModal
  isOpen={isModalOpen}
  mode={modalMode}
  event={selectedEvent}
  {initialStart}
  {initialEnd}
  onClose={closeModal}
/>

<DragUpdateAlert
  visible={dragAlert.visible}
  title={dragAlert.title}
  startTime={dragAlert.newStart?.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }) ?? ""}
  endTime={dragAlert.newEnd?.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  }) ?? ""}
  color={dragAlert.color}
  onUndo={undoDrag}
  onDelete={handleDeleteFromAlert}
  onClose={closeDragAlert}
/>

<ConfirmDialog
  isOpen={isConfirmOpen}
  title="Excluir evento?"
  description={`Essa ação não pode ser desfeita. Você quer excluir "${eventToDelete?.title ?? ""}"?`}
  confirmText="Excluir"
  cancelText="Cancelar"
  confirmVariant="error"
  onCancel={closeDeleteConfirm}
  onConfirm={confirmDelete}
/>
