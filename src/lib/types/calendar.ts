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
