<script lang="ts">
  import { XIcon } from "$lib/components/icons";

  let {
    visible,
    title,
    startTime,
    endTime,
    color = "#3b82f6",
    onUndo,
    onClose
  }: {
    visible: boolean;
    title: string;
    startTime: string;
    endTime: string;
    color?: string;
    onUndo?: () => void;
    onClose?: () => void;
  } = $props();
</script>

{#if visible}
  <div class="fixed inset-x-0 bottom-4 z-50 px-3 md:bottom-6" role="presentation">
    <div class="mx-auto max-w-[520px]">
      <div class="rounded-2xl border border-base-200 bg-base-100 shadow-xl">
        <!-- Header -->
        <div class="flex items-start justify-between gap-3 border-b border-base-200 px-4 py-3">
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="inline-block h-3 w-3 rounded-full" style={`background:${color};`}></span>
              <h3 class="truncate text-sm font-semibold">Evento atualizado</h3>
            </div>

            <p class="mt-1 truncate text-xs text-base-content/70">
              <span class="font-medium text-base-content/80">{title}</span>
              <span class="mx-1">•</span>
              {startTime} — {endTime}
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

        <!-- Footer actions -->
        <div class="flex items-center justify-end gap-2 px-4 py-3">
          <button type="button" class="btn btn-ghost btn-sm" onclick={() => onClose?.()}>
            Fechar
          </button>

          <button type="button" class="btn btn-sm btn-primary" onclick={() => onUndo?.()}>
            Desfazer
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
