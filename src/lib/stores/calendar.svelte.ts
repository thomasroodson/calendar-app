import { eventsApi } from "$lib/api/eventsApi";
import type { CalendarEvent } from "$lib/types/calendar";

const monthCache = new Set<string>(); // ex: "2026-02"

const monthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

let loadSeq = 0;

export const calendarStore = $state({
  events: [] as CalendarEvent[],
  loading: false,
  currentDate: new Date()
});

export const createEvent = async (
  payload: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
) => {
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

export const updateEvent = async (
  id: string,
  payload: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
) => {
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

    const updated = await eventsApi.update(id, {
      title: current.title,
      description: current.description ?? "",
      color: current.color,
      startDate: start.toISOString(),
      endDate: end.toISOString()
    });

    // IMPORTANT: confirma com a resposta do servidor
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

  // Se o range está dentro de 1 mês e já está cacheado, não busca
  if (startMonth === endMonth && monthCache.has(startMonth)) return;

  // Se o range pega 2 meses (semana cruzando mês), só busca se algum dos dois não estiver no cache
  if (startMonth !== endMonth && monthCache.has(startMonth) && monthCache.has(endMonth)) return;

  const seq = ++loadSeq;

  calendarStore.loading = true;

  try {
    const data = await eventsApi.getRange(start.toISOString(), end.toISOString());

    if (seq !== loadSeq) return;

    const map = new Map(calendarStore.events.map((e) => [e.id, e]));
    for (const ev of data) map.set(ev.id, ev);
    calendarStore.events = Array.from(map.values());

    // marca meses como carregados
    monthCache.add(startMonth);
    monthCache.add(endMonth);
  } finally {
    calendarStore.loading = false;
  }
};
