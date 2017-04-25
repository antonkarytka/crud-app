const net = require('net');

const create = require('./models/crud/create');
const read = require('./models/crud/read');
const update = require('./models/crud/update');
const del = require('./models/crud/delete');
const show = require('./models/secondary/show');

const models = {
    'createClub' : create.club,
    'createPlayer' : create.player,
    'createDoctor' : create.doctor,
    'readClub' : read.club,
    'readPlayer': read.player,
    'readDoctor' : read.doctor,
    'updateClub' : update.club,
    'updatePlayer' : update.player,
    'updateDoctor' : update.doctor,
    'deleteClub' : del.club,
    'deletePlayer' : del.player,
    'deleteDoctor' : del.doctor,
    'showClubs' : show.clubs,
    'showPlayers' : show.players,
    'showDoctors' : show.doctors
};

const server = net.createServer();

server.on('connection', (socket) => {
    socket.on('data', async(data) => {
        let query = JSON.parse(data);
        let invokeMethod = query[0];
        query.shift();
        if (query.length != 0) {
            const result = await models[invokeMethod](JSON.stringify(query));
            socket.write(result);
        } else {
            const result = await models[invokeMethod]();
            socket.write(result);
        };
    });
});

server.listen(8080, 'localhost', () => console.log('Server running on 8080...'));
server.on('close', () => db.close());
