import { lazy, useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './api/firebase';
import { PrivateRoute } from './routes/PrivateRoute';
import type { UserData } from './types/types';

const MainPage = lazy(() => import('./pages/CalendarPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

const App = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userData: UserData = {
          uid: currentUser.uid,
          token: await currentUser.getIdToken(),
        };
        setUser(userData);
        localStorage.setItem('token', userData.token!);
        navigate('/');
      } else {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/auth');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Завантаження...</div>;
  }

  return (
    <Routes>
      <Route path='/auth' element={<AuthPage />} />
      <Route element={<PrivateRoute />}>
        <Route path='/' element={<MainPage user={user} />} />
      </Route>
    </Routes>
  );
};

export default App;
