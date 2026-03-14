const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3000';

async function testServices() {
    console.log('🚀 Starting Verification Tests...\n');

    try {
        // 1. Test User Registration
        console.log('--- Testing User Registration ---');
        const userEmail = `testuser_${Date.now()}@example.com`;
        const userRegResponse = await axios.post(`${GATEWAY_URL}/user/register`, {
            name: 'Test User',
            email: userEmail,
            password: 'password123'
        });
        console.log('✅ User Registered. Data received:', JSON.stringify(userRegResponse.data, null, 2));
        if (userRegResponse.data.user.password) {
            console.error('❌ BUG: Password returned in registration response!');
        } else {
            console.log('✅ Security: Password not returned in response.');
        }

        const userToken = userRegResponse.data.token;

        // 2. Test User Profile (Authentication)
        console.log('\n--- Testing User Profile (Bearer Token) ---');
        const userProfileResponse = await axios.get(`${GATEWAY_URL}/user/profile`, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('✅ User Profile accessed successfully:', userProfileResponse.data.email);

        // 3. Test Captain Registration
        console.log('\n--- Testing Captain Registration ---');
        const captainEmail = `testcaptain_${Date.now()}@example.com`;
        const captainRegResponse = await axios.post(`${GATEWAY_URL}/captain/register`, {
            name: 'Test Captain',
            email: captainEmail,
            password: 'password123'
        });
        console.log('✅ Captain Registered. Data received:', JSON.stringify(captainRegResponse.data.captain, null, 2));

        const captainToken = captainRegResponse.data.token;

        // 4. Test Captain Profile
        console.log('\n--- Testing Captain Profile ---');
        const captainProfileResponse = await axios.get(`${GATEWAY_URL}/captain/profile`, {
            headers: { Authorization: `Bearer ${captainToken}` }
        });
        console.log('✅ Captain Profile accessed successfully:', captainProfileResponse.data.email);

        // 5. Test User Logout (Blacklisting)
        console.log('\n--- Testing User Logout ---');
        await axios.post(`${GATEWAY_URL}/user/logout`, {}, {
            headers: { Authorization: `Bearer ${userToken}` }
        });
        console.log('✅ User Logout successful.');

        // 6. Verify User Token is Blacklisted
        console.log('\n--- Verifying Token Blacklisting ---');
        try {
            await axios.get(`${GATEWAY_URL}/user/profile`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.error('❌ BUG: Profile access should be denied after logout!');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Success: Profile access denied (Unauthorized).');
            } else {
                console.error('❌ Error during verification:', error.message);
            }
        }

        console.log('\n✨ All tests completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
        console.log('\n⚠️ Make sure all services (Gateway, User, Captain) and MongoDB are running.');
    }
}

testServices();
