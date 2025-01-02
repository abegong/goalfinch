require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const { Parser } = require('json2csv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3003;

// MongoDB connection string - replace with your actual connection string
const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    process.exit(1);
}
const client = new MongoClient(uri);
const dbName = 'niblingsDb';

// JWT Secret - Add this to your .env file
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not set');
    process.exit(1);
}

// Connect to MongoDB
async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}
connectToMongo();

// Get collections
const getEventsCollection = () => client.db(dbName).collection('events');
const getUsersCollection = () => client.db(dbName).collection('users');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
};

// Middleware
app.use(bodyParser.json());

// Register endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check if user already exists
        const existingUser = await getUsersCollection().findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = {
            username,
            password: hashedPassword,
            created_at: new Date().toISOString()
        };

        await getUsersCollection().insertOne(user);
        
        // Generate token
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.status(201).json({ token });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await getUsersCollection().findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        res.json({ token });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Failed to login' });
    }
});

// POST endpoint to add an event
app.post('/api/events', authenticateToken, async (req, res) => {
    const { event_type, title, start_ts, end_ts, payload } = req.body;
    
    if (!event_type || !end_ts) {
        return res.status(400).json({ 
            error: 'event_type and end_ts are required fields' 
        });
    }

    // Validate timestamps if provided
    if (start_ts && !Date.parse(start_ts)) {
        return res.status(400).json({ 
            error: 'Invalid start_ts format' 
        });
    }
    
    if (!Date.parse(end_ts)) {
        return res.status(400).json({ 
            error: 'Invalid end_ts format' 
        });
    }

    const newEvent = {
        id: crypto.randomUUID(),
        event_type,
        title: title || null,
        start_ts: start_ts || null,
        end_ts,
        created_at_ts: '2024-12-29T22:19:47-07:00',
        payload: payload || {}
    };

    try {
        await getEventsCollection().insertOne(newEvent);
        res.status(201).json(newEvent);
    } catch (err) {
        console.error('Failed to insert event:', err);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// GET endpoint to retrieve all events
app.get('/api/events', authenticateToken, async (req, res) => {
    try {
        const events = await getEventsCollection().find({}).toArray();
        res.json(events);
    } catch (err) {
        console.error('Failed to retrieve events:', err);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
});

// GET endpoint to retrieve events by type from last month
app.get('/api/events/:eventType', authenticateToken, async (req, res) => {
    try {
        const eventType = req.params.eventType;
        const wantsCsv = req.query.csv === 'true';
        const year = parseInt(req.query.year || req.query.y);
        const month = parseInt(req.query.month || req.query.m);
        
        let query = { event_type: eventType };
        
        // If year and month are provided, filter by that specific month
        if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
            const startDate = new Date(year, month - 1, 1); // Month is 0-based in JS Date
            const endDate = new Date(year, month, 0); // Last day of the month
            endDate.setHours(23, 59, 59, 999);
            
            query.end_ts = {
                $gte: startDate.toISOString(),
                $lte: endDate.toISOString()
            };
        } else {
            // Default behavior: show events from the last month
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            query.end_ts = { $gte: oneMonthAgo.toISOString() };
        }
        
        const events = await getEventsCollection().find(query).toArray();
        
        if (wantsCsv) {
            // Transform events to flatten the payload
            const flattenedEvents = events.map(event => {
                const flatEvent = {
                    id: event.id,
                    event_type: event.event_type,
                    title: event.title,
                    start_ts: event.start_ts,
                    end_ts: event.end_ts,
                    created_at_ts: event.created_at_ts
                };
                // Add all payload fields as separate columns
                if (event.payload) {
                    Object.entries(event.payload).forEach(([key, value]) => {
                        flatEvent[`payload_${key}`] = value;
                    });
                }
                return flatEvent;
            });

            const parser = new Parser();
            const csv = parser.parse(flattenedEvents);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=${eventType}-events.csv`);
            return res.send(csv);
        }
        
        res.json(events);
    } catch (err) {
        console.error('Failed to retrieve events:', err);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        await client.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
