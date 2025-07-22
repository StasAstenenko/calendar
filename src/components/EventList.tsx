import type { EventItem } from '../types/types';
import { Button } from '@mui/material';

interface Props {
  events: EventItem[];
  handleDelete: (id: string) => void;
  handleEdit: (event: EventItem) => void;
}

const EventList = ({ events, handleDelete, handleEdit }: Props) => {
  return (
    <ul>
      {events.map((event) => (
        <li key={event.id}>
          {event.date} {event.time} — {event.title} ({event.importance})
          <Button onClick={() => handleEdit(event)}>Редагувати</Button>
          <Button onClick={() => handleDelete(event.id!)}>Видалити</Button>
        </li>
      ))}
    </ul>
  );
};

export default EventList;
