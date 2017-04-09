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
                    rl.question('Which table would you like to modify? (CLUB, PLAYERS, THERAPISTS)\n', (table) => {
                        switch (table) {
                            case 'CLUB': {
                                rl.question('What is the name of the CLUB you\'d like to add? ', (clubName) => {
                                    query.push(clubName);
                                    remote.createClub(JSON.stringify(query));
                                    startDialog();
                                });
                                break;
                            }
                            case 'PLAYERS': {
                                rl.question('What is the name of the PLAYER you\'d like to add? ', (playerName) => {
                                    query.push(playerName);
                                    enterTherapist();
                                    function enterTherapist() {
                                        rl.question(`What is the name of the THERAPIST who works with ${playerName}? `, (therapistName) => {
                                            query.push(therapistName);
                                            rl.question(`Any other THERAPISTS who work with ${playerName}? (y/n) `, (choice) => {
                                                switch (choice) {
                                                    case 'y':
                                                        enterTherapist();
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
                            case 'THERAPISTS': {
                                rl.question('What is the name of the THERAPIST you\'d like to add? ', (therapistName) => {
                                    query.push(therapistName);
                                    enterPlayer();
                                    function enterPlayer() {
                                        rl.question(`What is the name of the PLAYER who works with ${therapistName}? `, (therapistName) => {
                                            query.push(therapistName);
                                            rl.question(`Any other PLAYERS who work with ${therapistName}? (y/n) `, (choice) => {
                                                switch (choice) {
                                                    case 'y':
                                                        enterTherapist();
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
                                        rl.question(`What is the name of the CLUB ${therapistName} works for? `, (clubName) => {
                                            query.push(clubName);
                                            remote.createTherapist(JSON.stringify(query));
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
                    rl.question('Which entity, object and field would you like to update? Example: players,Diego Costa,therapists,newValue\n', (query) => {
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
