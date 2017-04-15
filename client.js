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
                                        if (clubName.match(/[a-zA-Z0-9]/i)) {
                                            query.push(clubName);
                                            remote.createClub(JSON.stringify(query));
                                            startDialog();
                                        } else {
                                            console.log('Club\'s name must contain letters. Please, try again.');
                                            startDialog();
                                        };
                                    });
                                });
                                break;
                            }
                            case 'player': {
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
                                                } else {
                                                    console.log('Doctor\'s name must contain letters. Please, try again.');
                                                    enterDoctor(); 
                                                }
                                            });
                                        };
                                        function enterClub() {
                                            rl.question(`What is the name of the CLUB ${playerName} plays for? `, (clubName) => {
                                                if (clubName.match(/[a-zA-Z0-9]/i)) {
                                                    query.push(clubName);
                                                    remote.createPlayer(JSON.stringify(query));
                                                    startDialog();
                                                } else {
                                                    console.log('Club\'s name must contain letters. Please, try again.');
                                                    enterClub();               
                                                }
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
                                                    remote.createDoctor(JSON.stringify(query));
                                                    startDialog();
                                                } else {
                                                    console.log('Club\'s name must contain letters. Please, try again.');
                                                    enterClub();                                                      
                                                }
                                            });
                                        };
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
                                        remote.checkClubExistence(JSON.stringify(clubName), (result) => {
                                            if (result == 'exists') {
                                                remote.readClub(JSON.stringify(clubName), (result) => {
                                                    console.log(result);
                                                    startDialog();
                                                });
                                            } else {
                                                console.log(`${clubName} does not exist. You should create it first.`);
                                                startDialog();
                                            };
                                        });
                                    });
                                });
                                break;
                            }
                            case 'player': {
                                remote.showPlayers((players) => {
                                    console.log(players);
                                    rl.question('What is the name of the PLAYER you\'d like to read? ', (playerName) => {
                                        remote.checkPlayerExistence(JSON.stringify(playerName), (result) => {
                                            if (result == 'exists') {
                                                remote.readPlayer(JSON.stringify(playerName), (result) => {
                                                    console.log(result);
                                                    startDialog();
                                                });
                                            } else {
                                                console.log(`${playerName} does not exist. You should create him first.`);
                                                startDialog();
                                            };
                                        });
                                    });
                                });
                                break;
                            }
                            case 'doctor': {
                                remote.showDoctors((doctors) => {
                                    console.log(doctors);
                                    rl.question('What is the name of the DOCTOR you\'d like to read? ', (doctorName) => {
                                        remote.checkDoctorExistence(JSON.stringify(doctorName), (result) => {
                                            if (result == 'exists') {
                                                remote.readDoctor(JSON.stringify(doctorName), (result) => {
                                                    console.log(result);
                                                    startDialog();
                                                });
                                            } else {
                                                console.log(`${doctorName} does not exist. You should create him first.`);
                                                startDialog();
                                            };
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
                                            if (result == 'exists') {
                                                query.push(clubName);
                                                rl.question(`New name: `, (newClubName) => {
                                                    if ((newClubName != clubName) && (newClubName.match(/[a-zA-Z0-9]/i))) {                                                   
                                                        query.push(newClubName);
                                                        remote.updateClub(JSON.stringify(query));
                                                        startDialog();
                                                    } else {
                                                        console.log('New name must contain letters and can not be the same as the old one. Please, try again.');
                                                        startDialog();
                                                    };
                                                });
                                            } else {
                                                console.log(`${clubName} does not exist. You should create it first.`);
                                                startDialog();
                                            }
                                        });
                                    });
                                });
                                break;
                            }
                            case 'player': {
                                remote.showPlayers((players) => {
                                    console.log(players);
                                    rl.question('What is the name of the PLAYER you\'d like to update? ', (playerName) => {
                                        remote.checkPlayerExistence(JSON.stringify(playerName), (result) => {
                                            if (result == 'exists') {
                                                query.push(playerName);
                                                rl.question(`New name: `, (newPlayerName) => {
                                                    if ((newPlayerName != playerName) && (newPlayerName.match(/[a-zA-Z0-9]/i))) {                                                   
                                                        query.push(newPlayerName);
                                                        remote.updatePlayer(JSON.stringify(query));
                                                        startDialog();
                                                    } else {
                                                        console.log('New name must contain letters and can not be the same as the old one. Please, try again.');
                                                        startDialog();
                                                    };
                                                });
                                            } else {
                                                console.log(`${playerName} does not exist. You should create it first.`);
                                                startDialog();
                                            }
                                        });
                                    });
                                });
                                break;
                            }
                            case 'doctor': {
                                remote.showDoctors((doctors) => {
                                    console.log(doctors);
                                    rl.question('What is the name of the DOCTOR you\'d like to update? ', (doctorName) => {
                                        remote.checkDoctorExistence(JSON.stringify(doctorName), (result) => {
                                            if (result == 'exists') {
                                                query.push(doctorName);
                                                rl.question(`New name: `, (newDoctorName) => {
                                                    if ((newDoctorName != doctorName) && (newDoctorName.match(/[a-zA-Z0-9]/i))) {                                                   
                                                        query.push(newDoctorName);
                                                        remote.updateDoctor(JSON.stringify(query));
                                                        startDialog();
                                                    } else {
                                                        console.log('New name must contain letters and can not be the same as the old one. Please, try again.');
                                                        startDialog();
                                                    };
                                                });
                                            } else {
                                                console.log(`${clubName} does not exist. You should create it first.`);
                                                startDialog();
                                            }
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

