import type { CalendarEvent } from '$lib/types/calendar';

const mockEvents: CalendarEvent[] = [
    {
        id: '65c2a1b20f2d78b831e439df', // ID Realista MongoDB
        title: 'Sprint Planning',
        description: 'Reviewing the backlog for the next two weeks',
        startDate: '2026-02-09T09:00:00Z',
        endDate: '2026-02-09T10:30:00Z',
        color: '#3b82f6',
        createdAt: '2026-02-01T10:00:00Z',
        updatedAt: '2026-02-01T10:00:00Z'
    },
    {
        id: '65c2a1c50f2d78b831e439e0', // ID Realista MongoDB
        title: 'Client Workshop',
        description: 'Finalizing the UI requirements',
        startDate: '2026-02-11T14:00:00Z',
        endDate: '2026-02-11T16:00:00Z',
        color: '#8b5cf6',
        createdAt: '2026-02-02T11:00:00Z',
        updatedAt: '2026-02-02T11:00:00Z'
    }
];

export const calendarStore = $state({
    events: mockEvents,
    loading: false,
    currentDate: new Date('2026-02-11') // Data fixa para bater com o mock durante o dev
});