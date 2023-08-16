"use client"
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
require('dotenv').config();

const api = process.env.API_URL;

const useSocket = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to the Socket.IO server
        const newSocket = io(api);
        setSocket(newSocket);

        // Clean up the socket connection when the component unmounts
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return socket;
};

export default useSocket;