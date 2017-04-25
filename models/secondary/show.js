const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {
    clubs : async() => {
        let clubsList = 'Existing clubs: ';
        let clubs = await Club.findAll();
        if (clubs.length > 0) {
            for (let club of clubs)
                clubsList += `${club.clubName}, `;
            clubsList = clubsList.slice(0, -2);
        } else {
            clubsList += 'none';
        };
        return clubsList;
    },

    players : async() => {
        let playersList = 'Existing players: ';
        let players = await Player.findAll();
        if (players.length > 0) {
            for (let player of players)
                playersList += `${player.playerName}, `;
            playersList = playersList.slice(0, -2);
        } else {
            playersList += 'none';
        };
        return playersList;
    },

    doctors : async() => {
        let doctorsList = 'Existing doctors: ';
        let doctors = await Doctor.findAll();
        if (doctors.length > 0) {
            for (let doctor of doctors)
                doctorsList += `${doctor.doctorName}, `;
            doctorsList = doctorsList.slice(0, -2);
        } else {
            doctorsList += 'none';
        };
        return doctorsList;
    }
}
