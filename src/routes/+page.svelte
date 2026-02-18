<script lang="ts">
  import CalendarGrid from "$lib/components/calendar/CalendarGrid.svelte";
  import EventPopover from "$lib/components/calendar/EventPopover.svelte";
  import Sidebar from "$lib/components/calendar/Sidebar.svelte";
  import EventModal from "$lib/components/modals/EventModal.svelte";
  import ConfirmDialog from "$lib/components/ui/ConfirmDialog.svelte";
  import DragUpdateAlert from "$lib/components/ui/DragUpdateAlert.svelte";
  import { HamburgerIcon, SearchIcon } from "$lib/components/icons";
  import type { CalendarEvent } from "$lib/types/calendar";
  import { calendarStore, deleteEvent, updateEventDates } from "$lib/stores/calendar.svelte";

  type ViewMode = "day" | "week" | "month";
  type FocusRequest = { id: string; nonce: number } | null;

  let isSidebarOpen = $state(true);
  let view = $state<ViewMode>("week");
  let focusRequest = $state<FocusRequest>(null);

  let isModalOpen = $state(false);
  let modalMode = $state<"create" | "edit">("create");
  let selectedEvent = $state<CalendarEvent | null>(null);
  let initialStart = $state<Date | null>(null);
  let initialEnd = $state<Date | null>(null);

  let isPopoverOpen = $state(false);
  let anchorRect = $state<DOMRect | null>(null);

  let isConfirmOpen = $state(false);
  let eventToDelete = $state<CalendarEvent | null>(null);

  let searchQuery = $state("");
  let isSearchOpen = $state(false);
  let activeIndex = $state(0);

  let searchWrapEl: HTMLDivElement | null = null;
  let searchInputEl: HTMLInputElement | null = null;

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
      initialEnd = new Date(start.getTime() + 30 * 60 * 1000);
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

  const handleEventDrop = (id: string, start: Date, end: Date, oldStart: Date, oldEnd: Date) => {
    const ev = calendarStore.events.find((e) => e.id === id);
    if (!ev) return;

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

  const undoDrag = async () => {
    if (!dragAlert.oldStart || !dragAlert.oldEnd) return;

    await updateEventDates(dragAlert.eventId, dragAlert.oldStart, dragAlert.oldEnd);

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

  const focusEventInDayView = (event: CalendarEvent) => {
    view = "day";
    calendarStore.currentDate = new Date(event.startDate);
    focusRequest = { id: event.id, nonce: Date.now() };
  };

  const events = $derived.by(() => calendarStore.events);

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const searchResults = $derived.by(() => {
    const q = normalize(searchQuery.trim());
    if (!q) return [];

    return events
      .filter((ev) => {
        const hay = normalize(`${ev.title} ${ev.description ?? ""}`);
        return hay.includes(q);
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 6);
  });

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const formatDateShort = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });

  const openSearch = () => {
    if (!searchQuery.trim()) return;
    isSearchOpen = true;
    activeIndex = 0;
  };

  const closeSearch = () => {
    isSearchOpen = false;
    activeIndex = 0;
  };

  const selectResult = (ev: CalendarEvent) => {
    focusEventInDayView(ev);
    closeSearch();
    searchQuery = "";
    if (searchInputEl) searchInputEl.blur();
  };

  const handleSearchKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeSearch();
      return;
    }

    if (!isSearchOpen) {
      if (e.key === "ArrowDown" && searchResults.length) openSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, searchResults.length - 1);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const ev = searchResults[activeIndex];
      if (ev) selectResult(ev);
    }
  };

  $effect(() => {
    const onDocDown = (e: MouseEvent) => {
      if (!isSearchOpen) return;
      const t = e.target as Node;
      const wrap = searchWrapEl as HTMLDivElement | null;
      if (wrap && !wrap.contains(t)) closeSearch();
    };

    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  });
</script>

<svelte:head>
  <title>Agenda</title>
</svelte:head>

<div class="flex h-screen flex-col overflow-hidden bg-base-200" data-testid="agenda-page">
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

      <div class="relative" bind:this={searchWrapEl}>
        <label for="global-search" class="sr-only">Pesquisar</label>

        <div class="relative flex items-center">
          <div
            class="pointer-events-none absolute left-4 z-10 flex items-center justify-center text-base-content/50"
          >
            <SearchIcon size={20} />
          </div>

          <input
            bind:this={searchInputEl}
            id="global-search"
            data-testid="global-search"
            type="search"
            placeholder="Pesquisar eventos"
            class="input-bordered input h-11 max-w-[560px] min-w-[290px] rounded-full border-base-300 bg-base-100 pr-4 pl-12 transition-all focus:border-primary md:w-[min(560px,90vw)]"
            bind:value={searchQuery}
            onfocus={openSearch}
            oninput={() => {
              if (!searchQuery.trim()) closeSearch();
              else openSearch();
            }}
            onkeydown={handleSearchKeydown}
            autocomplete="off"
          />
        </div>

        {#if isSearchOpen && searchQuery.trim()}
          <div class="absolute top-full right-0 left-0 z-50 mt-2" data-testid="search-results">
            <div class="overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-xl">
              {#if searchResults.length === 0}
                <div class="px-4 py-3 text-sm text-base-content/60">Nenhum evento encontrado.</div>
              {:else}
                <div class="py-1">
                  {#each searchResults as ev, i (ev.id)}
                    <button
                      type="button"
                      class={`w-full px-4 py-2 text-left transition-colors ${
                        i === activeIndex ? "bg-base-200/40" : "hover:bg-base-200/30"
                      }`}
                      onmouseenter={() => (activeIndex = i)}
                      onclick={() => selectResult(ev)}
                    >
                      <div class="flex items-start gap-3">
                        <span
                          class="mt-1 inline-block h-2.5 w-2.5 rounded-full"
                          style={`background:${ev.color};`}
                        ></span>

                        <div class="min-w-0">
                          <div class="truncate text-sm font-medium">{ev.title}</div>
                          <div class="mt-0.5 text-xs text-base-content/70">
                            {formatDateShort(ev.startDate)} • {formatTime(ev.startDate)} — {formatTime(
                              ev.endDate
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        {/if}
      </div>
    </div>
  </header>

  <div class="flex flex-1 flex-col overflow-hidden md:flex-row">
    {#if isSidebarOpen}
      <div class="h-auto border-base-300 md:h-full md:border-r">
        <Sidebar onCreate={() => openCreate()} onSelectDay={handleSelectDay} />
      </div>
    {/if}

    <main class="box-border flex min-h-0 flex-1 flex-col overflow-hidden p-4 pb-5 md:p-6">
      <CalendarGrid
        onEmptySlotClick={(start: Date) => openCreate(start)}
        onEventClick={(event: CalendarEvent, rect?: DOMRect) => openPopover(event, rect)}
        onEventDrop={handleEventDrop}
        bind:view
        {focusRequest}
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
