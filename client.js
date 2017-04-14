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
        rl.question('\nWhat would you like to do with an entity?\n1) CREATE\n2) READ\n3) UPDATE\n4) DELETE\n\n0 - EXIT\n\n', (answer) => {
            switch (answer) {
                // CREATE
                case '1':
                    rl.question('Who would you like to create? (club, player, doctor)\n', (entity) => {
                        switch (entity) {
                            case 'club': {
                                remote.showClubs((clubs) => {
                                    console.log(clubs);
                                    rl.question('What is the name of the CLUB you\'d like to create? ', (clubName) => {
                                        query.push(clubName);
                                        remote.createClub(JSON.stringify(query));
                                        startDialog();
                                    });
                                });
                                break;
                            }
                            case 'player': {
                                remote.showPlayers((players) => {
                                    console.log(players);
                                    rl.question('What is the name of the PLAYER you\'d like to create? ', (playerName) => {
                                        query.push(playerName);
                                        enterDoctor();
                                        function enterDoctor() {
                                            rl.question(`What is the name of the DOCTOR who works with ${playerName}? `, (doctorName) => {
                                                query.push(doctorName);
                                                rl.question(`Any other DOCTORS who work with ${playerName}? (y/n) `, (choice) => {
                                                    switch (choice) {
                                                        case 'y':
                                                        enterDoctor();
                                                        break;
                                                        case 'n':
                                                        enterClub();
                                                        break;
                                                        default:
                                                        enterClub();
                                                    }
                                                });
                                            });
                                        };
                                        function enterClub() {
                                            rl.question(`What is the name of the CLUB ${playerName} plays for? `, (clubName) => {
                                                query.push(clubName);
                                                remote.createPlayer(JSON.stringify(query));
                                                startDialog();
                                            });
                                        }
                                    });
                                });
                                break;
                            }
                            case 'doctor': {
                                remote.showDoctors((doctors) => {
                                    console.log(doctors);
                                    rl.question('What is the name of the DOCTOR you\'d like to create? ', (doctorName) => {
                                        query.push(doctorName);
                                        enterPlayer();
                                        function enterPlayer() {
                                            rl.question(`What is the name of the PLAYER who works with ${doctorName}? `, (playerName) => {
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
                                            });
                                        };
                                        function enterClub() {
                                            rl.question(`What is the name of the CLUB ${doctorName} works for? `, (clubName) => {
                                                query.push(clubName);
                                                remote.createDoctor(JSON.stringify(query));
                                                startDialog();
                                            });
                                        }
                                    });
                                });
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
                    rl.question('Who would you like to read? (club, player, doctor)\n', (entity) => {
                        switch (entity) {
                            case 'club': {
                                remote.showClubs((clubs) => {
                                    console.log(clubs);
                                    rl.question('What is the name of the CLUB you\'d like to read? ', (clubName) => {
                                        remote.readClub(JSON.stringify(clubName), (result) => {
                                            console.log(result);
                                            startDialog();
                                        });
                                    });
                                });
                                break;
                            }
                            case 'player': {
                                remote.showPlayers((players) => {
                                    console.log(players);
                                    rl.question('What is the name of the PLAYER you\'d like to read? ', (playerName) => {
                                        remote.readPlayer(JSON.stringify(playerName), (result) => {
                                            console.log(result);
                                            startDialog();
                                        });
                                    });
                                });
                                break;
                            }
                            case 'doctor': {
                                remote.showDoctors((doctors) => {
                                    console.log(doctors);
                                    rl.question('What is the name of the DOCTOR you\'d like to read? ', (doctorName) => {
                                        remote.readDoctor(JSON.stringify(doctorName), (result) => {
                                            console.log(result);
                                            startDialog();
                                        });
                                    });
                                });
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
                    rl.question('Who would you like to update? (club, player, doctor)\n', (entity) => {
                        switch (entity) {
                            case 'club': {
                                remote.showClubs((clubs) => {
                                    console.log(clubs);
                                    rl.question('What is the name of the CLUB you\'d like to update? ', (clubName) => {
                                        remote.checkClubExistence(JSON.stringify(clubName), (result) => {
                                            if (result != 'exists') {
                                                console.log(`${clubName} does not exist. You should create it first.`);
                                                startDialog();
                                            };
                                            query.push(clubName);
                                            rl.question(`New name (${clubName}): `, (newClubName) => {
                                                query.push(newClubName);
                                            });
                                            rl.question('Who would you like to update - players(1) or doctors(2)?', (model) => {
                                                query.push(model);
                                                switch (model) {
                                                    case '1': {
                                                        remote.showPlayers((players) => {
                                                            console.log(players);
                                                            rl.question('Which player would you like to update?', (player) => {
                                                                remote.checkPlayerExistence(JSON.stringify(player), (result) => {
                                                                    if (result != 'exists') {
                                                                        console.log(`${player} does not exist. You should create him first.`);
                                                                        startDialog();
                                                                    };
                                                                    query.push(player);
                                                                    console.log(`${player} info:`);
                                                                    remote.readPlayer(JSON.stringify(player), (playerInfo) => {
                                                                        console.log(playerInfo);

                                                                    });
                                                                });
                                                            });
                                                        });
                                                        break;
                                                    }
                                                    case '2': {

                                                        break;
                                                    }
                                                    default:

                                                }
                                                startDialog();
                                            });
                                        });
                                    });
                                });
                                break;
                            }
                            case 'player': {
                                remote.showPlayers((players) => {
                                    console.log(players);
                                    rl.question('What is the name of the PLAYER you\'d like to update? ', (playerName) => {
                                        query.push(playerName);
                                        rl.question('Who would you like to update - players(1) or doctors(2)?', (model) => {
                                            startDialog();
                                        });
                                    });
                                });
                                break;
                            }
                            case 'doctor': {
                                remote.showDoctors((doctors) => {
                                    console.log(doctors);
                                    rl.question('What is the name of the DOCTOR you\'d like to update? ', (doctorName) => {
                                        query.push(doctorName);
                                        rl.question('Who would you like to update - players(1) or doctors(2)?', (model) => {
                                            startDialog();
                                        });
                                    });
                                });
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
                    rl.question('Who would you like to delete? (club, player, doctor)\n', (entity) => {
                        switch (entity) {
                            case 'club': {
                                remote.showClubs((clubs) => {
                                    console.log(clubs);
                                    rl.question('What is the name of the CLUB you\'d like to delete? ', (clubName) => {
                                        remote.deleteClub(JSON.stringify(clubName));
                                        startDialog();
                                    });
                                });
                                break;
                            }
                            case 'player': {
                                remote.showPlayers((players) => {
                                    rl.question('What is the name of the PLAYER you\'d like to delete? ', (playerName) => {
                                        remote.deletePlayer(JSON.stringify(playerName));
                                        startDialog();
                                    });
                                });
                                break;
                            }
                            case 'doctor': {
                                remote.showDoctors((doctors) => {
                                    rl.question('What is the name of the DOCTOR you\'d like to delete? ', (doctorName) => {
                                        remote.deleteDoctor(JSON.stringify(doctorName));
                                        startDialog();
                                    });
                                });
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


                case '0':
                    console.log('Bye!');
                    process.exit();

                default:
                    console.log('Choose one of the above options, please.');
                    startDialog();
            };
        });
    };

    startDialog();
});
