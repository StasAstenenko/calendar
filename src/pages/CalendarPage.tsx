import { useEffect, useState } from 'react';
import { db } from '../api/firebase';
import {
  collection,
  addDoc,
  doc,
  getDocs,
  deleteDoc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import {
  Modal,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  AppBar,
  Toolbar,
} from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import type { EventItem, UserData } from '../types/types';
import EventForm from '../components/EventForm';
import EventList from '../components/EventList';
import { signOut } from 'firebase/auth';
import { auth } from '../api/firebase';

interface Props {
  user: UserData | null;
}

const CalendarPage = ({ user }: Props) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<EventItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [importance, setImportance] =
    useState<EventItem['importance']>('звичайна');
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const loadEvents = async (uid: string) => {
    if (!uid) {
      console.warn('UID is missing!');
      return;
    }

    const q = query(collection(db, 'events'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    const eventsData = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as EventItem)
    );
    setEvents(eventsData);
  };

  useEffect(() => {
    if (!user?.uid) return;

    const loadedEvents = async () => {
      try {
        await loadEvents(user.uid);
      } catch (e) {
        console.error('Firestore fetch error:', e);
      }
    };

    loadedEvents();
  }, [user?.uid]);

  const handleCreate = async () => {
    if (!user) return;

    const eventData: Omit<EventItem, 'id'> = {
      uid: user.uid,
      title,
      date: date.toDateString(),
      time,
      importance,
    };

    try {
      if (selectedEvent) {
        const eventRef = doc(db, 'events', selectedEvent.id);
        await updateDoc(eventRef, eventData);
      } else {
        await addDoc(collection(db, 'events'), eventData);
      }
      setFormOpen(false);
      setModalOpen(false);
      setSelectedEvent(null);
      loadEvents(user.uid);
    } catch (e) {
      console.error('Помилка під час збереження події:', e);
    }
  };

  const handleEdit = (event: EventItem) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setTime(event.time);
    setImportance(event.importance);
    setDate(new Date(event.date));
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!user?.uid) return;
    await deleteDoc(doc(db, 'events', id));
    loadEvents(user.uid);
  };

  const filteredEvents = events.filter(
    (e) =>
      (filter === '' || e.importance === filter) &&
      e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <AppBar position='static'>
        <Toolbar>
          <Typography variant='h6' sx={{ flexGrow: 1 }}>
            Планувальник Подій
          </Typography>
          <Button color='inherit' onClick={() => signOut(auth)}>
            Вийти
          </Button>
        </Toolbar>
      </AppBar>

      <Calendar
        onClickDay={(d) => {
          setDate(d);
          setModalOpen(true);
        }}
        value={date}
      />

      <Box mt={2}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Фільтр</InputLabel>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <MenuItem value=''>Усі</MenuItem>
            <MenuItem value='звичайна'>Звичайна</MenuItem>
            <MenuItem value='важлива'>Важлива</MenuItem>
            <MenuItem value='критична'>Критична</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label='Пошук'
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />
        <EventList
          events={filteredEvents}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
        />
      </Box>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          p={4}
          bgcolor='white'
          borderRadius={2}
          maxWidth={400}
          mx='auto'
          mt={10}
        >
          <Typography variant='h6'>Події на {date.toDateString()}</Typography>
          <Button onClick={() => setFormOpen(true)}>Створити подію</Button>
        </Box>
      </Modal>

      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <EventForm
          title={title}
          setTitle={setTitle}
          time={time}
          setTime={setTime}
          importance={importance}
          setImportance={setImportance}
          handleCreate={handleCreate}
        />
      </Modal>
    </Box>
  );
};

export default CalendarPage;
