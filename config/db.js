const mongoose = require('mongoose');

const connectWithDb = () => {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log(`DB Connected`))
    .catch(error => {
        console.log(`DB Connection Error: ${error.message}`);
        process.exit(1);

    });
}

module.exports = connectWithDb;