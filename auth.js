import {} from 'dotenv/config'

import express from 'express';
import mongoose from 'mongoose';
import OpenAI from 'openai';


import { signup, login } from './controllers/auth.js'

const router = express.Router();

// Register User
router.post('/signup', signup);
// Login User
router.post('/login', login);

const PatientSchema = new mongoose.Schema({
    state: String,
    gender: String,
    date: Date,
    feeling: String,
    activity: String,
    symptom: [String],
    STI: Boolean
    // ... any other fields you have
});

const Patient = mongoose.model('Patient', PatientSchema);

router.post('/checkin', async (req, res) => {
    try {
        const { state, gender, date, feeling, activity, symptom, STI } = req.body;

        const newCheckin = new Patient({
            state,
            gender,
            date,
            feeling,
            activity,
            symptom,
            STI
        });

        await newCheckin.save();
        
        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving patient check-in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find({});  
        res.json(patients);
    } catch (err) {
        console.error("Error fetching patients:", err);
        res.status(500).send("Internal Server Error");
    }
});

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY // This is also the default, can be omitted
  });

router.post('/ask', async (req, res) => {
    const userMessage = req.body.message;
    const previousMessages = req.body.messages;
    
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                ...previousMessages, 
                { role: "user", content: userMessage }
            ],
            model: "gpt-3.5-turbo",
        });
        
        const assistantMessage = completion.choices[0].message.content;
        
        // Return both the new message from the assistant and the updated message history
        res.json({ 
            message: assistantMessage,
            messages: [...previousMessages, { role: "user", content: userMessage }, { role: "assistant", content: assistantMessage }]
        });
    } catch (error) {
        console.error("Error fetching response from OpenAI:", error);
        res.status(500).json({ error: 'Failed to fetch from OpenAI' });
    }
});


export default router;
