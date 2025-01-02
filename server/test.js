const fetch = require('node-fetch');

const API_URL = 'http://localhost:3001/api';

// Test events
const events = [
    {
        event_type: 'family_dinner',
        title: 'Monthly Family Dinner',
        start_ts: '2024-12-31T18:00:00-07:00',
        end_ts: '2024-12-31T21:00:00-07:00',
        payload: {
            location: "Grandma's House",
            attendees: ['Mom', 'Dad', 'Kids'],
            food_preferences: 'Vegetarian options needed'
        }
    },
    {
        event_type: 'doctor_appointment',
        title: 'Annual Checkup',
        start_ts: '2024-12-30T14:30:00-07:00',
        end_ts: '2024-12-30T15:30:00-07:00',
        payload: {
            doctor: 'Dr. Smith',
            location: 'Family Medical Center',
            notes: 'Bring vaccination records'
        }
    }
];

async function runTests() {
    console.log('Starting API tests...\n');

    try {
        // Test 1: Create events
        console.log('Test 1: Creating events');
        const createdEvents = [];
        for (const event of events) {
            const response = await fetch(`${API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            });

            if (!response.ok) {
                throw new Error(`Failed to create event: ${response.statusText}`);
            }

            const createdEvent = await response.json();
            createdEvents.push(createdEvent);
            console.log(`✓ Created event: ${createdEvent.title} (${createdEvent.id})`);
        }
        console.log('All events created successfully\n');

        // Test 2: Fetch all events
        console.log('Test 2: Fetching all events');
        const getAllResponse = await fetch(`${API_URL}/events`);
        if (!getAllResponse.ok) {
            throw new Error(`Failed to fetch events: ${getAllResponse.statusText}`);
        }

        const allEvents = await getAllResponse.json();
        console.log(`✓ Retrieved ${allEvents.length} events`);
        console.log('Event list:', JSON.stringify(allEvents, null, 2));

    } catch (error) {
        console.error('Test failed:', error.message);
        process.exit(1);
    }
}

// Make sure the server is running before starting tests
console.log('Make sure the server is running on http://localhost:3001 before running tests');
console.log('You can start the server with: npm run dev\n');

runTests();
