const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {
    club : async(query) => {
        let club = JSON.parse(query);
        let clubDeleted = await Club.destroy({ where: { clubName: club } });
        if (clubDeleted)
            return `${club} was deleted successfully!`;
        else
            return `${club} does not exist. Please, create it first.`;
    },

    player : async(query) => {
        let player = JSON.parse(query);
        let playerDeleted = await Player.destroy({ where: { playerName: player } });
        if (playerDeleted)
            return `${player} was deleted successfully!`;
        else
            return `${player} does not exist. Please, create him first.`;
    },

    doctor : async(query) => {
        let doctor = JSON.parse(query);
        let doctorDeleted = await Doctor.destroy({ where: { doctorName: doctor } });
        if (doctorDeleted)
            return `${doctor} was deleted successfully!`;
        else
            return `${doctor} does not exist. Please, create him first.`;
    }
}
