<script lang="ts">
  import type { CalendarEvent } from "$lib/types/calendar";
  import type { CreateEventRequest } from "$lib/types/calendar";

  type Mode = "create" | "edit";
  type Draft = {
    title: string;
    description: string;
    start: string;
    end: string;
    color: string;
  };

  let {
    mode = "create",
    event = null,
    initialStart = null,
    initialEnd = null,
    onValidityChange,
    onSubmit
  }: {
    mode?: Mode;
    event?: CalendarEvent | null;
    initialStart?: Date | null;
    initialEnd?: Date | null;
    onValidityChange?: (valid: boolean) => void;
    onSubmit?: (payload: CreateEventRequest) => void;
  } = $props();

  const toISO = (value: string) => new Date(value).toISOString();

  const pad = (n: number) => String(n).padStart(2, "0");

  const formatForInput = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  const roundTo = (d: Date, minutes = 15) => {
    const ms = minutes * 60_000;
    return new Date(Math.ceil(d.getTime() / ms) * ms);
  };

  const fallbackStartDate = roundTo(new Date(), 15);
  const fallbackEndDate = new Date(fallbackStartDate.getTime() + 60 * 60_000);

  const getInitialDraft = (
    e: CalendarEvent | null,
    startOverride?: Date | null,
    endOverride?: Date | null
  ): Draft => {
    const fallbackStart = formatForInput(fallbackStartDate.toISOString());
    const fallbackEnd = formatForInput(fallbackEndDate.toISOString());
    const fallbackColor = "#2596BE";

    return {
      title: e?.title ?? "",
      description: e?.description ?? "",
      start:
        (startOverride && formatForInput(startOverride.toISOString())) ||
        formatForInput(e?.startDate) ||
        fallbackStart,
      end:
        (endOverride && formatForInput(endOverride.toISOString())) ||
        formatForInput(e?.endDate) ||
        fallbackEnd,
      color: e?.color ?? fallbackColor
    };
  };

  let draft = $state<Draft>(getInitialDraft(null));

  $effect(() => {
    draft = getInitialDraft(event, initialStart, initialEnd);
  });

  const isInvalidRange = $derived.by(() => {
    if (!draft.start || !draft.end) return false;
    return new Date(draft.end).getTime() <= new Date(draft.start).getTime();
  });

  const isValid = $derived.by(() => {
    if (!draft.title.trim()) return false;
    if (!draft.start || !draft.end) return false;
    if (isInvalidRange) return false;
    return true;
  });

  $effect(() => {
    onValidityChange?.(isValid);
  });

  const submit = () => {
    if (!isValid) return;

    onSubmit?.({
      title: draft.title.trim(),
      description: draft.description?.trim() || "",
      startDate: toISO(draft.start),
      endDate: toISO(draft.end),
      color: draft.color
    });
  };
</script>

<form
  id="event-form"
  class="space-y-4"
  onsubmit={(e) => {
    e.preventDefault();
    submit();
  }}
>
  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">Título</span>
    </div>
    <input
      type="text"
      class="input-bordered input w-full"
      placeholder="Ex.: Reunião com equipe"
      bind:value={draft.title}
    />
  </label>

  <label class="form-control w-full">
    <div class="label">
      <span class="label-text">Descrição</span>
    </div>
    <textarea
      class="textarea-bordered textarea w-full"
      rows="3"
      placeholder="Detalhes, links, observações..."
      bind:value={draft.description}
    ></textarea>
  </label>

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Início</span>
      </div>
      <input type="datetime-local" class="input-bordered input w-full" bind:value={draft.start} />
    </label>

    <label class="form-control w-full">
      <div class="label">
        <span class="label-text">Fim</span>
      </div>
      <input
        type="datetime-local"
        class={`input-bordered input w-full ${isInvalidRange ? "input-error" : ""}`}
        bind:value={draft.end}
      />
      {#if isInvalidRange}
        <p class="mt-1 text-xs text-error">O horário final deve ser maior que o inicial.</p>
      {/if}
    </label>
  </div>

  <div class="flex items-center gap-3">
    <span class="text-sm opacity-70">Cor</span>
    <input
      type="color"
      class="h-9 w-12 cursor-pointer rounded-md border border-base-300 bg-base-100 p-1"
      bind:value={draft.color}
      aria-label="Selecionar cor"
    />
    <span class="text-xs opacity-60">{draft.color}</span>
  </div>

  <div class="alert">
    <span class="text-sm">
      {mode === "edit"
        ? "Dica: ao salvar, as alterações serão aplicadas ao evento."
        : "Dica: você poderá editar ou excluir esse evento depois."}
    </span>
  </div>
</form>
