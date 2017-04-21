const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {
    club : async(query, cb) => {
        let club = JSON.parse(query);
        let clubDeleted = await Club.destroy({ where: { clubName: club } });
        if (clubDeleted)
            cb(`${club} was deleted successfully!`)
        else
            cb(`${club} does not exist. Please, create it first.`)
    },

    player : async(query, cb) => {
        let player = JSON.parse(query);
        let playerDeleted = await Player.destroy({ where: { playerName: player } });
        if (playerDeleted)
            cb(`${player} was deleted successfully!`)
        else
            cb(`${player} does not exist. Please, create him first.`)
    },

    doctor : async(query, cb) => {
        let doctor = JSON.parse(query);
        let doctorDeleted = await Doctor.destroy({ where: { doctorName: doctor } });
        if (doctorDeleted)
            cb(`${doctor} was deleted successfully!`)
        else
            cb(`${doctor} does not exist. Please, create him first.`)
    }
}
