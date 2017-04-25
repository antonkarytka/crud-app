const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client = new net.Socket();

client.connect(8080, 'localhost', () => {
    console.log('Connection to server established.');
    startDialog();
});

let dataReceived = false;
client.on('data', (data) => {
    dataReceived = true;
    if (data != 'error') {
        console.log(data.toString());
    } else {
        console.log('\nError occured...');
        startDialog();
    }
});

function startDialog() {
    let query = [];
    rl.question('\nWhat would you like to do?\n1) CREATE\n2) READ\n3) UPDATE\n4) DELETE\n\n0 - EXIT\n\n', (answer) => {
        switch (answer) {
            // CREATE
            case '1':
                rl.question('Who would you like to create - club(1), player(2) or doctor(3)?\n', (entity) => {
                    switch (entity) {
                        case '1': {
                            createClub();
                            break;
                        }
                        case '2': {
                            createPlayer();
                            break;
                        }
                        case '3': {
                            createDoctor();
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
                            readClub();
                            break;
                        }
                        case '2': {
                            readPlayer();
                            break;
                        }
                        case '3': {
                            readDoctor();
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
                            updateClub();
                            break;
                        }
                        case '2': {
                            updatePlayer();
                            break;
                        }
                        case '3': {
                            updateDoctor();
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
                            deleteClub();
                            break;
                        }
                        case '2': {
                            deletePlayer();
                            break;
                        }
                        case '3': {
                            deleteDoctor();
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

function createClub() {
    let query = ['showClubs'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                query = ['createClub'];
                rl.question('What is the name of the CLUB you\'d like to create? ', clubName => {
                    if (clubName.match(/[a-zA-Z0-9]/i)) {
                        query.push(clubName);
                        client.write(JSON.stringify(query), () => {
                            let waitForData = setInterval(() => {
                                if (dataReceived) {
                                    clearInterval(waitForData);
                                    dataReceived = false;
                                    startDialog();
                                };
                            }, 100);
                        });
                    } else {
                        console.log('Club\'s name must contain letters. Please, try again.');
                        startDialog();
                    };
                });
            };
        }, 100);
    });
};

function createPlayer() {
    let query = ['showPlayers'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                query = ['createPlayer'];
                rl.question('What is the name of the PLAYER you\'d like to create? ', playerName => {
                    if (playerName.match(/[a-zA-Z]/i)) {
                        query.push(playerName);
                        rl.question(`Does ${playerName} work with any doctors? (y/n) `, choice => {
                            switch (choice) {
                                case 'y': {
                                    enterDoctor();
                                    break;
                                }
                                case 'n': {
                                    enterClub();
                                    break;
                                }
                                default: {
                                    enterClub();
                                }
                            };
                        });
                    } else {
                        console.log('Player\'s name must contain letters. Please, try again.');
                        startDialog();
                    };

                    function enterDoctor() {
                        rl.question(`What is the name of the DOCTOR who works with ${playerName}? `, doctorName => {
                            if (doctorName.match(/[a-zA-Z]/i)) {
                                query.push(doctorName);
                                rl.question(`Any other DOCTORS who work with ${playerName}? (y/n) `, choice => {
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
                        rl.question(`What is the name of the CLUB ${playerName} plays for? `, clubName => {
                            if (clubName.match(/[a-zA-Z0-9]/i)) {
                                query.push(clubName);
                                client.write(JSON.stringify(query), () => {
                                    let waitForData = setInterval(() => {
                                        if (dataReceived) {
                                            clearInterval(waitForData);
                                            dataReceived = false;
                                            startDialog();
                                        };
                                    }, 100);
                                });
                            } else {
                                console.log('Club\'s name must contain letters. Please, try again.');
                                enterClub();
                            };
                        });
                    };
                });
            };
        }, 100);
    });
};

function createDoctor() {
    let query = ['showDoctors'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                query = ['createDoctor'];
                rl.question('What is the name of the DOCTOR you\'d like to create? ', doctorName => {
                    if (doctorName.match(/[a-zA-Z]/i)) {
                        query.push(doctorName);
                        rl.question(`Does ${doctorName} work with any players? (y/n) `, choice => {
                            switch (choice) {
                                case 'y': {
                                    enterPlayer();
                                    break;
                                }
                                case 'n': {
                                    enterClub();
                                    break;
                                }
                                default: {
                                    enterClub();
                                }
                            };
                        });
                    } else {
                        console.log('Doctor\'s name must contain letters. Please, try again.');
                        startDialog();
                    }
                    function enterPlayer() {
                        rl.question(`What is the name of the PLAYER who works with ${doctorName}? `, playerName => {
                            if (playerName.match(/[a-zA-Z]/i)) {
                                query.push(playerName);
                                rl.question(`Any other PLAYERS who work with ${doctorName}? (y/n) `, choice => {
                                    switch (choice) {
                                        case 'y': {
                                            enterPlayer();
                                            break;
                                        }
                                        case 'n': {
                                            enterClub();
                                            break;
                                        }
                                        default: {
                                            enterClub();
                                        }
                                    };
                                });
                            } else {
                                console.log('Player\'s name must contain letters. Please, try again.');
                                enterPlayer();
                            }
                        });
                    };
                    function enterClub() {
                        rl.question(`What is the name of the CLUB ${doctorName} works for? `, clubName => {
                            if (clubName.match(/[a-zA-Z0-9]/i)) {
                                query.push(clubName);
                                client.write(JSON.stringify(query), () => {
                                    let waitForData = setInterval(() => {
                                        if (dataReceived) {
                                            clearInterval(waitForData);
                                            dataReceived = false;
                                            startDialog();
                                        };
                                    }, 100);
                                });
                            } else {
                                console.log('Club\'s name must contain letters. Please, try again.');
                                enterClub();
                            }
                        });
                    };
                });
            }
        }, 100);
    });
};

function readClub() {
    let query = ['showClubs'];
    client.write(JSON.stringify(query), () => {
        query = ['readClub'];
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                rl.question('What is the name of the CLUB you\'d like to read? ', clubName => {
                    query.push(clubName);
                    client.write(JSON.stringify(query), () => {
                        let waitForData = setInterval(() => {
                            if (dataReceived) {
                                clearInterval(waitForData);
                                dataReceived = false;
                                startDialog();
                            };
                        }, 100);
                    });
                });
            };
        }, 100);
    });
};

function readPlayer() {
    let query = ['showPlayers'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                query = ['readPlayer'];
                rl.question('What is the name of the PLAYER you\'d like to read? ', (playerName) => {
                    query.push(playerName);
                    client.write(JSON.stringify(query), () => {
                        let waitForData = setInterval(() => {
                            if (dataReceived) {
                                clearInterval(waitForData);
                                dataReceived = false;
                                startDialog();
                            };
                        }, 100);
                    });
                });
            };
        }, 100);
    });
};

function readDoctor() {
    let query = ['showDoctors'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                query = ['readDoctor'];
                rl.question('What is the name of the DOCTOR you\'d like to read? ', (doctorName) => {
                    query.push(doctorName);
                    client.write(JSON.stringify(query), () => {
                        let waitForData = setInterval(() => {
                            if (dataReceived) {
                                clearInterval(waitForData);
                                dataReceived = false;
                                startDialog();
                            };
                        }, 100);
                    });
                });
            };
        }, 100);
    });
};

function updateClub() {
    let query = ['showClubs'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                rl.question('Whose club would you like to update - player\'s(1) or doctor\'s(2)? ', (choice) => {
                    switch (choice) {
                        case '1': {
                            query = ['showPlayers'];
                            client.write(JSON.stringify(query), () => {
                                let waitForData = setInterval(() => {
                                    if (dataReceived) {
                                        clearInterval(waitForData);
                                        dataReceived = false;
                                        query = ['updateClub'];
                                        query.push('player');
                                        rl.question('What is the name of the player whose club you\'d like to update? ', (playerName) => {
                                            let readQuery = ['readPlayer'];
                                            readQuery.push(playerName);
                                            query.push(playerName);
                                            client.write(JSON.stringify(readQuery), () => {
                                                let waitForData = setInterval(() => {
                                                    if (dataReceived) {
                                                        clearInterval(waitForData);
                                                        dataReceived = false;
                                                        rl.question(`New club for ${playerName}: `, (newClubName) => {
                                                            query.push(newClubName);
                                                            client.write(JSON.stringify(query), () => {
                                                                let waitForData = setInterval(() => {
                                                                    if (dataReceived) {
                                                                        clearInterval(waitForData);
                                                                        dataReceived = false;
                                                                        startDialog();
                                                                    };
                                                                }, 100);
                                                            });
                                                        });
                                                    };
                                                }, 100);
                                            });
                                        });
                                    };
                                });
                            });
                            break;
                        }
                        case '2': {
                            query = ['showDoctors'];
                            client.write(JSON.stringify(query), () => {
                                let waitForData = setInterval(() => {
                                    if (dataReceived) {
                                        clearInterval(waitForData);
                                        dataReceived = false;
                                        query = ['updateClub'];
                                        query.push('doctor');
                                        rl.question('What is the name of the doctor whose club you\'d like to update? ', (doctorName) => {
                                            let readQuery = ['readDoctor'];
                                            readQuery.push(doctorName);
                                            query.push(doctorName);
                                            client.write(JSON.stringify(readQuery), () => {
                                                let waitForData = setInterval(() => {
                                                    if (dataReceived) {
                                                        clearInterval(waitForData);
                                                        dataReceived = false;
                                                        rl.question(`New club for ${doctorName}: `, (newClubName) => {
                                                            query.push(newClubName);
                                                            client.write(JSON.stringify(query), () => {
                                                                let waitForData = setInterval(() => {
                                                                    if (dataReceived) {
                                                                        clearInterval(waitForData);
                                                                        dataReceived = false;
                                                                        startDialog();
                                                                    };
                                                                }, 100);
                                                            });
                                                        });
                                                    };
                                                }, 100);
                                            });
                                        });
                                    };
                                }, 100);
                            });
                            break;
                        }
                        default: {
                            startDialog();
                            break;
                        }
                    };
                });
            };
        }, 100);
    });

};

function updatePlayer() {
    let query = ['showDoctors'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                query = ['updatePlayer'];
                rl.question('What is the name of the DOCTOR whose players list you\'d like to update? ', (doctorName) => {
                    let readQuery = ['readDoctor'];
                    readQuery.push(doctorName);
                    query.push(doctorName);
                    client.write(JSON.stringify(readQuery), () => {
                        let waitForData = setInterval(() => {
                            if (dataReceived) {
                                clearInterval(waitForData);
                                dataReceived = false;
                                rl.question(`Would you like to add(1) or delete(2) a player to/from ${doctorName}\'s players list? `, choice => {
                                    switch (choice) {
                                        case '1': {
                                            query.push('add');
                                            rl.question(`What is the name of the player you\'d like to add to ${doctorName}\'s players list? `, playerName => {
                                                readQuery = ['readPlayer'];
                                                readQuery.push(playerName);
                                                query.push(playerName);
                                                client.write(JSON.stringify(readQuery), () => {
                                                    let waitForData = setInterval(() => {
                                                        if (dataReceived) {
                                                            clearInterval(waitForData);
                                                            dataReceived = false;
                                                            client.write(JSON.stringify(query), () => {
                                                                let waitForData = setInterval(() => {
                                                                    if (dataReceived) {
                                                                        clearInterval(waitForData);
                                                                        dataReceived = false;
                                                                        startDialog();
                                                                    };
                                                                }, 100);
                                                            });
                                                        };
                                                    }, 100);
                                                });
                                            });
                                            break;
                                        }
                                        case '2': {
                                            query.push('delete');
                                            rl.question(`What is the name of the player you\'d like to delete from ${doctorName}\'s players list? `, playerName => {
                                                readQuery = ['readPlayer'];
                                                readQuery.push(playerName);
                                                query.push(playerName);
                                                client.write(JSON.stringify(readQuery), () => {
                                                    let waitForData = setInterval(() => {
                                                        if (dataReceived) {
                                                            clearInterval(waitForData);
                                                            dataReceived = false;
                                                            client.write(JSON.stringify(query), () => {
                                                                let waitForData = setInterval(() => {
                                                                    if (dataReceived) {
                                                                        clearInterval(waitForData);
                                                                        dataReceived = false;
                                                                        startDialog();
                                                                    }
                                                                }, 100);
                                                            });
                                                        };
                                                    }, 100);
                                                });
                                            });
                                            break;
                                        }
                                        default: {
                                            startDialog();
                                            break;
                                        }
                                    }
                                });
                            };
                        }, 100);
                    });
                });
            };
        }, 100);
    });
};

function updateDoctor() {
    let query = ['showPlayers'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                query = ['updateDoctor'];
                rl.question('What is the name of the PLAYER whose doctors list you\'d like to update? ', (playerName) => {
                    let readQuery = ['readPlayer'];
                    readQuery.push(playerName);
                    client.write(JSON.stringify(readQuery), () => {
                        let waitForData = setInterval(() => {
                            if (dataReceived) {
                                clearInterval(waitForData);
                                dataReceived = false;
                                query.push(playerName);
                                rl.question(`Would you like to add(1) or delete(2) a doctor to/from ${playerName}\'s doctors list? `, choice => {
                                    switch (choice) {
                                        case '1': {
                                            query.push('add');
                                            rl.question(`What is the name of the doctor you\'d like to add to ${playerName}\'s doctors list? `, doctorName => {
                                                readQuery = ['readDoctor'];
                                                readQuery.push(doctorName);
                                                query.push(doctorName);
                                                client.write(JSON.stringify(readQuery), () => {
                                                    let waitForData = setInterval(() => {
                                                        if (dataReceived) {
                                                            clearInterval(waitForData);
                                                            dataReceived = false;
                                                            client.write(JSON.stringify(query), () => {
                                                                let waitForData = setInterval(() => {
                                                                    if (dataReceived) {
                                                                        clearInterval(waitForData);
                                                                        dataReceived = false;
                                                                        startDialog();
                                                                    }
                                                                }, 100);
                                                            });
                                                        };
                                                    }, 100);
                                                });
                                            });
                                            break;
                                        }
                                        case '2': {
                                            query.push('delete');
                                            rl.question(`What is the name of the doctor you\'d like to delete from ${playerName}\'s doctors list? `, doctorName => {
                                                readQuery = ['readDoctor'];
                                                readQuery.push(doctorName);
                                                query.push(doctorName);
                                                client.write(JSON.stringify(readQuery), () => {
                                                    let waitForData = setInterval(() => {
                                                        if (dataReceived) {
                                                            clearInterval(waitForData);
                                                            dataReceived = false;
                                                            client.write(JSON.stringify(query), () => {
                                                                let waitForData = setInterval(() => {
                                                                    if (dataReceived) {
                                                                        clearInterval(waitForData);
                                                                        dataReceived = false;
                                                                        startDialog();
                                                                    };
                                                                }, 100);
                                                            });
                                                        };
                                                    }, 100);
                                                });
                                            });
                                            break;
                                        }
                                        default: {
                                            startDialog();
                                            break;
                                        }
                                    };
                                });
                            };
                        }, 100);
                    });
                });
            };
        }, 100);
    });
};

function deleteClub() {
    let query = ['showClubs'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                query = ['deleteClub'];
                rl.question('What is the name of the CLUB you\'d like to delete? ', clubName => {
                    query.push(clubName);
                    client.write(JSON.stringify(query), () => {
                        let waitForData = setInterval(() => {
                            if (dataReceived) {
                                clearInterval(waitForData);
                                dataReceived = false;
                                startDialog();
                            };
                        }, 100);
                    });
                });
            };
        }, 100);
    });
};

function deletePlayer() {
    let query = ['showPlayers'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                query = ['deletePlayer'];
                rl.question('What is the name of the PLAYER you\'d like to delete? ', playerName => {
                    query.push(playerName);
                    client.write(JSON.stringify(query), () => {
                        let waitForData = setInterval(() => {
                            if (dataReceived) {
                                clearInterval(waitForData);
                                dataReceived = false;
                                startDialog();
                            };
                        }, 100);
                    });
                });
            };
        }, 100);
    });
};

function deleteDoctor() {
    let query = ['showDoctors'];
    client.write(JSON.stringify(query), () => {
        let waitForData = setInterval(() => {
            if (dataReceived) {
                clearInterval(waitForData);
                dataReceived = false;
                query = ['deleteDoctor'];
                rl.question('What is the name of the DOCTOR you\'d like to delete? ', doctorName => {
                    query.push(doctorName);
                    client.write(JSON.stringify(query), () => {
                        let waitForData = setInterval(() => {
                            if (dataReceived) {
                                clearInterval(waitForData);
                                dataReceived = false;
                                startDialog();
                            };
                        }, 100);
                    });
                });
            };
        }, 100);
    });
};
