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
                    rl.question('Which entity/object/field/value would you like to create? Example: players,Diego Costa (optional),field (optional), value (optional)\n', (query) => {
                        remote.create(JSON.stringify(query), () => {});
                        startDialog();
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
                    console.log('Nothing chosen!');
                    startDialog();
            };
        });
    };

    startDialog();
});
