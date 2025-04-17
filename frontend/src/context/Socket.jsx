import React, { useContext, useMemo } from 'react'
import { io } from 'socket.io-client';

const SocketContext = React.createContext(null);

export const SocketProvider = (props) => {
    const socket = useMemo(() => io("http://localhost:5004"),[]);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    return useContext(SocketContext);
}