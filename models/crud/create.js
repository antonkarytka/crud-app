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
        let playerName = queryItems[0];
        let clubName = queryItems[queryItems.length - 1];
        Club.find({ where: { clubName: clubName } }).then((clubFound) => {
            if (clubFound) {
                Player.find({ where: { playerName: playerName } }).then((playerFound) => {
                    if (playerFound) {
                        playerFound.setClub(clubFound);
                        clubFound.addPlayers(playerFound);
                        if (queryItems.length > 2) {
                            for (let i = 1; i < queryItems.length - 1; i++) {
                                Doctor.find({ where: { doctorName: queryItems[i] }}).then((doctorFound) => {
                                    if (doctorFound) {
                                        doctorFound.setClub(clubFound);
                                        clubFound.addDoctors(doctorFound);
                                        playerFound.addDoctors(doctorFound);                                       
                                    } else {
                                        Doctor.create({ doctorName: queryItems[i] }).then((doctor) => {
                                            doctor.setClub(clubFound);
                                            clubFound.addDoctors(doctorFound);
                                            playerFound.addDoctors(doctorFound);
                                        });                                        
                                    };
                                });
                            };
                        };    
                    } else {
                        Player.create({ playerName: playerName }).then((player) => {
                            player.setClub(clubFound);
                            clubFound.addPlayers(player);
                            if (queryItems.length > 2) {
                                for (let i = 1; i < queryItems.length - 1; i++) {
                                    Doctor.find({ where: { doctorName: queryItems[i] }}).then((doctorFound) => {
                                        if (doctorFound) {
                                            doctorFound.setClub(clubFound);
                                            clubFound.addDoctors(doctorFound);
                                            player.addDoctors(doctorFound);                                       
                                        } else {
                                            Doctor.create({ doctorName: queryItems[i] }).then((doctor) => {
                                                doctor.setClub(clubFound);
                                                clubFound.addDoctors(doctor);
                                                player.addDoctors(doctor);
                                            });                                        
                                        };
                                    });
                                };
                            };    
                        });
                    };
                });
            } else {
                Club.create({ clubName: clubName }).then((club) => {
                    Player.find({ where: { playerName: playerName } }).then((playerFound) => {
                        if (playerFound) {
                            playerFound.setClub(club);
                            club.addPlayers(playerFound);
                            if (queryItems.length > 2) {
                                for (let i = 1; i < queryItems.length - 1; i++) {
                                    Doctor.find({ where: { doctorName: queryItems[i] }}).then((doctorFound) => {
                                        if (doctorFound) {
                                            doctorFound.setClub(club);
                                            club.addDoctors(doctorFound);
                                            playerFound.addDoctors(doctorFound);                                       
                                        } else {
                                            Doctor.create({ doctorName: queryItems[i] }).then((doctor) => {
                                                doctor.setClub(club);
                                                club.addDoctors(doctorFound);
                                                playerFound.addDoctors(doctorFound);
                                            });                                        
                                        };
                                    });
                                };
                            };    
                        } else {
                            Player.create({ playerName: playerName }).then((player) => {
                                player.setClub(club);
                                club.addPlayers(player);
                                if (queryItems.length > 2) {
                                    for (let i = 1; i < queryItems.length - 1; i++) {
                                        Doctor.find({ where: { doctorName: queryItems[i] }}).then((doctorFound) => {
                                            if (doctorFound) {
                                                doctorFound.setClub(club);
                                                club.addDoctors(doctorFound);
                                                player.addDoctors(doctorFound);                                       
                                            } else {
                                                Doctor.create({ doctorName: queryItems[i] }).then((doctor) => {
                                                    doctor.setClub(club);
                                                    club.addDoctors(doctor);
                                                    player.addDoctors(doctor);
                                                });                                        
                                            };
                                        });
                                    };
                                };    
                            });
                        };
                    });
                });
            }
        });
    },

    doctor : (query, cb) => {
        let queryItems = JSON.parse(query);
        let doctorName = queryItems[0];
        let clubName = queryItems[queryItems.length - 1];
        Club.find({ where: { clubName: clubName } }).then((clubFound) => {
            if (clubFound) {
                Doctor.find({ where: { doctorName: doctorName } }).then((doctorFound) => {
                    if (doctorFound) {
                        doctorFound.setClub(clubFound);
                        clubFound.addDoctors(doctorFound);
                        if (queryItems.length > 2) {
                            for (let i = 1; i < queryItems.length - 1; i++) {
                                Player.find({ where: { playerName: queryItems[i] }}).then((playerFound) => {
                                    if (playerFound) {
                                        playerFound.setClub(clubFound);
                                        clubFound.addPlayers(playerFound);
                                        doctorFound.addPlayers(playerFound);                                       
                                    } else {
                                        Player.create({ playerName: queryItems[i] }).then((player) => {
                                            player.setClub(clubFound);
                                            clubFound.addPlayers(player);
                                            doctorFound.addPlayers(player);
                                        });                                        
                                    };
                                });
                            };
                        };    
                    } else {
                        Doctor.create({ doctorName: doctorName }).then((doctor) => {
                            doctor.setClub(clubFound);
                            clubFound.addDoctors(doctor);
                            if (queryItems.length > 2) {
                                for (let i = 1; i < queryItems.length - 1; i++) {
                                    Player.find({ where: { playerName: queryItems[i] }}).then((playerFound) => {
                                        if (playerFound) {
                                            playerFound.setClub(clubFound);
                                            clubFound.addPlayers(playerFound);
                                            doctor.addPlayers(playerFound);                                       
                                        } else {
                                            Player.create({ playerName: queryItems[i] }).then((player) => {
                                                player.setClub(clubFound);
                                                clubFound.addPlayers(player);
                                                doctor.addPlayers(player);
                                            });                                        
                                        };
                                    });
                                };
                            };    
                        });
                    };
                });
            } else {
                Club.create({ clubName: clubName }).then((club) => {
                    Doctor.find({ where: { doctorName: doctorName } }).then((doctorFound) => {
                        if (doctorFound) {
                            doctorFound.setClub(club);
                            club.addDoctors(doctorFound);
                            if (queryItems.length > 2) {
                                for (let i = 1; i < queryItems.length - 1; i++) {
                                    Player.find({ where: { playerName: queryItems[i] }}).then((playerFound) => {
                                        if (playerFound) {
                                            playerFound.setClub(club);
                                            club.addPlayers(playerFound);
                                            doctorFound.addPlayers(playerFound);                                       
                                        } else {
                                            Player.create({ playerName: queryItems[i] }).then((player) => {
                                                player.setClub(club);
                                                club.addPlayers(player);
                                                doctorFound.addPlayers(player);
                                            });                                        
                                        };
                                    });
                                };
                            };    
                        } else {
                            Doctor.create({ doctorName: doctorName }).then((doctor) => {
                                doctor.setClub(club);
                                club.addDoctors(doctor);
                                if (queryItems.length > 2) {
                                    for (let i = 1; i < queryItems.length - 1; i++) {
                                        Player.find({ where: { playerName: queryItems[i] }}).then((playerFound) => {
                                            if (playerFound) {
                                                playerFound.setClub(club);
                                                club.addPlayers(playerFound);
                                                doctor.addPlayers(playerFound);                                       
                                            } else {
                                                Player.create({ playerName: queryItems[i] }).then((player) => {
                                                    player.setClub(club);
                                                    club.addPlayer(player);
                                                    doctor.addPlayers(player);
                                                });                                        
                                            };
                                        });
                                    };
                                };    
                            });
                        };
                    });
                });
            }
        });
    }
}
