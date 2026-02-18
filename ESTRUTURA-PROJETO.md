# Estrutura do Projeto — Agenda (Calendar App)

Documento com a árvore do projeto, caminhos dos arquivos e conteúdo (código) de cada um.

---

## 1. Mapa em árvore (estrutura)

```
calendar-app/
├── .vscode/
│   └── settings.json
├── e2e/
│   └── demo.test.ts
├── src/
│   ├── app.html
│   ├── app.d.ts
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte
│   │   ├── +page.ts
│   │   └── layout.css
│   └── lib/
│       ├── api/
│       │   ├── client.ts
│       │   └── eventsApi.ts
│       ├── components/
│       │   ├── calendar/
│       │   │   ├── CalendarGrid.svelte
│       │   │   ├── EventCard.svelte
│       │   │   ├── EventPopover.svelte
│       │   │   ├── Sidebar.svelte
│       │   │   └── views/
│       │   │       ├── DayView.svelte
│       │   │       ├── MonthView.svelte
│       │   │       └── WeekView.svelte
│       │   ├── icons/
│       │   │   ├── index.ts
│       │   │   ├── CheckIcon.svelte
│       │   │   ├── ChevronDownIcon.svelte
│       │   │   ├── ChevronLeftIcon.svelte
│       │   │   ├── ChevronRightIcon.svelte
│       │   │   ├── CloseIcon.svelte
│       │   │   ├── HamburgerIcon.svelte
│       │   │   ├── MoonIcon.svelte
│       │   │   ├── PlusIcon.svelte
│       │   │   ├── SearchIcon.svelte
│       │   │   ├── SunIcon.svelte
│       │   │   ├── TrashIcon.svelte
│       │   │   └── XIcon.svelte
│       │   ├── modals/
│       │   │   ├── EventForm.svelte
│       │   │   └── EventModal.svelte
│       │   └── ui/
│       │       ├── ConfirmDialog.svelte
│       │       ├── DragUpdateAlert.svelte
│       │       └── ThemeToggle.svelte
│       ├── stores/
│       │   └── calendar.svelte.ts
│       ├── types/
│       │   └── calendar.ts
│       └── utils/
│           └── dateUtils.ts
├── docs/                    # (documentação e imagens)
├── eslint.config.js
├── package.json
├── package-lock.json
├── playwright.config.ts
├── svelte.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 2. Arquivos por caminho com código

### Raiz do projeto

#### `package.json`

```json
{"name":"calendar-app","private":true,"version":"0.0.1","type":"module","scripts":{"dev":"vite dev","build":"vite build","preview":"vite preview","prepare":"svelte-kit sync || echo ''","check":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch","lint":"prettier --check . && eslint .","format":"prettier --write .","test:e2e":"playwright test","test":"npm run test:e2e"},"devDependencies":{"@eslint/compat":"^2.0.2","@eslint/js":"^9.39.2","@fontsource/fira-mono":"^5.2.7","@neoconfetti/svelte":"^2.2.2","@playwright/test":"^1.58.1","@sveltejs/adapter-static":"^3.0.10","@sveltejs/kit":"^2.50.2","@sveltejs/vite-plugin-svelte":"^6.2.4","@tailwindcss/vite":"^4.1.18","@types/node":"^22","daisyui":"^5.5.18","eslint":"^9.39.2","eslint-config-prettier":"^10.1.8","eslint-plugin-svelte":"^3.14.0","globals":"^17.3.0","prettier":"^3.8.1","prettier-plugin-svelte":"^3.4.1","prettier-plugin-tailwindcss":"^0.7.2","svelte":"^5.49.2","svelte-check":"^4.3.6","tailwindcss":"^4.1.18","typescript-eslint":"^8.54.0","vite":"^7.3.1","typescript":"^5.9.3"}}
```

#### `playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  webServer: {
    command: "npm run build && npm run preview",
    port: 4173,
    reuseExistingServer: !process.env.CI
  }
});
```

#### `svelte.config.js`

```js
import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = { kit: { adapter: adapter() } };

export default config;
```

#### `tsconfig.json`

```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "rewriteRelativeImportExtensions": true,
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

#### `vite.config.ts`

```ts
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [tailwindcss(), sveltekit()] });
```

#### `eslint.config.js`

```js
import prettier from "eslint-config-prettier";
import path from "node:path";
import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import svelte from "eslint-plugin-svelte";
import { defineConfig } from "eslint/config";
import globals from "globals";
import ts from "typescript-eslint";
import svelteConfig from "./svelte.config.js";

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore");

export default defineConfig(
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...ts.configs.recommended,
  ...svelte.configs.recommended,
  prettier,
  ...svelte.configs.prettier,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { "no-undef": "off" }
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts", "**/*.svelte.js"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: [".svelte"],
        parser: ts.parser,
        svelteConfig
      }
    }
  }
);
```

---

### `.vscode/settings.json`

```json
{"files.associations":{"*.css":"tailwindcss"},"files.autoSave":"onFocusChange","editor.formatOnSave":true,"editor.defaultFormatter":"esbenp.prettier-vscode","[svelte]":{"editor.defaultFormatter":"esbenp.prettier-vscode"},"[typescript]":{"editor.defaultFormatter":"esbenp.prettier-vscode"},"[javascript]":{"editor.defaultFormatter":"esbenp.prettier-vscode"}}
```

---

### `e2e/demo.test.ts`

```ts
import { expect, test } from "@playwright/test";

test("home page has expected h1", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
});
```

---

### `src/app.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
```

---

### `src/app.d.ts`

```ts
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
```

---

### `src/routes/+layout.svelte`

```svelte
<script>
  import "./layout.css";
  let { children } = $props();
</script>

<div class="flex h-screen w-screen flex-col bg-red-500/10 md:overflow-hidden">
  {@render children()}
</div>

<style>
  :global(html, body, #svelte) {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
```

---

### `src/routes/+page.svelte`

*(Arquivo longo — página principal com header, sidebar, grade do calendário, pesquisa, modais e diálogos. Contém a lógica de estado para view, modal, popover, confirmação de exclusão, pesquisa e alerta de drag.)*

```svelte
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
  let dragAlert = $state<{ visible: boolean; eventId: string; title: string; color: string; oldStart: Date | null; oldEnd: Date | null; newStart: Date | null; newEnd: Date | null }>({ visible: false, eventId: "", title: "", color: "#3b82f6", oldStart: null, oldEnd: null, newStart: null, newEnd: null });
  let alertTimeout: ReturnType<typeof setTimeout> | null = null;

  const closeModal = () => { isModalOpen = false; selectedEvent = null; initialStart = null; initialEnd = null; };
  const openCreate = (start?: Date) => { modalMode = "create"; selectedEvent = null; closePopover(); if (start) { initialStart = start; initialEnd = new Date(start.getTime() + 30 * 60 * 1000); } else { initialStart = null; initialEnd = null; } isModalOpen = true; };
  const openEdit = (event: CalendarEvent) => { modalMode = "edit"; selectedEvent = event; initialStart = null; initialEnd = null; isModalOpen = true; };
  const handleSelectDay = () => { view = "day"; };
  const openPopover = (event: CalendarEvent, rect?: DOMRect) => { selectedEvent = event; anchorRect = rect ?? null; isPopoverOpen = true; };
  const closePopover = () => { isPopoverOpen = false; selectedEvent = null; anchorRect = null; };
  const handleEventDrop = (id: string, start: Date, end: Date, oldStart: Date, oldEnd: Date) => {
    const ev = calendarStore.events.find((e) => e.id === id);
    if (!ev) return;
    dragAlert = { visible: true, eventId: id, title: ev.title, color: ev.color, oldStart, oldEnd, newStart: start, newEnd: end };
    if (alertTimeout) clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => { dragAlert.visible = false; }, 10000);
  };
  const undoDrag = async () => {
    if (!dragAlert.oldStart || !dragAlert.oldEnd) return;
    await updateEventDates(dragAlert.eventId, dragAlert.oldStart, dragAlert.oldEnd);
    dragAlert.visible = false;
    if (alertTimeout) clearTimeout(alertTimeout);
  };
  const closeDragAlert = () => { dragAlert.visible = false; if (alertTimeout) clearTimeout(alertTimeout); };
  const openDeleteConfirm = (event: CalendarEvent) => { eventToDelete = event; isConfirmOpen = true; };
  const closeDeleteConfirm = () => { isConfirmOpen = false; eventToDelete = null; };
  const confirmDelete = () => { if (!eventToDelete) return; deleteEvent(eventToDelete.id); closeDeleteConfirm(); closePopover(); };
  const handleDeleteFromAlert = () => { const ev = calendarStore.events.find((e) => e.id === dragAlert.eventId); if (!ev) return; openDeleteConfirm(ev); dragAlert.visible = false; };
  const focusEventInDayView = (event: CalendarEvent) => { view = "day"; calendarStore.currentDate = new Date(event.startDate); focusRequest = { id: event.id, nonce: Date.now() }; };

  const events = $derived.by(() => calendarStore.events);
  const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const searchResults = $derived.by(() => {
    const q = normalize(searchQuery.trim());
    if (!q) return [];
    return events.filter((ev) => { const hay = normalize(`${ev.title} ${ev.description ?? ""}`); return hay.includes(q); }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).slice(0, 6);
  });
  const formatTime = (iso: string) => new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  const formatDateShort = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  const openSearch = () => { if (!searchQuery.trim()) return; isSearchOpen = true; activeIndex = 0; };
  const closeSearch = () => { isSearchOpen = false; activeIndex = 0; };
  const selectResult = (ev: CalendarEvent) => { focusEventInDayView(ev); closeSearch(); searchQuery = ""; if (searchInputEl) searchInputEl.blur(); };
  const handleSearchKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") { closeSearch(); return; }
    if (!isSearchOpen) { if (e.key === "ArrowDown" && searchResults.length) openSearch(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, searchResults.length - 1); }
    if (e.key === "ArrowUp") { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); }
    if (e.key === "Enter") { e.preventDefault(); const ev = searchResults[activeIndex]; if (ev) selectResult(ev); }
  };
  $effect(() => {
    const onDocDown = (e: MouseEvent) => { if (!isSearchOpen) return; const t = e.target as Node; const wrap = searchWrapEl as HTMLDivElement | null; if (wrap && !wrap.contains(t)) closeSearch(); };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  });
</script>

<svelte:head><title>Agenda</title></svelte:head>

<div class="flex h-screen flex-col overflow-hidden bg-base-200">
  <header class="flex items-center justify-between gap-4 border-b border-base-300 bg-base-100 px-4 py-3">
    <div class="flex items-center gap-3">
      <button class="btn hidden btn-circle btn-ghost btn-sm md:inline-flex" onclick={() => (isSidebarOpen = !isSidebarOpen)} aria-label="Alternar menu" type="button"><HamburgerIcon size={20} /></button>
      <div class="ml-1 flex items-center gap-2"><span class="text-xl font-normal text-base-content opacity-80">Agenda</span></div>
    </div>
    <div class="flex items-center gap-3">
      <div class="relative" bind:this={searchWrapEl}>
        <div class="relative flex items-center">
          <div class="pointer-events-none absolute left-4 z-10 flex items-center justify-center text-base-content/50"><SearchIcon size={20} /></div>
          <input bind:this={searchInputEl} id="global-search" type="search" placeholder="Pesquisar eventos" class="input-bordered input h-11 max-w-[560px] min-w-[290px] rounded-full border-base-300 bg-base-100 pr-4 pl-12 transition-all focus:border-primary md:w-[min(560px,90vw)]" bind:value={searchQuery} onfocus={openSearch} oninput={() => { if (!searchQuery.trim()) closeSearch(); else openSearch(); }} onkeydown={handleSearchKeydown} autocomplete="off" />
        </div>
        {#if isSearchOpen && searchQuery.trim()}
          <div class="absolute top-full right-0 left-0 z-50 mt-2">
            <div class="overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-xl">
              {#if searchResults.length === 0}<div class="px-4 py-3 text-sm text-base-content/60">Nenhum evento encontrado.</div>
              {:else}
                <div class="py-1">
                  {#each searchResults as ev, i (ev.id)}
                    <button type="button" class={`w-full px-4 py-2 text-left transition-colors ${i === activeIndex ? "bg-base-200/40" : "hover:bg-base-200/30"}`} onmouseenter={() => (activeIndex = i)} onclick={() => selectResult(ev)}>
                      <div class="flex items-start gap-3">
                        <span class="mt-1 inline-block h-2.5 w-2.5 rounded-full" style={`background:${ev.color};`}></span>
                        <div class="min-w-0">
                          <div class="truncate text-sm font-medium">{ev.title}</div>
                          <div class="mt-0.5 text-xs text-base-content/70">{formatDateShort(ev.startDate)} • {formatTime(ev.startDate)} — {formatTime(ev.endDate)}</div>
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
    {#if isSidebarOpen}<div class="h-auto border-base-300 md:h-full md:border-r"><Sidebar onCreate={() => openCreate()} onSelectDay={handleSelectDay} /></div>{/if}
    <main class="box-border flex min-h-0 flex-1 flex-col overflow-hidden p-4 pb-5 md:p-6">
      <CalendarGrid onEmptySlotClick={(start: Date) => openCreate(start)} onEventClick={(event: CalendarEvent, rect?: DOMRect) => openPopover(event, rect)} onEventDrop={handleEventDrop} bind:view {focusRequest} />
    </main>
  </div>
</div>

<EventPopover isOpen={isPopoverOpen} event={selectedEvent} {anchorRect} onClose={closePopover} onEdit={(event) => { closePopover(); openEdit(event); }} onDelete={(event) => openDeleteConfirm(event)} />
<EventModal isOpen={isModalOpen} mode={modalMode} event={selectedEvent} {initialStart} {initialEnd} onClose={closeModal} />
<DragUpdateAlert visible={dragAlert.visible} title={dragAlert.title} startTime={dragAlert.newStart?.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) ?? ""} endTime={dragAlert.newEnd?.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) ?? ""} color={dragAlert.color} onUndo={undoDrag} onDelete={handleDeleteFromAlert} onClose={closeDragAlert} />
<ConfirmDialog isOpen={isConfirmOpen} title="Excluir evento?" description={`Essa ação não pode ser desfeita. Você quer excluir "${eventToDelete?.title ?? ""}"?`} confirmText="Excluir" cancelText="Cancelar" confirmVariant="error" onCancel={closeDeleteConfirm} onConfirm={confirmDelete} />
```

---

### `src/routes/+page.ts`

```ts
export const prerender = true;
```

---

### `src/routes/layout.css`

```css
@import "tailwindcss";
@import "@fontsource/fira-mono";

@plugin "daisyui" {
  themes:
    light --default,
    dark --prefersdark;
}

*:focus,
*:focus-within {
  outline: none !important;
  box-shadow: none !important;
}

body {
  @apply min-h-screen bg-base-200;
}

.calendar-container {
  @apply rounded-3xl border border-base-300 bg-base-100 shadow-sm;
}

select.select {
  @apply cursor-pointer border-none bg-transparent font-medium transition-colors hover:bg-base-200;
  outline: none !important;
}
```

---

### `src/lib/types/calendar.ts`

```ts
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  color: string;
}
```

---

### `src/lib/stores/calendar.svelte.ts`

```ts
import { eventsApi } from "$lib/api/eventsApi";
import type { CalendarEvent } from "$lib/types/calendar";

const monthCache = new Set<string>();
const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
let loadSeq = 0;

export const calendarStore = $state({
  events: [] as CalendarEvent[],
  loading: false,
  currentDate: new Date()
});

export const createEvent = async (payload: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => {
  calendarStore.loading = true;
  try {
    const created = await eventsApi.create(payload);
    calendarStore.events = [created, ...calendarStore.events];
    monthCache.clear();
    return created;
  } finally {
    calendarStore.loading = false;
  }
};

export const updateEvent = async (id: string, payload: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => {
  calendarStore.loading = true;
  try {
    const updated = await eventsApi.update(id, payload);
    calendarStore.events = calendarStore.events.map((e) => (e.id === id ? updated : e));
    monthCache.clear();
    return updated;
  } finally {
    calendarStore.loading = false;
  }
};

export const deleteEvent = async (id: string) => {
  calendarStore.loading = true;
  try {
    await eventsApi.remove(id);
    calendarStore.events = calendarStore.events.filter((e) => e.id !== id);
    monthCache.clear();
  } finally {
    calendarStore.loading = false;
  }
};

export const updateEventDates = async (id: string, start: Date, end: Date) => {
  calendarStore.loading = true;
  try {
    const current = calendarStore.events.find((e) => e.id === id);
    if (!current) return;
    const updated = await eventsApi.update(id, { title: current.title, description: current.description ?? "", color: current.color, startDate: start.toISOString(), endDate: end.toISOString() });
    calendarStore.events = calendarStore.events.map((e) => (e.id === id ? updated : e));
    monthCache.clear();
    return updated;
  } finally {
    calendarStore.loading = false;
  }
};

export const loadRange = async (start: Date, end: Date) => {
  const startMonth = monthKey(start);
  const endMonth = monthKey(end);
  if (startMonth === endMonth && monthCache.has(startMonth)) return;
  if (startMonth !== endMonth && monthCache.has(startMonth) && monthCache.has(endMonth)) return;
  const seq = ++loadSeq;
  calendarStore.loading = true;
  try {
    const data = await eventsApi.getRange(start.toISOString(), end.toISOString());
    if (seq !== loadSeq) return;
    const map = new Map(calendarStore.events.map((e) => [e.id, e]));
    for (const ev of data) map.set(ev.id, ev);
    calendarStore.events = Array.from(map.values());
    monthCache.add(startMonth);
    monthCache.add(endMonth);
  } finally {
    calendarStore.loading = false;
  }
};
```

---

### `src/lib/api/client.ts`

```ts
const BASE_URL = "https://localhost:7023";

export type ApiOptions = Omit<RequestInit, "body"> & { body?: unknown };

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

const tryParseErrorMessage = async (res: Response): Promise<string | null> => {
  try {
    const data = (await res.json()) as { errors?: string[] };
    if (data?.errors?.length) return data.errors.join("\n");
  } catch {}
  try {
    const text = await res.text();
    if (text?.trim()) return text;
  } catch {}
  return null;
};

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });
  if (!res.ok) {
    const message = (await tryParseErrorMessage(res)) ?? res.statusText;
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const apiClient = {
  get: <T>(path: string, options: Omit<ApiOptions, "body" | "method"> = {}) => request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options: Omit<ApiOptions, "body" | "method"> = {}) => request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options: Omit<ApiOptions, "body" | "method"> = {}) => request<T>(path, { ...options, method: "PUT", body }),
  del: <T>(path: string, options: Omit<ApiOptions, "body" | "method"> = {}) => request<T>(path, { ...options, method: "DELETE" })
};
```

---

### `src/lib/api/eventsApi.ts`

```ts
import { apiClient } from "./client";
import type { CalendarEvent, CreateEventRequest } from "$lib/types/calendar";

export const eventsApi = {
  getAll: async (): Promise<CalendarEvent[]> => {
    const data = await apiClient.get<any[]>("/Event");
    return data.map((e) => ({ ...e, startDate: e.start ?? e.startDate, endDate: e.end ?? e.endDate })) as CalendarEvent[];
  },
  getRange: async (start: string, end: string): Promise<CalendarEvent[]> => {
    const params = new URLSearchParams({ StartDate: start, EndDate: end });
    const data = await apiClient.get<any[]>(`/Event/range?${params.toString()}`);
    return data.map((e) => ({ ...e, startDate: e.start ?? e.startDate, endDate: e.end ?? e.endDate })) as CalendarEvent[];
  },
  create: async (payload: CreateEventRequest): Promise<CalendarEvent> => {
    const data = await apiClient.post<any>("/Event", { ...payload, start: payload.startDate, end: payload.endDate });
    return { ...data, startDate: data.start ?? data.startDate, endDate: data.end ?? data.endDate } as CalendarEvent;
  },
  update: async (id: string, payload: CreateEventRequest): Promise<CalendarEvent> => {
    const data = await apiClient.put<any>(`/Event/${id}`, { ...payload, start: payload.startDate, end: payload.endDate });
    return { ...data, startDate: data.start ?? data.startDate, endDate: data.end ?? data.endDate } as CalendarEvent;
  },
  remove: async (id: string): Promise<void> => {
    await apiClient.del<void>(`/Event/${id}`);
  }
};
```

---

### `src/lib/utils/dateUtils.ts`

*(Contém: toDayKey, startOfDay, endOfDay, toLocalISOString, filterEventsByDate, getWeekDays, getMonthGridDates, eventIntersectsRange, buildEventsByDay, formatDayHeader, formatMonthYear, clampEventToDay.)*

```ts
import type { CalendarEvent } from "$lib/types/calendar";

export const toDayKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const toLocalISOString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}:${s}`;
};

export const filterEventsByDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  const key = toDayKey(date);
  return events.filter((event) => toDayKey(new Date(event.startDate)) === key);
};

export const getWeekDays = (anchorDate: Date): Date[] => {
  const days: Date[] = [];
  const startOfWeek = new Date(anchorDate);
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);
  for (let i = 0; i < 7; i++) {
    days.push(new Date(startOfWeek));
    startOfWeek.setDate(startOfWeek.getDate() + 1);
  }
  return days;
};

export const getMonthGridDates = (currentDate: Date): (Date | null)[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  return Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - firstDayOfWeek + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) return new Date(year, month, dayNumber);
    return null;
  });
};

export const eventIntersectsRange = (event: CalendarEvent, rangeStart: Date, rangeEnd: Date): boolean => {
  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);
  return eventStart <= rangeEnd && eventEnd >= rangeStart;
};

export const buildEventsByDay = (events: CalendarEvent[], rangeStart: Date, rangeEnd: Date): Map<string, CalendarEvent[]> => {
  const map = new Map<string, CalendarEvent[]>();
  events.forEach((event) => {
    if (!eventIntersectsRange(event, rangeStart, rangeEnd)) return;
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    let cursor = startOfDay(eventStart);
    const lastDay = startOfDay(eventEnd);
    while (cursor <= lastDay) {
      if (cursor <= rangeEnd && endOfDay(cursor) >= rangeStart) {
        const key = toDayKey(cursor);
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(event);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  });
  return map;
};

export const formatDayHeader = (date: Date): string => {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  return `${days[date.getDay()]} ${date.getDate().toString().padStart(2, "0")}`;
};

export const formatMonthYear = (date: Date): string => {
  const month = date.toLocaleDateString("pt-BR", { month: "long" });
  const year = date.toLocaleDateString("pt-BR", { year: "numeric" });
  const formattedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  return `${formattedMonth} ${year}`;
};

export const clampEventToDay = (eventStart: Date, eventEnd: Date, day: Date) => {
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);
  const start = eventStart > dayStart ? eventStart : dayStart;
  const end = eventEnd < dayEnd ? eventEnd : dayEnd;
  return { start, end, isVisible: end > start };
};
```

---

### `src/lib/components/calendar/CalendarGrid.svelte`

*(Contém header com data, seletor Dia/Semana/Mês, navegação, ThemeToggle; carrega eventos por range; renderiza DayView, WeekView ou MonthView.)*

Resumo: importa DayView, MonthView, WeekView, ThemeToggle, ícones; props `view`, `onViewChange`, `onEmptySlotClick`, `onEventClick`, `onEventDrop`, `focusRequest`; estado de drag e `pendingRange`; `loadRange` com debounce; chama `handleEventDrop` e notifica `onEventDrop` com datas antigas.

---

### `src/lib/components/calendar/Sidebar.svelte`

*(Barra lateral: botão Criar, mini-calendário do mês atual, navegação de mês, clique no dia chama onSelectDay e atualiza currentDate.)*

Resumo: usa `calendarStore.currentDate`, `formatMonthYear`, ícones Chevron e Plus; grid 7 colunas para dias; destaque do dia ativo.

---

### `src/lib/components/calendar/EventCard.svelte`

*(Cartão de evento: título, horário, cor; draggable; opcional compact/stretch.)*

Resumo: props `event`, `stretch`, `compact`; drag com `application/x-calendar-event` (id + durationMinutes); classe `.dragging` para opacidade.

---

### `src/lib/components/calendar/EventPopover.svelte`

*(Popover fixo ao clicar no evento: título, data/hora, descrição, botões Fechar / Editar / Excluir.)*

Resumo: posicionamento com `anchorRect`; callbacks `onClose`, `onEdit`, `onDelete`.

---

### `src/lib/components/calendar/views/DayView.svelte`

*(Grade de um dia: 24 linhas de hora; eventos posicionados; clique em vazio cria evento; drop move evento; focusRequest faz scroll até o evento.)*

Resumo: `getEventStyle` com `clampEventToDay`; snap 15 min; `minutesFromOffsetY`, `buildDateAtMinutes`; `$effect` para scroll em `focusRequest`.

---

### `src/lib/components/calendar/views/WeekView.svelte`

*(Grade de 7 dias com colunas; mesma lógica de hora/evento/drop; navegação de semana ao arrastar na borda.)*

Resumo: `getEventStyle(event, day)`; `handleDayDrop`, `handleColumnEdgeDrag` com timer para `onNavigateWeek`.

---

### `src/lib/components/calendar/views/MonthView.svelte`

*(Grid de dias do mês; eventos listados por dia; drag entre dias altera data mantendo horário.)*

Resumo: `getMonthGridDates`, `toDayKey`; `handleDropOnDay` com `shiftDateByDays`.

---

### `src/lib/components/modals/EventModal.svelte`

*(Modal de criar/editar: título, EventForm, botões Cancelar e Salvar; chama createEvent ou updateEvent.)*

Resumo: props `isOpen`, `mode`, `event`, `initialStart`, `initialEnd`, `onClose`; `isFormValid` e `form="event-form"`.

---

### `src/lib/components/modals/EventForm.svelte`

*(Formulário: título, descrição, datetime-local início/fim, cor; validação de intervalo; submit emite CreateEventRequest.)*

Resumo: draft reativo; `getInitialDraft` com fallbacks; `isInvalidRange`, `isValid`; `onValidityChange`, `onSubmit`.

---

### `src/lib/components/ui/ConfirmDialog.svelte`

*(Diálogo de confirmação: título, descrição, Cancelar, Confirmar; variante primary/error.)*

Resumo: props `isOpen`, `title`, `description`, `confirmText`, `cancelText`, `confirmVariant`, `onCancel`, `onConfirm`.

---

### `src/lib/components/ui/DragUpdateAlert.svelte`

*(Toast após arrastar evento: “Evento atualizado”, título, horário, Fechar / Desfazer / Excluir.)*

Resumo: props `visible`, `title`, `startTime`, `endTime`, `color`, `onUndo`, `onDelete`, `onClose`.

---

### `src/lib/components/ui/ThemeToggle.svelte`

*(Botão que alterna tema claro/escuro; lê/grava localStorage e preferência do sistema.)*

Resumo: `data-theme` no `document.documentElement`; ícones Moon/Sun.

---

### `src/lib/components/icons/index.ts`

```ts
export { default as CheckIcon } from "./CheckIcon.svelte";
export { default as ChevronDownIcon } from "./ChevronDownIcon.svelte";
export { default as ChevronLeftIcon } from "./ChevronLeftIcon.svelte";
export { default as ChevronRightIcon } from "./ChevronRightIcon.svelte";
export { default as CloseIcon } from "./CloseIcon.svelte";
export { default as HamburgerIcon } from "./HamburgerIcon.svelte";
export { default as MoonIcon } from "./MoonIcon.svelte";
export { default as PlusIcon } from "./PlusIcon.svelte";
export { default as SearchIcon } from "./SearchIcon.svelte";
export { default as SunIcon } from "./SunIcon.svelte";
export { default as TrashIcon } from "./TrashIcon.svelte";
export { default as XIcon } from "./XIcon.svelte";
```

---

### `src/lib/components/icons/PlusIcon.svelte` (exemplo de ícone)

```svelte
<script lang="ts">
  let { size = 24, color = "#4285F4", ariaLabel = undefined, ...restProps } = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label={ariaLabel} role="img" {...restProps}>
  <line x1="12" y1="5" x2="12" y2="19" />
  <line x1="5" y1="12" x2="19" y2="12" />
</svg>
```

*(Os demais ícones em `src/lib/components/icons/` seguem o mesmo padrão: SVG com props `size`, `color`, `ariaLabel` e rest.)*

---

## 3. Resumo do mapa (referência rápida)

| Caminho | Descrição |
|--------|-----------|
| `src/app.html` | Template HTML raiz (SvelteKit) |
| `src/app.d.ts` | Tipos globais App |
| `src/routes/+layout.svelte` | Layout global (flex, full height) |
| `src/routes/+page.svelte` | Página principal (header, sidebar, calendário, modais, pesquisa) |
| `src/routes/+page.ts` | Prerender da home |
| `src/routes/layout.css` | Tailwind + DaisyUI + estilos globais |
| `src/lib/types/calendar.ts` | `CalendarEvent`, `CreateEventRequest` |
| `src/lib/stores/calendar.svelte.ts` | Store reativo + create/update/delete/loadRange |
| `src/lib/api/client.ts` | Cliente HTTP (BASE_URL, ApiError, get/post/put/del) |
| `src/lib/api/eventsApi.ts` | CRUD de eventos na API |
| `src/lib/utils/dateUtils.ts` | Datas, intervalos, formatação, buildEventsByDay |
| `src/lib/components/calendar/CalendarGrid.svelte` | Container das views + header + loadRange |
| `src/lib/components/calendar/Sidebar.svelte` | Mini-calendário + botão Criar |
| `src/lib/components/calendar/EventCard.svelte` | Cartão de evento (drag) |
| `src/lib/components/calendar/EventPopover.svelte` | Popover de detalhes do evento |
| `src/lib/components/calendar/views/DayView.svelte` | Vista dia (grade 24h) |
| `src/lib/components/calendar/views/WeekView.svelte` | Vista semana (7 colunas) |
| `src/lib/components/calendar/views/MonthView.svelte` | Vista mês (grid de dias) |
| `src/lib/components/modals/EventModal.svelte` | Modal criar/editar evento |
| `src/lib/components/modals/EventForm.svelte` | Formulário do evento |
| `src/lib/components/ui/ConfirmDialog.svelte` | Diálogo de confirmação |
| `src/lib/components/ui/DragUpdateAlert.svelte` | Alerta pós-drag (desfazer/excluir) |
| `src/lib/components/ui/ThemeToggle.svelte` | Alternar tema claro/escuro |
| `src/lib/components/icons/index.ts` | Reexport dos ícones |
| `e2e/demo.test.ts` | Teste E2E Playwright (h1 na home) |

---

*Documento gerado a partir do código-fonte do projeto. Build, .svelte-kit e node_modules foram omitidos da árvore.*
