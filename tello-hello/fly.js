const dgram = require('dgram');
const wait = require('waait');
const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const throttle = require('lodash/throttle');
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
    /*
        {
            returnCode: '200',
            message: 'object'
        }
    */
    var data = {}
    // Return Array
    // detail = state.split(';');
    // Return Formatted data
    detail = state.split(';').map(x => x + '\n').join('');
    data.returnCode = '200';
    data.message = detail;
    return data;
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
let i = 0;
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



// //   [
// //     [ 'pitch', '0' ],  [ 'roll', '0' ],
// //     [ 'yaw', '-85' ],  [ 'vgx', '0' ],
// //     [ 'vgy', '0' ],    [ 'vgz', '0' ],
// //     [ 'templ', '92' ], [ 'temph', '94' ],
// //     [ 'tof', '10' ],   [ 'h', '0' ],
// //     [ 'bat', '86' ],   [ 'baro', '132.84' ],
// //     [ 'time', '0' ],   [ 'agx', '2.00' ],
// //     [ 'agy', '6.00' ], [ 'agz', '-999.00' ],
// //     [ '\r\n' ]

// Set ejs as frontend render engine
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Tello Dashboard'
    });
});

http.listen(8000, () => {
    console.log('Socket io server up and running');
});
const serv_io = io.listen(http);

// serv_io.sockets.on('connection', socket => {
    // socket.on('command', command => {
    // console.log('command Sent from browser');
    // console.log(command);
    // drone.send(command, 0, command.length, PORT, HOST, handleError);
    // setInterval(() => {
    //     socket.emit('droneStatus', receiveTelloStatus())
    // }, 2000);
    // socket.emit('status', 'CONNECTED');
// });

// Receive fomatted drone data
droneState.on(
    'message',
    throttle(state => {
    const formattedState = parseState(state.toString());
    console.log(formattedState);
    io.sockets.emit('dronestate', formattedState);
    }, 100)
);