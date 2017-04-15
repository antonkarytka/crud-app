const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {    
    club : (query, cb) => {
        let club = JSON.parse(query);
        Club.destroy({ where: { clubName: club } });
    },

    player : (query, cb) => {
        let player = JSON.parse(query);
        Player.destroy({ where: { playerName: player } });
    },

    doctor : (query, cb) => {
        let doctor = JSON.parse(query);
        Doctor.destroy({ where: { doctorName: doctor } });
    }
}