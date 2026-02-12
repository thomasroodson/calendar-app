import type { CalendarEvent } from "$lib/types/calendar";

const mockEvents: CalendarEvent[] = [
  {
    id: "65c2a1b20f2d78b831e439df",
    title: "Sprint Planning",
    description: "Reviewing the backlog for the next two weeks",
    startDate: "2026-02-09T09:00:00",
    endDate: "2026-02-09T10:30:00",
    color: "#3b82f6",
    createdAt: "2026-02-01T10:00:00",
    updatedAt: "2026-02-01T10:00:00"
  },
  {
    id: "65c2a1c50f2d78b831e439e0",
    title: "Client Workshop",
    description: "Finalizing the UI requirements",
    startDate: "2026-02-11T14:00:00",
    endDate: "2026-02-11T16:00:00",
    color: "#8b5cf6",
    createdAt: "2026-02-02T11:00:00",
    updatedAt: "2026-02-02T11:00:00"
  },
  {
    id: "65c2a1c50f2d78b831e439e1",
    title: "1:1",
    startDate: "2026-02-11T10:00:00",
    endDate: "2026-02-11T10:30:00",
    color: "#10b981",
    createdAt: "2026-02-02T11:00:00",
    updatedAt: "2026-02-02T11:00:00"
  },
  {
    id: "65c2a1c50f2d78b831e439e2",
    title: "Design Review",
    startDate: "2026-02-12T15:00:00",
    endDate: "2026-02-12T16:00:00",
    color: "#f59e0b",
    createdAt: "2026-02-03T11:00:00",
    updatedAt: "2026-02-03T11:00:00"
  },
  {
    id: "65c2a1c50f2d78b831e439e3",
    title: "Deploy",
    startDate: "2026-02-13T18:00:00",
    endDate: "2026-02-13T19:00:00",
    color: "#ef4444",
    createdAt: "2026-02-03T11:00:00",
    updatedAt: "2026-02-03T11:00:00"
  },
  {
    id: "65c2a1c50f2d78b831e439e4",
    title: "Evento longo (teste)",
    description: "Atravessa horários",
    startDate: "2026-02-11T23:00:00",
    endDate: "2026-02-12T01:00:00",
    color: "#06b6d4",
    createdAt: "2026-02-03T11:00:00",
    updatedAt: "2026-02-03T11:00:00"
  }
];

export const calendarStore = $state({
  events: mockEvents,
  loading: false,
  currentDate: new Date(2026, 1, 11) // Data fixa para bater com o mock durante o dev
});
