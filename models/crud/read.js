const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {   
    club : (query, cb) => {
        let club = JSON.parse(query);
        Club.find({ where: { clubName: club } }).then((club) => {
            let clubInfo = '';
            club.getPlayers().then((players) => {
                clubInfo += 'Players: ';
                if (players.length > 0) {
                    for (let player of players)
                        clubInfo += `${player.playerName}, `;
                    clubInfo = clubInfo.slice(0, -2);
                    clubInfo += '\n';
                } else {
                    clubInfo += 'none';
                };
            });
            club.getDoctors().then((doctors) => {
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
            });
        });
    },

    player : (query, cb) => {
        let player = JSON.parse(query);
        Player.find({ where: { playerName: player } }).then((player) => {
            let playerInfo = '';
            player.getClub().then((club) => {
                playerInfo += `Club: ${club.clubName}\n`;
            });
            player.getDoctors().then((doctors) => {
                playerInfo += 'Doctors: ';
                if (doctors.length > 0) {
                    for (let doctor of doctors)
                        playerInfo += `${doctor.doctorName}, `;
                    playerInfo = playerInfo.slice(0, -2);
                } else {
                    playerInfo += 'none';
                };
                cb(playerInfo);
            });
        });
    },

    doctor : (query, cb) => {
        let doctor = JSON.parse(query);
        Doctor.find({ where: { doctorName: doctor } }).then((doctor) => {
            let doctorInfo = '';
            doctor.getClub().then((club) => {
                doctorInfo += `Club: ${club.clubName}\n`;
            });
            doctor.getPlayers().then((players) => {
                doctorInfo += 'Players: ';
                if (players.length > 0) {
                    for (let player of players)
                        doctorInfo += `${player.playerName}, `;
                    doctorInfo = doctorInfo.slice(0, -2);
                } else {
                    doctorInfo += 'none';
                };
                cb(doctorInfo);
            });
        });
    }
}