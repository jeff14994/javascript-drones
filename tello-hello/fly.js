const dgram = require('dgram');
const wait = require('waait');
const app = require('express')();
const http = require('http').Server(app);
const io = require('./node_modules/socket.io')(http);
const commandDelay = require('../backend/commandDelays');

const PORT = 8889;
const HOST = '192.168.10.1';

// Send commands and receive response by setting up a udp client
const drone = dgram.createSocket('udp4');
// drone.bind(PORT);

// Receive Tello State by setting up a udp server
const droneState = dgram.createSocket('udp4');
droneState.bind(8890);

// Send commands and receive response
drone.on('message', message => {
    console.log(`Tello: ${message}`);
});

// Receive Tello State
// droneState.on('message', message => {
//     console.log(`Tello: ${message}`);
// })

// Parse Tello State
function parseState(state) {
    return state.split(';').map(x => x.split(':'));
}

function handleError(err){
    if(err){
        console.log('ERROR');
        console.log(err);
    }
};
// Send data to drone 
// drone.send('command', 0, 'command'.length, PORT, HOST, handleError);
// drone.send('battery?', 0, 'battery?'.length, PORT, HOST, handleError);
// drone.send('time?', 0, 'time?'.length, PORT, HOST, handleError);
// drone.send('wifi?', 0, 'wifi?'.length, PORT, HOST, handleError);
// const commands = ['command', 'battery?', 'takeoff', 'land'];
const commands = ['command', 'battery?'];
// let i = 0;
// async function go(){
//     const command = commands[i];
//     const delay = commandDelay[command];
//     console.log(`running command: ${command}`);
//     drone.send(command, 0, command.length, PORT, HOST, handleError);
//     // Wait for specific delay
//     await wait(delay);
//     i += 1;
//     if(i < commands.length){
//         return go();
//     }
//     console.log('done!');
// };

// go();

io.on('connection', socket => {
    socket.on('command', command => {
    console.log('command Sent from browser');
    console.log(command);
    drone.send(command, 0, command.length, PORT, HOST, handleError);
    });
    socket.emit('status', 'CONNECTED');
});
// Receive fomatted drone data
droneState.on( 'message', state => {
    // console.log(state.toString());
    const formattedState = parseState(state.toString());
    console.log(formattedState);
}

);

http.listen(6767, () => {
    console.log('Socket io server up and running');
});