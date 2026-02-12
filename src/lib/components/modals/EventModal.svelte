<script lang="ts">
  import { XIcon } from "$lib/components/icons";
  let { isOpen }: { isOpen: boolean } = $props();
</script>

<!-- src/components/modal/EventModal.svelte -->
{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div class="w-full max-w-xl rounded-2xl bg-base-100 shadow-xl">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-base-200 px-6 py-4">
        <div>
          <h3 class="text-lg font-semibold">Adicionar evento</h3>
          <p class="mt-1 text-sm text-base-content/70">
            Preencha os detalhes abaixo para criar um novo evento.
          </p>
        </div>

        <button class="btn btn-ghost btn-sm" aria-label="Fechar">
          <XIcon size={20} color="currentColor" />
        </button>
      </div>

      <!-- Body (temporário: form fixo aqui; depois vira componente separado) -->
      <div class="px-6 py-5">
        <div class="space-y-4">
          <!-- Título -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Título</span>
            </div>
            <input
              type="text"
              class="input-bordered input w-full"
              placeholder="Ex.: Reunião com equipe"
              value=""
            />
          </label>

          <!-- Descrição -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text">Descrição</span>
            </div>
            <textarea
              class="textarea-bordered textarea w-full"
              rows="3"
              placeholder="Detalhes, links, observações..."
            ></textarea>
          </label>

          <!-- Datas -->
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">Início</span>
              </div>
              <input
                type="datetime-local"
                class="input-bordered input w-full"
                value="2026-02-12T09:00"
              />
            </label>

            <label class="form-control w-full">
              <div class="label">
                <span class="label-text">Fim</span>
              </div>
              <input
                type="datetime-local"
                class="input-bordered input w-full"
                value="2026-02-12T10:00"
              />
            </label>
          </div>

          <!-- Observação fixa (só pra preencher visual) -->
          <div class="alert">
            <span class="text-sm"> Dica: você poderá editar ou excluir esse evento depois. </span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-2 border-t border-base-200 px-6 py-4">
        <button class="btn btn-ghost">Cancelar</button>
        <button class="btn btn-primary">Salvar evento</button>
      </div>
    </div>
  </div>
{/if}
