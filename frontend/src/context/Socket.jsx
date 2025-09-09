import React, { useContext, useMemo } from 'react'
import { io } from 'socket.io-client';
const ENDPOINT = import.meta.env.VITE_SERVER_URL

const SocketContext = React.createContext(null);

export const SocketProvider = (props) => {
    const socket = useMemo(() => io(ENDPOINT),[]);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(SocketContext);
}

// Not used for now