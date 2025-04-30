import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Message from './model/Message.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/defaultDatabase";
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};
connectDB();

// Health check endpoint
app.get('/', (req, res) => {
    res.json({ status: 'API running', timestamp: new Date() });
});

// Contact form route
app.post('/api/contact', async (req, res) => {
    console.log('Received contact form data:', req.body);
    
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        console.log('Message saved to DB');
        res.status(200).json({ 
            success: true, 
            message: "Message stored successfully!",
            data: newMessage
        });
    } catch (err) {
        console.error("Error saving message:", err);
        res.status(500).json({ 
            success: false, 
            error: "Server error",
            details: err.message 
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});