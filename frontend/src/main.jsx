import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import ChatProvider from './context/ChatProvider.jsx';
import AuthProvider from './context/AuthContext.jsx';
import { SocketProvider } from './context/Socket.jsx';
import { GoogleOAuthProvider} from "@react-oauth/google"


createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}>
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
  </GoogleOAuthProvider>
);
