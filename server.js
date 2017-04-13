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
Doctor.belongsTo(Club);
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
                if (queryItems.length > 3) {
                    for (i = 1; i < queryItems.length - 1; i++) {
                        Doctor.findOrCreate({ where: { doctorName: queryItems[i] } }).spread((doctor) => {
                            doctor.setClub(club);
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
            Doctor.findOrCreate({ where: { doctorName: player } }).spread((doctor) => {
                doctor.setClub(club);
                if (queryItems.length > 3) {
                    for (i = 1; i < queryItems.length - 1; i++) {
                        Player.findOrCreate({ where: { playerName: queryItems[i] } }).spread((player) => {
                            player.setClub(club);
                            doctor.addPlayers(player);
                        });
                    }
                } else {
                    let player = queryItems[1];
                    Player.findOrCreate({ where: { playerName: player } }).spread((player) => {
                        doctor.addPlayers(player);
                    });
                }
            });
        });
    },

    read : (query, cb) => {
        let queryItems = JSON.parse(query).split(', ');
        queryItems.map((string) => { return string.toUpperCase() });
        switch (queryItems.length) {
            case 1: {
                let table = queryItems[0];
                /*cb(db.collection(table).find().forEach( (doc) => {
                    console.log(doc);
                } ));*/
                break;
            }
            case 2: {
                let table = queryItems[0];
                let column = queryItems[1];
                /*cb(db.collection(table).find( { _id: column } ).forEach( (doc) => {
                    console.log(doc);
                } ));*/
                break;
            }
            default:
                break;
        }
    },

    update : (query, cb) => {
        let queryItems = JSON.parse(query).split(', ');
        queryItems.map((string) => { return string.toUpperCase() });
        let table = queryItems[0];
        let column = queryItems[1];
        let value = queryItems[2];
        /*cb(db.collection(table).updateOne(
            { _id: column },
            { $set: { [value]: value } }
        ));*/
        console.log(`${value} value of ${value} value UPDATED spreadfully in ${column} column of ${table} collection!`);
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
    }
});

server.listen(8080, () => { console.log('Server running on 8080...') });

server.on('end', () => {
    db.close();
});
