import {} from 'dotenv/config'


import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';



const CONNECTION_URL = process.env.REACT_APP_CONNECTION_URL;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));

app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.send('Express backend is running!');
});

// Endpoint to fetch all patient data
app.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find();  // This fetches all patients from the MongoDB collection
        res.json(patients);
    } catch (err) {
        console.error("Error fetching patients:", err);
        res.status(500).send("Internal Server Error");
    }
});


