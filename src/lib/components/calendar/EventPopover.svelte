<script lang="ts">
  import type { CalendarEvent } from "$lib/types/calendar";
  import { XIcon } from "$lib/components/icons";

  let {
    isOpen,
    event,
    anchorRect,
    onClose
  }: {
    isOpen: boolean;
    event: CalendarEvent | null;
    anchorRect: DOMRect | null;
    onClose?: () => void;
  } = $props();

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const style = $derived.by(() => {
    if (!anchorRect) return "";

    const gap = 12;
    const width = 320;

    const openLeft = anchorRect.right + gap + width > window.innerWidth;
    const left = openLeft ? Math.max(12, anchorRect.left - gap - width) : anchorRect.right + gap;

    // Mantém dentro da viewport
    const top = Math.min(Math.max(12, anchorRect.top), window.innerHeight - 12);

    return `position:fixed; left:${left}px; top:${top - 70}px; width:${width}px; z-index:60;`;
  });

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose?.();
  };
</script>

{#if isOpen && event}
  <div class="fixed inset-0 z-50" role="presentation" onclick={handleBackdropClick}>
    <div
      class="rounded-2xl border border-base-200 bg-base-100 shadow-xl"
      {style}
      role="dialog"
      aria-label="Detalhes do evento"
    >
      <div class="flex items-start justify-between gap-3 border-b border-base-200 px-4 py-3">
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <span class="inline-block h-3 w-3 rounded-full" style={`background:${event.color};`}
            ></span>
            <h3 class="truncate text-sm font-semibold">{event.title}</h3>
          </div>

          <p class="mt-1 text-xs text-base-content/70">
            {formatDate(event.startDate)} • {formatTime(event.startDate)} — {formatTime(
              event.endDate
            )}
          </p>
        </div>

        <button
          type="button"
          class="btn btn-ghost btn-sm"
          onclick={() => onClose?.()}
          aria-label="Fechar"
        >
          <XIcon size={18} />
        </button>
      </div>

      <div class="px-4 py-4">
        {#if event.description}
          <p class="text-sm leading-relaxed text-base-content/80">{event.description}</p>
        {:else}
          <p class="text-sm text-base-content/50">Sem descrição.</p>
        {/if}
      </div>

      <div class="flex items-center justify-end gap-2 border-t border-base-200 px-4 py-3">
        <button type="button" class="btn btn-ghost btn-sm" onclick={() => onClose?.()}>
          Fechar
        </button>

        <!-- Depois: ligar no modo edit -->
        <button type="button" class="btn btn-sm btn-primary"> Editar </button>
      </div>
    </div>
  </div>
{/if}
