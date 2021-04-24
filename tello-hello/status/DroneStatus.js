import {useState} from 'react';
import { RESERVED_EVENTS } from 'socket.io/dist/socket';
import socket from '../socket-example';

function useSocket() {
    const [status, updateStatus] = useState('DISCONNECTED');

    socket.on('status', message => {
        console.log('MESSAGE FROM SOCKET');
        updateStatus(message);
    });
    return status;
}

const DroneState = () => {
    const status = useSocket();
    return (
        <div>
            <p>Status: {status}</p> I am the drone state
        </div>
    );
};

export default DroneState;