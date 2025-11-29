import db from './models/index.js';
import { app } from './app.js';

const start = async () => {

    console.log('Connecting to the DB...');
    await db.sequelize.authenticate();
    // await db.sequelize.sync({ alter: true });
    console.log('DB connected successfully.');

    app.listen(process.env.PORT, () => {
        console.log(`running on port ${process.env.PORT}`);
    });
};

start();
