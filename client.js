const dnode = require('dnode');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const d = dnode.connect(8080);

d.on('remote', (remote) => {
    function startDialog() {
        rl.question('\nWhat would you like to do with an entity?\n1) CREATE\n2) READ\n3) UPDATE\n4) DELETE\n\n0 - EXIT\n\n', (answer) => {
            switch (answer) {
                case '1':
                    let query = [];
                    rl.question('Who would you like to create? (club, player, doctor)\n', (entity) => {
                        switch (entity) {
                            case 'club': {
                                rl.question('What is the name of the CLUB you\'d like to create? ', (clubName) => {
                                    query.push(clubName);
                                    remote.createClub(JSON.stringify(query));
                                    startDialog();
                                });
                                break;
                            }
                            case 'player': {
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
                                break;
                            }
                            case 'doctor': {
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
                                            remote.createdoctor(JSON.stringify(query));
                                            startDialog();
                                        });
                                    }
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

                case '2':
                    rl.question('Which entity/object would you like to read? Example: players,object (optional)\n', (query) => {
                        remote.read(JSON.stringify(query), () => {});
                        startDialog();
                    });
                    break;

                case '3':
                    rl.question('Which entity, object and field would you like to update? Example: players,Diego Costa,doctors,newValue\n', (query) => {
                        remote.update(JSON.stringify(query), () => {});
                        startDialog();
                    });
                    break;

                case '4':
                    rl.question('Which entity/object/field would you like to delete? Example: players,Diego Costa (optional),field (optional)\n', (query) => {
                        remote.delete(JSON.stringify(query), () => {});
                        startDialog();
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
