import { useState } from 'react';
import type { EventItem } from '../types/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface Props {
  events: EventItem[];
  handleDelete: (id: string) => void;
  handleEdit: (event: EventItem) => void;
}

const EventList = ({ events, handleDelete, handleEdit }: Props) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleOpen = (id: string) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  const confirmDelete = () => {
    if (selectedId) {
      handleDelete(selectedId);
      handleClose();
    }
  };

  return (
    <>
      {' '}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.date} {event.time} — {event.title} ({event.importance})
            <Button onClick={() => handleEdit(event)}>Редагувати</Button>
            <Button onClick={() => handleOpen(event.id!)}>Видалити</Button>
          </li>
        ))}
      </ul>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Підтвердження видалення</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Ви впевнені, що хочете видалити цю подію? Цю дію не можна скасувати.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Скасувати</Button>
          <Button onClick={confirmDelete} color='error'>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EventList;
