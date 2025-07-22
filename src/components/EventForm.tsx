import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
} from '@mui/material';
import type { EventItem } from '../types/types';

interface Props {
  title: string;
  setTitle: (val: string) => void;
  time: string;
  setTime: (val: string) => void;
  importance: EventItem['importance'];
  setImportance: (val: EventItem['importance']) => void;
  handleCreate: () => void;
}

const EventForm = ({
  title,
  setTitle,
  time,
  setTime,
  importance,
  setImportance,
  handleCreate,
}: Props) => {
  return (
    <Box
      p={4}
      bgcolor='white'
      borderRadius={2}
      maxWidth={400}
      mx='auto'
      mt={10}
    >
      <Typography variant='h6'>Нова подія</Typography>
      <TextField
        label='Назва події'
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label='Час'
        fullWidth
        value={time}
        onChange={(e) => setTime(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Важливість</InputLabel>
        <Select
          value={importance}
          onChange={(e) =>
            setImportance(e.target.value as EventItem['importance'])
          }
        >
          <MenuItem value='звичайна'>Звичайна</MenuItem>
          <MenuItem value='важлива'>Важлива</MenuItem>
          <MenuItem value='критична'>Критична</MenuItem>
        </Select>
      </FormControl>
      <Button onClick={handleCreate}>Зберегти</Button>
    </Box>
  );
};

export default EventForm;
