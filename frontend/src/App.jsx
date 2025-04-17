import './App.css';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthenticationPage from './Pages/AuthenticationPage';
import { useAuthCtx } from './context/AuthContext';
import { useEffect } from 'react';
import ResetPassword from './Pages/ResetPassword';
import ForgotPassword from './Pages/ForgotPassword';

function App() {
  const {initializeAuth} = useAuthCtx();

  useEffect(() => {
    initializeAuth()
  }, [])

  return (
    <div className='App'>
      <ToastContainer />
      <Routes>

        <Route element={<ProtectRoute />}>
          <Route path='/' element={<HomePage />} />
        </Route>

        <Route path='/resetpassword/:id/:token' element={<ResetPassword />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />

        <Route element={<Redirect />}>
          <Route path='/auth' element={<AuthenticationPage />} />
        </Route>

        
      </Routes>
    </div>
  );
}

export default App;

export const ProtectRoute = () => {
  const {user} = useAuthCtx();
  if (!user) {
    return <Navigate to="/auth" replace />;
  } 
  return <Outlet />;
};

export const Redirect = () => {
  const {user} = useAuthCtx();

  // const user = JSON.parse(localStorage.getItem('userToken'));
  if (user) {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
};