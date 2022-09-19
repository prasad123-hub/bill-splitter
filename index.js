const connectWithDb = require('./config/db');
require('dotenv').config();
const app = require('./app');


// connectWithDb();
connectWithDb();

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
})

