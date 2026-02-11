import type { CalendarEvent } from '$lib/types/calendar';

export const filterEventsByDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
    const targetDate = date.toDateString();
    return events.filter(event => {
        const eventDate = new Date(event.startDate).toDateString();
        return eventDate === targetDate;
    });
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

export const formatDayHeader = (date: Date): string => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return `${days[date.getDay()]} ${date.getDate().toString().padStart(2, '0')}`;
};


export const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });
};