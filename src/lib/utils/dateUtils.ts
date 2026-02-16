import type { CalendarEvent } from "$lib/types/calendar";

/* =====================================================
   HELPERS BASE
===================================================== */

/**
 * Gera chave consistente de dia no formato YYYY-MM-DD
 * Sempre baseado em horário local (UI do calendário)
 */
export const toDayKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Retorna início do dia (00:00:00.000)
 */
export const startOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Retorna fim do dia (23:59:59.999)
 */
export const endOfDay = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

/**
 * Formata uma Date como ISO em horário local (sem Z).
 * Garante que 00:00 local seja armazenado e exibido como 00:00 na grade.
 */
export const toLocalISOString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d}T${h}:${min}:${s}`;
};

/* =====================================================
   DAY
===================================================== */

export const filterEventsByDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  const key = toDayKey(date);

  return events.filter((event) => {
    const eventDate = new Date(event.startDate);
    return toDayKey(eventDate) === key;
  });
};

/* =====================================================
   WEEK
===================================================== */

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

/* =====================================================
   MONTH
===================================================== */

/**
 * Gera as 35 datas do grid do mês
 * (mantém sua estrutura atual do MonthView)
 */
export const getMonthGridDates = (currentDate: Date): (Date | null)[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  return Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - firstDayOfWeek + 1;

    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      return new Date(year, month, dayNumber);
    }

    return null;
  });
};

/* =====================================================
   RANGE + AGRUPAMENTO (CORE DO GRID)
===================================================== */

/**
 * Verifica se evento intersecta o range visível
 */
export const eventIntersectsRange = (
  event: CalendarEvent,
  rangeStart: Date,
  rangeEnd: Date
): boolean => {
  const eventStart = new Date(event.startDate);
  const eventEnd = new Date(event.endDate);

  return eventStart <= rangeEnd && eventEnd >= rangeStart;
};

/**
 * Agrupa eventos por dia dentro do range
 * Retorna Map<YYYY-MM-DD, CalendarEvent[]>
 */
export const buildEventsByDay = (
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date
): Map<string, CalendarEvent[]> => {
  const map = new Map<string, CalendarEvent[]>();

  events.forEach((event) => {
    if (!eventIntersectsRange(event, rangeStart, rangeEnd)) return;

    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);

    // Começa no dia do start e vai avançando dia a dia até o end
    let cursor = startOfDay(eventStart);
    const lastDay = startOfDay(eventEnd);

    while (cursor <= lastDay) {
      // Só adiciona se o dia atual também intersecta o range visível
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

/* =====================================================
   FORMATAÇÃO (mantive o que você já tinha)
===================================================== */

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
