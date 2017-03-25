const dnode = require('dnode');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/footballClub';

MongoClient.connect(url, (err, db) => {
    const server = dnode({
        create : (entity, cb) => {
            cb(db.createCollection(entity));
            console.log(`${entity} entity created successfully!`);
        },

        update : (query, cb) => {
            let q = JSON.parse(query).split(',');
            let entity = q[0];
            let object = q[1];
            let field = q[2];
            let value = q[3];
            cb(db.collection(entity).update(
                { _id: object },
                { $set: { [field]: value } },
                { upsert: true }
            ));
            console.log('Data updated successfully!');
        }
    });

    server.listen(8080, () => { console.log('Server running on 8080...') });

    server.on('stop', () => {
        db.close();
    });
});
