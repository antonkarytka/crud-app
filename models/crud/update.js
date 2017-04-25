const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {
    club : async(query) => {
        let queryItemts = JSON.parse(query);
        let instanceChoice = queryItemts[0];
        let instanceName = queryItemts[1];
        let newClubName = queryItemts[2];
        if (instanceChoice == 'player') {
            let player = await Player.find({ where: { playerName: instanceName }});
            let club = await Club.find({ where: { clubName: newClubName }});
            if (club) {
                await player.setClub(club);
                return `${instanceName}\'s club field was updated successfully!`;
            } else {
                return `${newClubName} does not exist. Please, create it first.`;
            };
        } else {
            let doctor = await Doctor.find({ where: { doctorName: instanceName }});
            let club = await Club.find({ where: { clubName: newClubName }});
            if (club) {
                doctor.setClub(club);
                return `${instanceName}\'s club field was updated successfully!`;
            } else {
                return `${newClubName} does not exist. Please, create it first.`;
            };
        };
    },

    player : async(query) => {
        let queryItemts = JSON.parse(query);
        let doctorName = queryItemts[0];
        let actionChoice = queryItemts[1];
        let playerName = queryItemts[2];
        if (actionChoice == 'add') {
            let doctor = await Doctor.find({ where: { doctorName: doctorName }});
            let player = await Player.find({ where: { playerName: playerName }});
            await doctor.addPlayer(player);
            return `${doctorName}\'s players list updated successfully!`;
        } else {
            let doctor = await Doctor.find({ where: { doctorName: doctorName }});
            let player = await Player.find({ where: { playerName: playerName }});
            let players = await doctor.getPlayers();
            let deletionIndex = players.indexOf(playerName);
            players.splice(deletionIndex, 1);
            await doctor.setPlayers(players);
            return `${doctorName}\'s players list updated successfully!`;
        };
    },

    doctor : async(query) => {
        let queryItemts = JSON.parse(query);
        let playerName = queryItemts[0];
        let actionChoice = queryItemts[1];
        let doctorName = queryItemts[2];
        if (actionChoice == 'add') {
            let player = await Player.find({ where: { playerName: playerName }});
            let doctor = await Doctor.find({ where: { doctorName: doctorName }});
            await player.addDoctor(doctor);
            return `${playerName}\'s doctors list updated successfully!`;
        } else {
            let player = await Player.find({ where: { playerName: playerName }});
            let doctor = await Doctor.find({ where: { doctorName: doctorName }});
            let doctors = await player.getDoctors();
            let deletionIndex = doctors.indexOf(doctorName);
            doctors.splice(deletionIndex, 1);
            await player.setDoctors(doctors);
            return `${playerName}\'s doctors list updated successfully!`;
        };
    }
}
