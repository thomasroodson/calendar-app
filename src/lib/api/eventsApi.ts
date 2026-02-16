import { apiClient } from "./client";
import type { CalendarEvent, CreateEventRequest } from "$lib/types/calendar";

export const eventsApi = {
  getAll: async (): Promise<CalendarEvent[]> => {
    const data = await apiClient.get<any[]>("/Event");
    return data.map((e) => ({
      ...e,
      startDate: e.start ?? e.startDate,
      endDate: e.end ?? e.endDate
    })) as CalendarEvent[];
  },

  getRange: async (start: string, end: string): Promise<CalendarEvent[]> => {
    const params = new URLSearchParams({
      StartDate: start,
      EndDate: end
    });

    const data = await apiClient.get<any[]>(`/Event/range?${params.toString()}`);

    return data.map((e) => ({
      ...e,
      startDate: e.start ?? e.startDate,
      endDate: e.end ?? e.endDate
    })) as CalendarEvent[];
  },

  create: async (payload: CreateEventRequest): Promise<CalendarEvent> => {
    const data = await apiClient.post<any>("/Event", {
      ...payload,
      start: payload.startDate,
      end: payload.endDate
    });

    return {
      ...data,
      startDate: data.start ?? data.startDate,
      endDate: data.end ?? data.endDate
    } as CalendarEvent;
  },

  update: async (id: string, payload: CreateEventRequest): Promise<CalendarEvent> => {
    const data = await apiClient.put<any>(`/Event/${id}`, {
      ...payload,
      start: payload.startDate,
      end: payload.endDate
    });

    return {
      ...data,
      startDate: data.start ?? data.startDate,
      endDate: data.end ?? data.endDate
    } as CalendarEvent;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.del<void>(`/Event/${id}`);
  }
};
