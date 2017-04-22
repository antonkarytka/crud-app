const dnode = require('dnode');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const d = dnode.connect(8080);

d.on('remote', (remote) => {
    function startDialog() {
        let query = [];
        rl.question('\nWhat would you like to do?\n1) CREATE\n2) READ\n3) UPDATE\n4) DELETE\n\n0 - EXIT\n\n', (answer) => {
            switch (answer) {
                // CREATE
                case '1':
                    rl.question('Who would you like to create - club(1), player(2) or doctor(3)?\n', (entity) => {
                        switch (entity) {
                            case '1': {
                                createClub(remote);
                                break;
                            }
                            case '2': {
                                createPlayer(remote);
                                break;
                            }
                            case '3': {
                                createDoctor(remote);
                                break;
                            }
                            default: {
                                console.log('Choose one of the above options, please.');
                                startDialog();
                                break;
                            }
                        }
                    });
                    break;

                // READ
                case '2':
                    rl.question('Who would you like to read - club(1), player(2) or doctor(3)?\n', (entity) => {
                        switch (entity) {
                            case '1': {
                                readClub(remote);
                                break;
                            }
                            case '2': {
                                readPlayer(remote);
                                break;
                            }
                            case '3': {
                                readDoctor(remote);
                                break;
                            }
                            default: {
                                console.log('Choose one of the above options, please.');
                                startDialog();
                                break;
                            }
                        }
                    });
                    break;

                // UPDATE
                case '3':
                    rl.question('What FIELD would you like to update - club(1), player(2) or doctor(3)?\n', (entity) => {
                        switch (entity) {
                            case '1': {
                                updateClub(remote);
                                break;
                            }
                            case '2': {
                                updatePlayer(remote);
                                break;
                            }
                            case '3': {
                                updateDoctor(remote);
                                break;
                            }
                            default: {
                                console.log('Choose one of the above options, please.');
                                startDialog();
                                break;
                            }
                        }
                    });
                    break;

                // DELETE
                case '4':
                    rl.question('Who would you like to delete - club(1), player(2) or doctor(3)?\n', (entity) => {
                        switch (entity) {
                            case '1': {
                                deleteClub(remote);
                                break;
                            }
                            case '2': {
                                deletePlayer(remote);
                                break;
                            }
                            case '3': {
                                deleteDoctor(remote);
                                break;
                            }
                            default: {
                                console.log('Choose one of the above options, please.');
                                startDialog();
                                break;
                            }
                        }
                    });
                    break;

                case '0': {
                    console.log('Bye!');
                    process.exit();
                }

                default: {
                    console.log('Choose one of the above options, please.');
                    startDialog();
                }
            };
        });
    };

    startDialog();


    function createClub(remote) {
        let query = [];
        remote.showClubs(clubs => {
            console.log(clubs);
            rl.question('What is the name of the CLUB you\'d like to create? ', clubName => {
                if (clubName.match(/[a-zA-Z0-9]/i)) {
                    query.push(clubName);
                    remote.createClub(JSON.stringify(query), result => {
                        console.log(result);
                        startDialog();
                    });
                } else {
                    console.log('Club\'s name must contain letters. Please, try again.');
                    startDialog();
                };
            });
        });
    };

    function createPlayer(remote) {
        let query = [];
        remote.showPlayers((players) => {
            console.log(players);
            rl.question('What is the name of the PLAYER you\'d like to create? ', (playerName) => {
                if (playerName.match(/[a-zA-Z]/i)) {
                    query.push(playerName);
                    rl.question(`Does ${playerName} work with any doctors? (y/n) `, (choice) => {
                        switch (choice) {
                            case 'y':
                            enterDoctor();
                            break;
                            case 'n':
                            enterClub();
                            break;
                            default:
                            enterClub();
                        };
                    });
                } else {
                    console.log('Player\'s name must contain letters. Please, try again.');
                    startDialog();
                };

                function enterDoctor() {
                    rl.question(`What is the name of the DOCTOR who works with ${playerName}? `, (doctorName) => {
                        if (doctorName.match(/[a-zA-Z]/i)) {
                            query.push(doctorName);
                            rl.question(`Any other DOCTORS who work with ${playerName}? (y/n) `, (choice) => {
                                switch (choice) {
                                    case 'y': {
                                        enterDoctor(query, playerName);
                                        break;
                                    }
                                    case 'n': {
                                        enterClub(query, playerName);
                                        break;
                                    }
                                    default:
                                    enterClub();
                                };
                            });
                        } else {
                            console.log('Doctor\'s name must contain letters. Please, try again.');
                            enterDoctor();
                        };
                    });
                };
                function enterClub() {
                    rl.question(`What is the name of the CLUB ${playerName} plays for? `, (clubName) => {
                        if (clubName.match(/[a-zA-Z0-9]/i)) {
                            query.push(clubName);
                            remote.createPlayer(JSON.stringify(query), result => {
                                console.log(result);
                                startDialog();
                            });
                        } else {
                            console.log('Club\'s name must contain letters. Please, try again.');
                            enterClub();
                        };
                    });
                };
            });
        });
    };

    function createDoctor(remote) {
        let query = [];
        remote.showDoctors((doctors) => {
            console.log(doctors);
            rl.question('What is the name of the DOCTOR you\'d like to create? ', (doctorName) => {
                if (doctorName.match(/[a-zA-Z]/i)) {
                    query.push(doctorName);
                    rl.question(`Does ${doctorName} work with any players? (y/n) `, (choice) => {
                        switch (choice) {
                            case 'y':
                            enterPlayer();
                            break;
                            case 'n':
                            enterClub();
                            break;
                            default:
                            enterClub();
                        };
                    });
                } else {
                    console.log('Doctor\'s name must contain letters. Please, try again.');
                    startDialog();
                }
                function enterPlayer() {
                    rl.question(`What is the name of the PLAYER who works with ${doctorName}? `, (playerName) => {
                        if (playerName.match(/[a-zA-Z]/i)) {
                            query.push(playerName);
                            rl.question(`Any other PLAYERS who work with ${doctorName}? (y/n) `, (choice) => {
                                switch (choice) {
                                    case 'y':
                                    enterPlayer();
                                    break;
                                    case 'n':
                                    enterClub();
                                    break;
                                    default:
                                    enterClub();
                                }
                            });
                        } else {
                            console.log('Player\'s name must contain letters. Please, try again.');
                            enterPlayer();
                        }
                    });
                };
                function enterClub() {
                    rl.question(`What is the name of the CLUB ${doctorName} works for? `, (clubName) => {
                        if (clubName.match(/[a-zA-Z0-9]/i)) {
                            query.push(clubName);
                            remote.createDoctor(JSON.stringify(query), result => {
                                console.log(result);
                                startDialog();
                            });
                        } else {
                            console.log('Club\'s name must contain letters. Please, try again.');
                            enterClub();
                        }
                    });
                };
            });
        });
    };

    function readClub(remote) {
        remote.showClubs((clubs) => {
            console.log(clubs);
            rl.question('What is the name of the CLUB you\'d like to read? ', (clubName) => {
                remote.readClub(JSON.stringify(clubName), (clubInfo) => {
                    if (clubInfo != 'error') {
                        console.log(clubInfo);
                    } else {
                        console.log(`${clubName} does not exist. Please, create it first.`);
                    };
                    startDialog();
                });
            });
        });
    };

    function readPlayer(remote) {
        remote.showPlayers((players) => {
            console.log(players);
            rl.question('What is the name of the PLAYER you\'d like to read? ', (playerName) => {
                remote.readPlayer(JSON.stringify(playerName), (playerInfo) => {
                    if (playerInfo != 'error') {
                        console.log(playerInfo);
                    } else {
                        console.log(`${playerName} does not exist. Please, create him first.`);
                    };
                    startDialog();
                });
            });
        });
    };

    function readDoctor(remote) {
        remote.showDoctors((doctors) => {
            console.log(doctors);
            rl.question('What is the name of the DOCTOR you\'d like to read? ', (doctorName) => {
                remote.readDoctor(JSON.stringify(doctorName), (doctorInfo) => {
                    if (doctorInfo != 'error') {
                        console.log(doctorInfo);
                    } else {
                        console.log(`${doctorName} does not exist. Please, create it first.`);
                    }
                    startDialog();
                });
            });
        });
    };

    function updateClub(remote) {
        let query = [];
        remote.showClubs((clubs) => {
            console.log(clubs);
            rl.question('Whose club would you like to update - player\'s(1) or doctor\'s(2)? ', (choice) => {
                switch (choice) {
                    case '1': {
                        query.push('player');
                        remote.showPlayers(players => {
                            console.log(players);
                            rl.question('What is the name of the player whose club you\'d like to update? ', (playerName) => {
                                query.push(playerName);
                                remote.readPlayer(JSON.stringify(playerName), (playerInfo) => {
                                    if (playerInfo != 'error') {
                                        console.log(playerInfo);
                                        rl.question(`New club for ${playerName}: `, (newClubName) => {
                                            query.push(newClubName);
                                            remote.updateClub(JSON.stringify(query), result => {
                                                console.log(result);
                                                startDialog();
                                            });
                                        });
                                    } else {
                                        console.log(`${playerName} does not exist. Please, create him first.`);
                                        startDialog();
                                    }
                                });
                            });
                        });
                        break;
                    }
                    case '2': {
                        query.push('doctor');
                        remote.showDoctors(doctors => {
                            console.log(doctors);
                            rl.question('What is the name of the doctor whose club you\'d like to update? ', (doctorName) => {
                                query.push(doctorName);
                                remote.readDoctor(JSON.stringify(doctorName), (doctorInfo) => {
                                    if (doctorInfo != 'error') {
                                        console.log(doctorInfo);
                                        rl.question(`New club for ${doctorName}: `, (newClubName) => {
                                            query.push(newClubName);
                                            remote.updateClub(JSON.stringify(query), result => {
                                                console.log(result);
                                                startDialog();
                                            });
                                        });
                                    } else {
                                        console.log(`${doctorName} does not exist. Please, create him first.`);
                                        startDialog();
                                    }
                                });
                            });
                        });
                        break;
                    }
                    default:
                        startDialog();
                        break;
                }
            });
        });
    };

    function updatePlayer(remote) {
        let query = [];
        remote.showDoctors(doctors => {
            console.log(doctors);
            rl.question('What is the name of the DOCTOR whose players list you\'d like to update? ', (doctorName) => {
                remote.readDoctor(JSON.stringify(doctorName), doctorInfo => {
                    if (doctorInfo != 'error') {
                        query.push(doctorName);
                        console.log(doctorInfo);
                        rl.question(`Would you like to add(1) or delete(2) a player to/from ${doctorName}\'s players list? `, choice => {
                            switch (choice) {
                                case '1': {
                                    query.push('add');
                                    rl.question(`What is the name of the player you\'d like to add to ${doctorName}\'s players list? `, playerName => {
                                        remote.readPlayer(JSON.stringify(playerName), playerInfo => {
                                            if (playerInfo != 'error') {
                                                query.push(playerName);
                                                remote.updatePlayer(JSON.stringify(query), result => {
                                                    console.log(result);
                                                    startDialog();
                                                });
                                            } else {
                                                console.log(`${playerName} does not exist. Please, create him first.`);
                                                startDialog();
                                            }
                                        });
                                    });
                                    break;
                                }
                                case '2': {
                                    query.push('delete');
                                    rl.question(`What is the name of the player you\'d like to delete from ${doctorName}\'s players list? `, playerName => {
                                        remote.readPlayer(JSON.stringify(playerName), playerInfo => {
                                            if (playerInfo != 'error') {
                                                query.push(playerName);
                                                remote.updatePlayer(JSON.stringify(query), result => {
                                                    console.log(result);
                                                    startDialog();
                                                });
                                            } else {
                                                console.log(`${playerName} does not exist. Please, create him first.`);
                                                startDialog();
                                            }
                                        });
                                    });
                                    break;
                                }
                                default:
                                    startDialog();
                                    break;
                            }
                        });
                    } else {
                        console.log(`${doctorName} does not exist. Please, create him first.`);
                        startDialog();
                    }
                });
            });
        });
    };

    function updateDoctor(remote) {
        let query = [];
        remote.showPlayers(players => {
            console.log(players);
            rl.question('What is the name of the PLAYER whose doctors list you\'d like to update? ', (playerName) => {
                remote.readPlayer(JSON.stringify(playerName), playerInfo => {
                    if (playerInfo != 'error') {
                        query.push(playerName);
                        console.log(playerInfo);
                        rl.question(`Would you like to add(1) or delete(2) a doctor to/from ${playerName}\'s doctors list? `, choice => {
                            switch (choice) {
                                case '1': {
                                    query.push('add');
                                    rl.question(`What is the name of the doctor you\'d like to add to ${playerName}\'s doctors list? `, doctorName => {
                                        remote.readDoctor(JSON.stringify(doctorName), doctorInfo => {
                                            if (doctorInfo != 'error') {
                                                query.push(doctorName);
                                                remote.updateDoctor(JSON.stringify(query), result => {
                                                    console.log(result);
                                                    startDialog();
                                                });
                                            } else {
                                                console.log(`${doctorName} does not exist. Please, create him first.`);
                                                startDialog();
                                            }
                                        });
                                    });
                                    break;
                                }
                                case '2': {
                                    query.push('delete');
                                    rl.question(`What is the name of the doctor you\'d like to delete from ${playerName}\'s doctors list? `, doctorName => {
                                        remote.readDoctor(JSON.stringify(doctorName), doctorInfo => {
                                            if (doctorInfo != 'error') {
                                                query.push(doctorName);
                                                remote.updateDoctor(JSON.stringify(query), result => {
                                                    console.log(result);
                                                    startDialog();
                                                });
                                            } else {
                                                console.log(`${doctorName} does not exist. Please, create him first.`);
                                                startDialog();
                                            }
                                        });
                                    });
                                    break;
                                }
                                default:
                                    startDialog();
                                    break;
                            }
                        });
                    } else {
                        console.log(`${doctorName} does not exist. Please, create him first.`);
                        startDialog();
                    }
                });
            });
        });
    };

    function deleteClub(remote) {
        remote.showClubs((clubs) => {
            console.log(clubs);
            rl.question('What is the name of the CLUB you\'d like to delete? ', (clubName) => {
                remote.deleteClub(JSON.stringify(clubName), result => {
                    console.log(result);
                    startDialog();
                });
            });
        });
    };

    function deletePlayer(remote) {
        remote.showPlayers((players) => {
            console.log(players);
            rl.question('What is the name of the PLAYER you\'d like to delete? ', (playerName) => {
                remote.deletePlayer(JSON.stringify(playerName), result => {
                    console.log(result);
                    startDialog();
                });
            });
        });
    };

    function deleteDoctor(remote) {
        remote.showDoctors((doctors) => {
            console.log(doctors);
            rl.question('What is the name of the DOCTOR you\'d like to delete? ', (doctorName) => {
                remote.deleteDoctor(JSON.stringify(doctorName), result => {
                    console.log(result);
                    startDialog();
                });
            });
        });
    };
});
