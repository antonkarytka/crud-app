const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {
    club : (query, cb) => {
        let queryItemts = JSON.parse(query);
        let instanceChoice = queryItemts[0];
        let instanceName = queryItemts[1];
        let newClubName = queryItemts[2];
        if (instanceChoice == 'player') {
            Player.find({ where: { playerName: instanceName }}).then(player => {
                Club.findOrCreate({ where: { clubName: newClubName }}).spread(club => {
                    player.setClub(club);
                });
            });
        } else {
            Doctor.find({ where: { doctorName: instanceName }}).then(doctor => {
                Club.findOrCreate({ where: { clubName: newClubName }}).spread(club => {
                    doctor.setClub(club);
                });
            });
        };
    },

    player : (query, cb) => {
        let queryItemts = JSON.parse(query);
        let doctorName = queryItemts[0];
        let actionChoice = queryItemts[1];
        let playerName = queryItemts[2];
        if (actionChoice == 'add') {
            Doctor.find({ where: { doctorName: doctorName }}).then(doctor => {
                Player.find({ where: { playerName: playerName }}).then(player => {
                    doctor.addPlayer(player);
                });
            });
        } else {
            Doctor.find({ where: { doctorName: doctorName }}).then(doctor => {
                Player.find({ where: { playerName: playerName }}).then(player => {
                    doctor.getPlayers().then(players => {
                        let deletionIndex = players.indexOf(playerName);
                        players.splice(deletionIndex, 1);
                        doctor.setPlayers(players);
                    });
                });
            });
        };
    },

    doctor : (query, cb) => {
        let queryItemts = JSON.parse(query);
        let playerName = queryItemts[0];
        let actionChoice = queryItemts[1];
        let doctorName = queryItemts[2];
        if (actionChoice == 'add') {
            Player.find({ where: { playerName: playerName }}).then(player => {
                Doctor.find({ where: { doctorName: doctorName }}).then(doctor => {
                    player.addDoctor(doctor);
                });
            });
        } else {
            Player.find({ where: { playerName: playerName }}).then(player => {
                Doctor.find({ where: { doctorName: doctorName }}).then(doctor => {
                    player.getDoctors().then(doctors => {
                        let deletionIndex = doctors.indexOf(doctorName);
                        doctors.splice(deletionIndex, 1);
                        player.setDoctors(doctors);
                    });
                });
            });
        };
    }
}
