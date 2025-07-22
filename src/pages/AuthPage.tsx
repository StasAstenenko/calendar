import { useState } from 'react';
import { auth } from '../api/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Введіть email і пароль.');
      return;
    }
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      }
    } catch (error) {
      alert('Помилка: ' + (error as Error).message);
    }
  };

  return (
    <Box
      maxWidth={400}
      mx='auto'
      mt={10}
      p={4}
      bgcolor='white'
      borderRadius={2}
    >
      <Typography variant='h5' mb={2}>
        {isRegister ? 'Реєстрація' : 'Вхід'}
      </Typography>
      <TextField
        label='Email'
        fullWidth
        margin='normal'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label='Пароль'
        type='password'
        fullWidth
        margin='normal'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant='contained' fullWidth onClick={handleSubmit}>
        {isRegister ? 'Зареєструватися' : 'Увійти'}
      </Button>
      <Button fullWidth onClick={() => setIsRegister(!isRegister)}>
        {isRegister
          ? 'Уже маєте акаунт? Увійти'
          : 'Немає акаунта? Зареєструватися'}
      </Button>
    </Box>
  );
}
