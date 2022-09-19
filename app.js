const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require("./helpers/logger");
const requestLogger = require("./helpers/requestLogger");
const dotenv = require('dotenv');
dotenv.config()

const app = express();

//regular middlewares
app.use(cors())
app.use(requestLogger)
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// import all routes here
const userRoutes = require("./routes/user");
const groupRoutes = require("./routes/group");
const expenseRoutes = require("./routes/expense");


app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);

// if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
//     app.use(express.static('client/build'));
//     app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname,'client','build','index.html'));
//     });
//    }

//To detect and log invalid api hits 
app.all('*', (req, res) => {
    logger.error(`[Invalid Route] ${req.originalUrl}`)
    res.status(404).json({
        status: 'fail',
        message: 'Invalid path'
      })
})

module.exports = app;