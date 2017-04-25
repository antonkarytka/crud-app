CRUD app developed using Node.js and Sequelize ORM.

There are 3 models in the ORM: football club, players, doctors.
They have the following references:
- N:1 - football club : players   
- N:1 - football club : doctors
- N:N - players : doctors
