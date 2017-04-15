const dnode = require('dnode');

const create = require('./models/crud/create');
const read = require('./models/crud/read');
const update = require('./models/crud/update');
const del = require('./models/crud/delete');
const show = require('./models/secondary/show');
const checkExistence = require('./models/secondary/check-existence');

const server = dnode({
    createClub : create.club,
    createPlayer : create.player,
    createDoctor : create.doctor,
    readClub : read.club,
    readPlayer: read.player,
    readDoctor : read.doctor,
    updateClub : update.club,
    updatePlayer : update.player,
    updateDoctor : update.doctor,
    deleteClub : del.club,
    deletePlayer : del.player,
    deleteDoctor : del.doctor,
    showClubs : show.clubs,
    showPlayers : show.players,
    showDoctors : show.doctors,
    checkClubExistence : checkExistence.club,
    checkPlayerExistence : checkExistence.player,
    checkDoctorExistence : checkExistence.doctor
});

server.listen(8080, () => { console.log('Server running on 8080...') });

server.on('end', () => {
    db.close();
});
