const dnode = require('dnode');
const Sequelize = require('sequelize');
const path = require('path');

const sequelize = new Sequelize('footballClub.sqlite', null, null, {
    host: 'localhost',
    port: 3000,
    dialect: 'sqlite',
    storage: './footballClub.sqlite'
});

const Club = sequelize.define('club', {
    clubId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    clubName: {
        type: Sequelize.TEXT,
        unique: true
    }
});

const Player = sequelize.define('player', {
    playerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    playerName: {
        type: Sequelize.TEXT,
        unique: true
    }
});

const Doctor = sequelize.define('doctor', {
    doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    doctorName: {
        type: Sequelize.TEXT,
        unique: true
    }
});

Player.belongsTo(Club);
Club.hasMany(Player);
Doctor.belongsTo(Club);
Club.hasMany(Doctor);
Player.belongsToMany(Doctor, {through: 'PlayersDoctors'});
Doctor.belongsToMany(Player, {through: 'PlayersDoctors'});

sequelize.sync();

const server = dnode({
    createClub : (query, cb) => {
        let queryItems = JSON.parse(query);
        let club = queryItems[0];
        Club.findOrCreate({ where: { clubName: club } });
    },

    createPlayer : (query, cb) => {
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

    createDoctor : (query, cb) => {
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
    },

    readClub : (query, cb) => {
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

    readPlayer : (query, cb) => {
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

    readDoctor : (query, cb) => {
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
    },

    updateClub : (query, cb) => {

    },

    updatePlayer : (query, cb) => {

    },

    updateDoctor : (query, cb) => {

    },

    deleteClub : (query, cb) => {
        let club = JSON.parse(query);
        Club.destroy({ where: { clubName: club } });
    },

    deletePlayer : (query, cb) => {
        let player = JSON.parse(query);
        Player.destroy({ where: { playerName: player } });
    },

    deleteDoctor : (query, cb) => {
        let doctor = JSON.parse(query);
        Doctor.destroy({ where: { doctorName: doctor } });
    },

    showClubs : (cb) => {
        let clubsList = 'Existing clubs: ';
        Club.findAll().then((clubs) => {
            if (clubs.length > 0) {
                for (let club of clubs)
                    clubsList += `${club.clubName}, `;
                clubsList = clubsList.slice(0, -2);
            } else {
                clubsList += 'none';
            };
            cb(clubsList);
        });
    },

    showPlayers : (cb) => {
        let playersList = 'Existing players: ';
        Player.findAll().then((players) => {
            if (players.length > 0) {
                for (let player of players)
                    playersList += `${player.playerName}, `;
                playersList = playersList.slice(0, -2);
            } else {
                playersList += 'none';
            };
            cb(playersList);
        });
    },

    showDoctors : (cb) => {
        let doctorsList = 'Existing doctors: ';
        Doctor.findAll().then((doctors) => {
            if (doctors.length > 0) {
                for (let doctor of doctors)
                    doctorsList += `${doctor.doctorName}, `;
                doctorsList = doctorsList.slice(0, -2);
            } else {
                doctorsList += 'none';
            };
            cb(doctorsList);
        });
    },

    checkClubExistence : (query, cb) => {
        let club = JSON.parse(query);
        Club.find({ where: { clubName: club } }).then((club) => {
            if (club)
                cb('exists');
            else
                cb(`${club} does not exist. Please, create it first.`);
        });
    },

    checkPlayerExistence : (query, cb) => {
        let player = JSON.parse(query);
        Club.find({ where: { playerName: player } }).then((player) => {
            if (player)
                cb('exists');
            else
                cb(`${player} does not exist. Please, create him first.`);
        });
    },

    checkDoctorExistence : (query, cb) => {
        let doctor = JSON.parse(query);
        Club.find({ where: { doctorName: doctor } }).then((doctor) => {
            if (doctor)
                cb('exists');
            else
                cb(`${doctor} does not exist. Please, create him first.`);
        });
    }
});

server.listen(8080, () => { console.log('Server running on 8080...') });

server.on('end', () => {
    db.close();
});
