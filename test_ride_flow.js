const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3000';

async function testRideFlow() {
    console.log('🚀 Starting Refactored Ride Flow Verification Tests...\n');

    try {
        // 1. Register and Login a User
        console.log('--- Setting up User (Passenger) ---');
        const userEmail = `user_${Date.now()}@example.com`;
        const userReg = await axios.post(`${GATEWAY_URL}/user/register`, {
            name: 'Flow User',
            email: userEmail,
            password: 'password123'
        });
        const userToken = userReg.data.token;
        console.log('✅ User ready.');

        // 2. Register and Login a Captain
        console.log('\n--- Setting up Captain (Driver) ---');
        const captainEmail = `captain_${Date.now()}@example.com`;
        const captainReg = await axios.post(`${GATEWAY_URL}/captain/register`, {
            name: 'Flow Captain',
            email: captainEmail,
            password: 'password123'
        });
        const captainToken = captainReg.data.token;
        console.log('✅ Captain ready.');

        // 3. Create a Ride (via Ride service)
        console.log('\n--- Creating a Ride (Ride Service) ---');
        const rideResponse = await axios.post(`${GATEWAY_URL}/ride/create`, {
            pickup: 'Central Park',
            destination: 'Times Square'
        }, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        const rideId = rideResponse.data.ride._id;
        console.log('✅ Ride Created:', JSON.stringify(rideResponse.data.ride, null, 2));

        // 4. Accept the Ride (via Ride service, as Captain)
        console.log('\n--- Accepting the Ride (Ride Service) ---');
        const acceptResponse = await axios.post(`${GATEWAY_URL}/ride/accept`, {
            rideId: rideId
        }, {
            headers: { Authorization: `Bearer ${captainToken}` }
        });
        console.log('✅ Ride Acceptance Response:', JSON.stringify(acceptResponse.data, null, 2));

        console.log('\n--- Verification complete ---');
        console.log('Ride flow successfully moved to Ride Service.');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
        console.log('\n⚠️ Make sure all services (Gateway, Rider, Captain) and RabbitMQ are running.');
    }
}

testRideFlow();
