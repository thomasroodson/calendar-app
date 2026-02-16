<script lang="ts">
  let {
    isOpen,
    title = "Confirmar ação",
    description = "Tem certeza?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    confirmVariant = "error",
    onCancel,
    onConfirm
  }: {
    isOpen: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "primary" | "error";
    onCancel?: () => void;
    onConfirm?: () => void;
  } = $props();

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onCancel?.();
  };
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50" role="presentation" onclick={handleBackdropClick}>
    <div class="absolute inset-0 bg-black/50"></div>

    <div class="relative z-10 flex min-h-full items-center justify-center p-4">
      <div class="w-full max-w-md rounded-2xl border border-base-200 bg-base-100 shadow-xl">
        <div class="border-b border-base-200 px-6 py-4">
          <h3 class="text-lg font-semibold">{title}</h3>
          <p class="mt-1 text-sm text-base-content/70">{description}</p>
        </div>

        <div class="flex items-center justify-end gap-2 px-6 py-4">
          <button type="button" class="btn btn-ghost" onclick={() => onCancel?.()}>
            {cancelText}
          </button>

          <button
            type="button"
            class={`btn ${confirmVariant === "error" ? "btn-error" : "btn-primary"} text-white`}
            onclick={() => onConfirm?.()}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
