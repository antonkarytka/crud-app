const orm = require('../../orm/orm.js');
const Club = orm.Club;
const Player = orm.Player;
const Doctor = orm.Doctor;

module.exports = {
    club : async(query) => {
        let queryItems = JSON.parse(query);
        let clubName = queryItems[0];
        let clubFound = await Club.find({ where: { clubName: clubName } });
        if (clubFound) {
            return `Club "${clubName}" already exists!`;
        } else {
            club = await Club.create({ clubName: clubName });
            return `Club "${clubName}" has been created successfully!`;
        };
    },

    player : async(query) => {
        let queryItems = JSON.parse(query);
        let playerName = queryItems[0];
        let clubName = queryItems[queryItems.length - 1];
        let clubFound = await Club.find({ where: { clubName: clubName } });
        if (clubFound) {
            let playerFound = await Player.find({ where: { playerName: playerName } });
            if (playerFound) {
                await playerFound.setClub(clubFound);
                await clubFound.addPlayer(playerFound);
                if (queryItems.length > 2) {
                    for (let i = 1; i < queryItems.length - 1; i++) {
                        let doctorFound = await Doctor.find({ where: { doctorName: queryItems[i] }});
                        if (doctorFound) {
                            await doctorFound.setClub(clubFound);
                            await clubFound.addDoctor(doctorFound);
                            await playerFound.addDoctor(doctorFound);
                        } else {
                            let doctor = await Doctor.create({ doctorName: queryItems[i] });
                            await doctor.setClub(clubFound);
                            await clubFound.addDoctor(doctorFound);
                            await playerFound.addDoctor(doctorFound);
                        };
                    };
                };
                return `Player ${playerName} already exists, but necessary references have been added!`;
            } else {
                let player = await Player.create({ playerName: playerName });
                await player.setClub(clubFound);
                await clubFound.addPlayer(player);
                if (queryItems.length > 2) {
                    for (let i = 1; i < queryItems.length - 1; i++) {
                        let doctorFound = await Doctor.find({ where: { doctorName: queryItems[i] }});
                        if (doctorFound) {
                            await doctorFound.setClub(clubFound);
                            await clubFound.addDoctor(doctorFound);
                            await player.addDoctor(doctorFound);
                        } else {
                            let doctor = await Doctor.create({ doctorName: queryItems[i] });
                            await doctor.setClub(clubFound);
                            await clubFound.addDoctor(doctor);
                            await player.addDoctor(doctor);
                        };
                    };
                };
                return `Player ${playerName} has been created successfully!`;
            };
        } else {
            let club = await Club.create({ clubName: clubName });
            let playerFound = await Player.find({ where: { playerName: playerName } });
            if (playerFound) {
                await playerFound.setClub(club);
                await club.addPlayer(playerFound);
                if (queryItems.length > 2) {
                    for (let i = 1; i < queryItems.length - 1; i++) {
                        let doctorFound = await Doctor.find({ where: { doctorName: queryItems[i] }});
                        if (doctorFound) {
                            await doctorFound.setClub(club);
                            await club.addDoctor(doctorFound);
                            await playerFound.addDoctor(doctorFound);
                        } else {
                            let doctor = await Doctor.create({ doctorName: queryItems[i] });
                            await doctor.setClub(club);
                            await club.addDoctor(doctorFound);
                            await playerFound.addDoctor(doctorFound);
                        };
                    };
                };
                return `Club "${clubName}" has been created successfully! Player ${playerName} already exists, but all necessary references have been added!`;
            } else {
                let player = await Player.create({ playerName: playerName });
                await player.setClub(club);
                await club.addPlayer(player);
                if (queryItems.length > 2) {
                    for (let i = 1; i < queryItems.length - 1; i++) {
                        let doctorFound = await Doctor.find({ where: { doctorName: queryItems[i] }});
                        if (doctorFound) {
                            await doctorFound.setClub(club);
                            await club.addDoctor(doctorFound);
                            await player.addDoctor(doctorFound);
                        } else {
                            let doctor = await Doctor.create({ doctorName: queryItems[i] });
                            await doctor.setClub(club);
                            await club.addDoctor(doctor);
                            await player.addDoctor(doctor);
                        };
                    };
                };
                return `Club "${clubName}" and player ${playerName} have been created successfully!`;
            };
        };
    },

    doctor : async(query) => {
        let queryItems = JSON.parse(query);
        let doctorName = queryItems[0];
        let clubName = queryItems[queryItems.length - 1];
        let clubFound = await Club.find({ where: { clubName: clubName } });
        if (clubFound) {
            let doctorFound = await Doctor.find({ where: { doctorName: doctorName } });
            if (doctorFound) {
                await doctorFound.setClub(clubFound);
                await clubFound.addDoctor(doctorFound);
                if (queryItems.length > 2) {
                    for (let i = 1; i < queryItems.length - 1; i++) {
                        let playerFound = await Player.find({ where: { playerName: queryItems[i] }});
                        if (playerFound) {
                            await playerFound.setClub(clubFound);
                            await clubFound.addPlayer(playerFound);
                            await doctorFound.addPlayer(playerFound);
                        } else {
                            let player = await Player.create({ playerName: queryItems[i] });
                            await player.setClub(clubFound);
                            await clubFound.addPlayer(player);
                            await doctorFound.addPlayer(player);
                        };
                    };
                };
                return `Doctor ${doctorName} already exists, but necessary references have been added!`;
            } else {
                let doctor = await Doctor.create({ doctorName: doctorName });
                await doctor.setClub(clubFound);
                await clubFound.addDoctor(doctor);
                if (queryItems.length > 2) {
                    for (let i = 1; i < queryItems.length - 1; i++) {
                        let playerFound = await Player.find({ where: { playerName: queryItems[i] }});
                        if (playerFound) {
                            await playerFound.setClub(clubFound);
                            await clubFound.addPlayer(playerFound);
                            await doctor.addPlayer(playerFound);
                        } else {
                            let player = await Player.create({ playerName: queryItems[i] });
                            await player.setClub(clubFound);
                            await clubFound.addPlayer(player);
                            await doctor.addPlayer(player);
                        };
                    };
                };
                return `Doctor ${doctorName} has been created successfully!`;
            };
        } else {
            let club = await Club.create({ clubName: clubName });
            let doctorFound = await Doctor.find({ where: { doctorName: doctorName } });
            if (doctorFound) {
                await doctorFound.setClub(club);
                await club.addDoctor(doctorFound);
                if (queryItems.length > 2) {
                    for (let i = 1; i < queryItems.length - 1; i++) {
                        let playerFound = await Player.find({ where: { playerName: queryItems[i] }});
                        if (playerFound) {
                            await playerFound.setClub(club);
                            await club.addPlayer(playerFound);
                            await doctorFound.addPlayer(playerFound);
                        } else {
                            let player = await Player.create({ playerName: queryItems[i] });
                            await player.setClub(club);
                            await club.addPlayer(player);
                            await doctorFound.addPlayer(player);
                        };
                    };
                };
                return `Club "${clubName}" has been created successfully! Doctor ${doctorName} already exists, but all necessary references have been added!`;
            } else {
                let doctor = await Doctor.create({ doctorName: doctorName });
                await doctor.setClub(club);
                await club.addDoctors(doctor);
                if (queryItems.length > 2) {
                    for (let i = 1; i < queryItems.length - 1; i++) {
                        let playerFound = await Player.find({ where: { playerName: queryItems[i] }});
                        if (playerFound) {
                            await playerFound.setClub(club);
                            await club.addPlayer(playerFound);
                            await doctor.addPlayer(playerFound);
                        } else {
                            let player = await Player.create({ playerName: queryItems[i] });
                            await player.setClub(club);
                            await club.addPlayer(player);
                            await doctor.addPlayer(player);
                        };
                    };
                };
                return `Club "${clubName}" and doctor ${doctorName} have been created successfully!`;
            };
        };
    }
}
