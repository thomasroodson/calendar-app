import { eventsApi } from "$lib/api/eventsApi";
import type { CalendarEvent } from "$lib/types/calendar";

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
    return updated;
  } finally {
    calendarStore.loading = false;
  }
};

export const loadRange = async (start: Date, end: Date) => {
  calendarStore.loading = true;

  try {
    const data = await eventsApi.getRange(start.toISOString(), end.toISOString());
    calendarStore.events = data;
  } finally {
    calendarStore.loading = false;
  }
};
