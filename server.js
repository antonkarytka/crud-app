const dnode = require('dnode');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/footballClub';

MongoClient.connect(url, (err, db) => {
    const server = dnode({

        create : (entity, cb) => {
            cb(db.createCollection(entity));
            console.log(`${entity} entity created successfully!`);
        },

        read : (entity, cb) => {
            console.log(db.collection(entity).find());
        },

        update : (query, cb) => {
            let queryItems = JSON.parse(query).split(',');
            let entity = queryItems[0];
            let object = queryItems[1];
            let field = queryItems[2];
            let value = queryItems[3];
            cb(db.collection(entity).update(
                { _id: object },
                { $set: { [field]: value } },
                { upsert: true }
            ));
            console.log('Data updated successfully!');
        },

        delete : (query, cb) => {
            let queryItems = JSON.parse(query).split(',');
            switch (queryItems.length) {
                case 1 : {
                    let entity = queryItems[0];
                    cb(db.collection(queryItems[0]).remove());
                    console.log('Data deleted successfully!');
                    break;
                }

                case 2: {
                    let entity = queryItems[0];
                    let object = queryItems[1];
                    cb(db.collection(queryItems[0]).remove( { _id: queryItems[1]} ));
                    console.log('Data deleted successfully!');
                    break;
                }

                case 3: {
                    let entity = queryItems[0];
                    let object = queryItems[1];
                    let field = queryItems[2];
                    cb(db.collection(queryItems[0]).update( { _id: queryItems[1] }, { $unset: { [queryItems[2]]: "" } } ));
                    console.log('Data deleted successfully!');
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
