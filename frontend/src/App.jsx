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
import  VideoPage  from './Pages/VideoPage';
import Error from './components/Error';

function App() {
  const {initializeAuth} = useAuthCtx();

  useEffect(() => {
    initializeAuth()
  }, [])

  return (
    <div className='App'>
      <ToastContainer />
      <Routes>

        {/* <Route element={<ProtectRoute />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/videochat' element={<VideoPage />} />
        </Route> */}
        <Route path='/' element={
          <ProtectRoute>
            <HomePage />
          </ProtectRoute>
        } />
        <Route path='/videochat' element={
          <ProtectRoute>
            <VideoPage />
          </ProtectRoute>
        } />

        <Route path='/resetpassword/:id/:token' element={<ResetPassword />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />

        <Route element={<Redirect />}>
          <Route path='/auth' element={<AuthenticationPage />} />
        </Route>

        <Route path='*' element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;

export const ProtectRoute = ({children}) => {
  const user = localStorage.getItem('userInfo')
  if (!user) {
    return <Navigate to="/auth" replace />;
  } 
  return children;
};

export const Redirect = () => {
  const {user} = useAuthCtx();

  // const user = JSON.parse(localStorage.getItem('userToken'));
  if (user) {
    return <Navigate to='/' replace />;
  }
  return <Outlet />;
};