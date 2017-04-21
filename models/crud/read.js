const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {
    club : async(query, cb) => {
        let clubName = JSON.parse(query);
        let club = await Club.find({ where: { clubName: clubName } });
        if (club) {
            let clubInfo = '';
            let players = await club.getPlayers();
            clubInfo += 'Players: ';
            if (players.length > 0) {
                for (let player of players)
                    clubInfo += `${player.playerName}, `;
                clubInfo = clubInfo.slice(0, -2);
                clubInfo += '\n';
            } else {
                clubInfo += 'none';
                clubInfo += '\n';
            };

            let doctors = await club.getDoctors();
            clubInfo += 'Doctors: ';
            if (doctors.length > 0) {
                for (let doctor of doctors)
                clubInfo += `${doctor.doctorName}, `;
                clubInfo = clubInfo.slice(0, -2);
                clubInfo += '\n';
            } else {
                clubInfo += 'none';
            };
            cb(clubInfo);
        } else {
            cb('error');
        };
    },

    player : async(query, cb) => {
        let playerName = JSON.parse(query);
        let player = await Player.find({ where: { playerName: playerName } });
        if (player) {
            let club = await player.getClub();
            let playerInfo = `Club: ${club.clubName}\n`;
            let doctors = await player.getDoctors();
            playerInfo += 'Doctors: ';
            if (doctors.length > 0) {
                for (let doctor of doctors)
                    playerInfo += `${doctor.doctorName}, `;
                playerInfo = playerInfo.slice(0, -2);
            } else {
                playerInfo += 'none';
            };
            cb(playerInfo);
        } else {
            cb('error');
        };
    },

    doctor : async(query, cb) => {
        let doctorName = JSON.parse(query);
        let doctor = await Doctor.find({ where: { doctorName: doctorName } });
        if (doctor) {
            let club = await doctor.getClub();
            let doctorInfo = `Club: ${club.clubName}\n`;
            let players = await doctor.getPlayers();
            doctorInfo += 'Players: ';
            if (players.length > 0) {
                for (let player of players)
                    doctorInfo += `${player.playerName}, `;
                doctorInfo = doctorInfo.slice(0, -2);
            } else {
                doctorInfo += 'none';
            };
            cb(doctorInfo);
        } else {
            cb('error');
        };
    }
}
