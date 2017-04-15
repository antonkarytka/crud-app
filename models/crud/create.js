const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {
    club : (query, cb) => {
        let queryItems = JSON.parse(query);
        let club = queryItems[0];
        Club.findOrCreate({ where: { clubName: club } });
    },

    player : (query, cb) => {
        let queryItems = JSON.parse(query);
        let player = queryItems[0];
        let club = queryItems[queryItems.length - 1];
        Club.findOrCreate({ where: { clubName: club } }).spread((club) => {
            Player.findOrCreate({ where: { playerName: player } }).spread((player) => {
                player.setClub(club);
                club.setPlayers(player);
                if (queryItems.length > 3) {
                    for (i = 1; i < queryItems.length - 1; i++) {
                        Doctor.findOrCreate({ where: { doctorName: queryItems[i] } }).spread((doctor) => {
                            doctor.setClub(club);
                            club.setDoctors(doctor);
                            player.addDoctors(doctor);
                        });
                    }
                } else {
                    let doctor = queryItems[1];
                    Doctor.findOrCreate({ where: { doctorName: doctor } }).spread((doctor) => {
                        player.addDoctors(doctor);
                    });
                };
            });
        });
    },

    doctor : (query, cb) => {
        let queryItems = JSON.parse(query);
        let doctor = queryItems[0];
        let club = queryItems[queryItems.length - 1];
        Club.findOrCreate({ where: { clubName: club } }).spread((club) => {
            Doctor.findOrCreate({ where: { doctorName: doctor } }).spread((doctor) => {
                doctor.setClub(club);
                club.setDoctors(doctor);
                if (queryItems.length > 3) {
                    for (i = 1; i < queryItems.length - 1; i++) {
                        Player.findOrCreate({ where: { playerName: queryItems[i] } }).spread((player) => {
                            player.setClub(club);
                            club.setPlayers(player);
                            doctor.addPlayers(player);
                        });
                    }
                } else {
                    let player = queryItems[1];
                    Player.findOrCreate({ where: { playerName: player } }).spread((player) => {
                        doctor.addPlayers(player);
                    });
                };
            });
        });
    }
}