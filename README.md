CRUD app developed using Node.js and Sequelize ORM.

There are 3 models in the ORM: football club, players, doctors.
They have the following references:
- 1:N - football club : players   
- 1:N - football club : doctors
- N:N - players : doctors
