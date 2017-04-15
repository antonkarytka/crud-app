const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {
    club : (query, cb) => {
        let queryItemts = JSON.parse(query);
        let oldClubName = queryItemts[0];
        let newClubName = queryItemts[1];
        Club.update(
        	{ clubName: newClubName },
        	{ where: { clubName: oldClubName } }
        );
    },

    player : (query, cb) => {
        let queryItemts = JSON.parse(query);
        let oldPlayerName = queryItemts[0];
        let newPlayerName = queryItemts[1];
        Player.update(
        	{ playerName: newPlayerName },
        	{ where: { playerName: oldPlayerName } }
        );
    },

    doctor : (query, cb) => {
        let queryItemts = JSON.parse(query);
        let oldDoctorName = queryItemts[0];
        let newDoctorName = queryItemts[1];
        Doctor.update(
        	{ doctorName: newDoctorName },
        	{ where: { doctorName: oldDoctorName } }
        );
    }
}