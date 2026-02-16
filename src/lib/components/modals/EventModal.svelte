<script lang="ts">
  import EventForm from "$lib/components/modals/EventForm.svelte";
  import { XIcon } from "$lib/components/icons";
  import type { CalendarEvent } from "$lib/types/calendar";
  import { createEvent, updateEvent } from "$lib/stores/calendar.svelte";

  type Mode = "create" | "edit";

  let {
    isOpen,
    mode = "create",
    event = null,
    initialStart = null,
    initialEnd = null,
    onClose
  }: {
    isOpen: boolean;
    mode?: Mode;
    event?: CalendarEvent | null;
    initialStart?: Date | null;
    initialEnd?: Date | null;
    onClose: () => void;
  } = $props();

  let isFormValid = $state(true);

  type SubmitPayload = {
    title: string;
    description?: string;
    startDate: string;
    endDate: string;
    color: string;
  };

  const title = $derived.by(() => (mode === "edit" ? "Editar evento" : "Adicionar evento"));
  const subtitle = $derived.by(() =>
    mode === "edit"
      ? "Atualize os detalhes abaixo para editar este evento."
      : "Preencha os detalhes abaixo para criar um novo evento."
  );

  const handleSubmit = async (payload: SubmitPayload) => {
    if (mode === "edit") {
      if (!event) return;
      await updateEvent(event.id, payload);
    } else {
      await createEvent(payload);
    }

    onClose();
  };
</script>

{#if isOpen}
  <button
    class="fixed inset-0 z-50 bg-black/50"
    aria-label="Fechar modal"
    type="button"
    onclick={onClose}
  ></button>

  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="w-full max-w-xl rounded-2xl bg-base-100 shadow-xl">
      <div class="flex items-center justify-between border-b border-base-200 px-6 py-4">
        <div>
          <h3 class="text-lg font-semibold">{title}</h3>
          <p class="mt-1 text-sm text-base-content/70">{subtitle}</p>
        </div>

        <button class="btn btn-ghost btn-sm" type="button" onclick={onClose} aria-label="Fechar">
          <XIcon size={20} />
        </button>
      </div>

      <div class="px-6 py-5">
        <EventForm
          {mode}
          {event}
          {initialStart}
          {initialEnd}
          onValidityChange={(valid: boolean) => (isFormValid = valid)}
          onSubmit={handleSubmit}
        />
      </div>

      <div class="flex items-center justify-end gap-2 border-t border-base-200 px-6 py-4">
        <button class="btn btn-ghost" type="button" onclick={onClose}> Cancelar </button>

        <button class="btn btn-primary" type="submit" form="event-form" disabled={!isFormValid}>
          {mode === "edit" ? "Salvar alterações" : "Salvar evento"}
        </button>
      </div>
    </div>
  </div>
{/if}
