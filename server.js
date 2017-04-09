const dnode = require('dnode');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database('football-club.db')

const server = dnode({
    createClub : (query, cb) => {
        let queryItems = JSON.parse(query);
        let club = queryItems[0];
        db.run(`INSERT OR IGNORE INTO CLUBS (club_name) VALUES ("${club}")`, (error) => {
            if (error)
                console.log(`Error occured inserting ${club} into CLUB table...`);
            else
                console.log(`${club} inserted into CLUBS table successfully!`);
        });
    },

    createPlayer : (query, cb) => {
        let queryItems = JSON.parse(query);
        let player = queryItems[0];
        let club = queryItems[queryItems.length - 1];
        db.serialize((error) => {
            db.run(`INSERT OR IGNORE INTO CLUBS (club_name) VALUES ("${club}")`);
            db.run(`INSERT OR IGNORE INTO PLAYERS (player_name, club) VALUES ("${player}", (SELECT club_id FROM CLUBS WHERE club_name = "${club}"))`);
            if (queryItems.length > 3) {
                for (i = 1; i < queryItems.length - 1; i++) {
                    db.run(`INSERT OR IGNORE INTO THERAPISTS (therapist_name, club) VALUES ("${queryItems[i]}", (SELECT club_id FROM CLUBS WHERE club_name = "${club}"))`);
                    db.run(`INSERT OR IGNORE INTO PLAYERS_THERAPISTS (player, therapist) VALUES ((SELECT player_id FROM PLAYERS WHERE player_name = "${player}"), (SELECT therapist_id FROM THERAPISTS WHERE therapist_name = "${queryItems[i]}"))`);
                }
            } else {
                let therapist = queryItems[1];
                db.run(`INSERT OR IGNORE INTO THERAPISTS (therapist_name, club) VALUES ("${therapist}", (SELECT club_id FROM CLUBS WHERE club_name = "${club}"))`);
                db.run(`INSERT OR IGNORE INTO PLAYERS_THERAPISTS (player, therapist) VALUES ((SELECT player_id FROM PLAYERS WHERE player_name = "${player}"), (SELECT therapist_id FROM THERAPISTS WHERE therapist_name = "${therapist}"))`);
            };

            if (error)
                console.log(`Error occured inserting ${player} into PLAYERS table...`);
            else
                console.log(`${player} inserted into PLAYERS table successfully`);
        });
    },

    createTherapist : (query, cb) => {
        let queryItems = JSON.parse(query);
        let therapist = queryItems[0];
        let club = queryItems[queryItems.length - 1];
        db.serialize((error) => {
            db.run(`INSERT OR IGNORE INTO CLUBS (club_name) VALUES ("${club}")`);
            db.run(`INSERT OR IGNORE INTO THERAPISTS (therapist_name, club) VALUES ("${therapist}", "${club}")`);
            if (queryItems.length > 3) {
                for (i = 1; i < queryItems.length - 1; i++) {
                    db.run(`INSERT OR IGNORE INTO PLAYERS (player_name, club) VALUES ("${queryItems[i]}", (SELECT club_id FROM CLUBS WHERE club_name = "${club}"))`);
                    db.run(`INSERT OR IGNORE INTO PLAYERS_THERAPISTS (player, therapist) VALUES ((SELECT player_id FROM PLAYERS WHERE player_name = "${queryItems[i]}"), (SELECT therapist_id FROM THERAPISTS WHERE therapist_name = "${therapist}"))`);
                }
            } else {
                let player = queryItems[1];
                db.run(`INSERT OR IGNORE INTO PLAYERS (players_name, club) VALUES ("${player}", "${club}")`);
                db.run(`INSERT OR IGNORE INTO PLAYERS_THERAPISTS (player, therapist) VALUES ((SELECT player_id FROM PLAYERS WHERE player_name = "${player}"), (SELECT therapist_id FROM THERAPISTS WHERE therapist_name = "${therapist}"))`);
            }

            if (error)
                console.log(`Error occured inserting ${therapist} into THERAPISTS table...`);
            else
                console.log(`${therapist} inserted into THERAPISTS table successfully`);
        });
    },

    read : (query, cb) => {
        let queryItems = JSON.parse(query).split(', ');
        queryItems.map((string) => { return string.toUpperCase() });
        switch (queryItems.length) {
            case 1: {
                let table = queryItems[0];
                /*cb(db.collection(table).find().forEach( (doc) => {
                    console.log(doc);
                } ));*/
                break;
            }
            case 2: {
                let table = queryItems[0];
                let column = queryItems[1];
                /*cb(db.collection(table).find( { _id: column } ).forEach( (doc) => {
                    console.log(doc);
                } ));*/
                break;
            }
            default:
                break;
        }
    },

    update : (query, cb) => {
        let queryItems = JSON.parse(query).split(', ');
        queryItems.map((string) => { return string.toUpperCase() });
        let table = queryItems[0];
        let column = queryItems[1];
        let value = queryItems[2];
        /*cb(db.collection(table).updateOne(
            { _id: column },
            { $set: { [value]: value } }
        ));*/
        console.log(`${value} value of ${value} value UPDATED successfully in ${column} column of ${table} collection!`);
    },

    delete : (query, cb) => {
        let queryItems = JSON.parse(query).split(', ');
        queryItems.map((string) => { return string.toUpperCase() });
        switch (queryItems.length) {
            case 1 : {
                let table = queryItems[0];
                //cb(db.collection(table).drop());
                console.log(`${table} table DELETED successfully!`);
                break;
            }
            case 2: {
                let table = queryItems[0];
                let column = queryItems[1];
                //cb(db.collection(table).remove( { _id: column} ));
                console.log(`${column} column DELETED from ${table} table successfully!`);
                break;
            }
            case 3: {
                let table = queryItems[0];
                let column = queryItems[1];
                let value = queryItems[2];
                //cb(db.collection(table).update( { _id: column }, { $unset: { [value]: "" } } ));
                console.log(`${value} value DELETED from ${column} column in ${table} table successfully!`);
                break;
            }
            default:
                break;
        };
    }
});

server.listen(8080, () => { console.log('Server running on 8080...') });

server.on('end', () => {
    db.close();
});
