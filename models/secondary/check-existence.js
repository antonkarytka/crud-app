const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {   
    club : (query, cb) => {
        let club = JSON.parse(query);
        Club.find({ where: { clubName: club } }).then((club) => {
            if (club)
                cb('exists');
            else
                cb(`${club} does not exist. Please, create it first.`);
        });
    },

    player : (query, cb) => {
        let player = JSON.parse(query);
        Player.find({ where: { playerName: player } }).then((player) => {
            if (player)
                cb('exists');
            else
                cb(`${player} does not exist. Please, create him first.`);
        });
    },

    doctor : (query, cb) => {
        let doctor = JSON.parse(query);
        Doctor.find({ where: { doctorName: doctor } }).then((doctor) => {
            if (doctor)
                cb('exists');
            else
                cb(`${doctor} does not exist. Please, create him first.`);
        });
    }
}