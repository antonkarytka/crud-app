const Sequelize = require('sequelize');

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

module.exports.Club = Club;
module.exports.Player = Player;
module.exports.Doctor = Doctor;
