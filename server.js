const dnode = require('dnode');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/footballClub';

MongoClient.connect(url, (err, db) => {
    const server = dnode({

        create : (query, cb) => {
            let queryItems = JSON.parse(query).split(',');
            switch (queryItems.length) {
                // OK
                case 1 : {
                    let entity = queryItems[0];
                    cb(db.createCollection(entity));
                    console.log(`${entity} entity CREATED successfully!`);
                    break;
                }
                // OK
                case 2: {
                    let entity = queryItems[0];
                    let object = queryItems[1];
                    cb(db.collection(entity).insertOne( { _id: object } ));
                    console.log(`${object} object CREATED successfully in ${entity} collection!`);
                    break;
                }
                // OK. An empty field won't show on READ function
                // but will be modified on UPDATE function
                case 3: {
                    let entity = queryItems[0];
                    let object = queryItems[1];
                    let field = queryItems[2];
                    cb(db.collection(entity).insertOne(
                        { _id: object },
                        { [field]: {$exists: false} },
                        { [field]: '' }
                    ));
                    console.log(`${field} field CREATED successfully in ${object} object of ${entity} collection!`);
                    break;
                }
                // OK
                case 4: {
                    let entity = queryItems[0];
                    let object = queryItems[1];
                    let field = queryItems[2];
                    let value = queryItems[3];
                    cb(db.collection(entity).updateOne(
                        { _id: object },
                        { $set: { [field]: value } },
                        { upsert: true }
                     ));
                    console.log(`${value} value INSERTED to ${field} field successfully in ${object} object of ${entity} collection!`);
                    break;
                }

                default:
                    break;
            };
        },

        read : (query, cb) => {
            let queryItems = JSON.parse(query).split(',');
            switch (queryItems.length) {
                // OK
                case 1: {
                    let entity = queryItems[0];
                    cb(db.collection(entity).find().forEach( (doc) => {
                        console.log(doc);
                    } ));
                    break;
                }
                // OK
                case 2: {
                    let entity = queryItems[0];
                    let object = queryItems[1];
                    cb(db.collection(entity).find( { _id: object } ).forEach( (doc) => {
                        console.log(doc);
                    } ));
                    break;
                }
                default:
                    break;
            }
        },
        // OK
        update : (query, cb) => {
            let queryItems = JSON.parse(query).split(',');
            let entity = queryItems[0];
            let object = queryItems[1];
            let field = queryItems[2];
            let value = queryItems[3];
            cb(db.collection(entity).updateOne(
                { _id: object },
                { $set: { [field]: value } }
            ));
            console.log(`${value} value of ${field} field UPDATED successfully in ${object} object of ${entity} collection!`);
        },

        delete : (query, cb) => {
            let queryItems = JSON.parse(query).split(',');
            switch (queryItems.length) {
                // OK
                case 1 : {
                    let entity = queryItems[0];
                    cb(db.collection(entity).drop());
                    console.log(`${entity} entity DELETED successfully!`);
                    break;
                }
                // OK
                case 2: {
                    let entity = queryItems[0];
                    let object = queryItems[1];
                    cb(db.collection(entity).remove( { _id: object} ));
                    console.log(`${object} object DELETED from ${entity} entity successfully!`);
                    break;
                }
                // OK
                case 3: {
                    let entity = queryItems[0];
                    let object = queryItems[1];
                    let field = queryItems[2];
                    cb(db.collection(entity).update( { _id: object }, { $unset: { [field]: "" } } ));
                    console.log(`${field} field DELETED from ${object} object in ${entity} entity successfully!`);
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
    })
});
