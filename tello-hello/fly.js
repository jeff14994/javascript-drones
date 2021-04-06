const dgram = require('dgram');
const wait = require('waait');
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
droneState.on('message', message => {
    console.log(`Tello: ${message}`);
})


function handleError(err){
    if(err){
        console.log('ERROR');
        console.log(err);
    }
};

// drone.send('command', 0, 'command'.length, PORT, HOST, handleError);
// drone.send('battery?', 0, 'battery?'.length, PORT, HOST, handleError);
// drone.send('time?', 0, 'time?'.length, PORT, HOST, handleError);
// drone.send('wifi?', 0, 'wifi?'.length, PORT, HOST, handleError);
// const commands = ['command', 'battery?', 'takeoff', 'land'];
const commands = ['command', 'battery?'];
let i = 0;
async function go(){
    const command = commands[i];
    const delay = commandDelay[command];
    console.log(`running command: ${command}`);
    drone.send(command, 0, command.length, PORT, HOST, handleError);
    // Wait for specific delay
    await wait(delay);
    i += 1;
    if(i < commands.length){
        return go();
    }
    console.log('done!');
};

go();