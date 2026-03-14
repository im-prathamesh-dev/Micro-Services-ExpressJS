const axios = require('axios');

const GATEWAY_URL = 'http://localhost:3000';

async function testRiderService() {
    console.log('🚀 Starting Rider Service Verification Tests...\n');

    try {
        // 1. Test Rider Registration
        console.log('--- Testing Rider Registration ---');
        const riderEmail = `testrider_${Date.now()}@example.com`;
        const riderRegResponse = await axios.post(`${GATEWAY_URL}/rider/register`, {
            name: 'Test Rider',
            email: riderEmail,
            password: 'password123'
        });
        console.log('✅ Rider Registered:', JSON.stringify(riderRegResponse.data, null, 2));

        const riderToken = riderRegResponse.data.token;

        // 2. Test Rider Profile
        console.log('\n--- Testing Rider Profile ---');
        const riderProfileResponse = await axios.get(`${GATEWAY_URL}/rider/profile`, {
            headers: { Authorization: `Bearer ${riderToken}` }
        });
        console.log('✅ Rider Profile accessed successfully:', riderProfileResponse.data.email);

        // 3. Test Rider Logout
        console.log('\n--- Testing Rider Logout ---');
        await axios.post(`${GATEWAY_URL}/rider/logout`, {}, {
            headers: { Authorization: `Bearer ${riderToken}` }
        });
        console.log('✅ Rider Logout successful.');

        // 4. Verify Blacklisting
        console.log('\n--- Verifying Token Blacklisting ---');
        try {
            await axios.get(`${GATEWAY_URL}/rider/profile`, {
                headers: { Authorization: `Bearer ${riderToken}` }
            });
            console.error('❌ BUG: Profile access should be denied!');
        } catch (error) {
            if (error.response?.status === 401) {
                console.log('✅ Success: Profile access denied.');
            } else {
                console.error('❌ Error during verification:', error.message);
            }
        }

        console.log('\n✨ Rider service tests completed successfully!');

    } catch (error) {
        console.error('\n❌ Test failed:', error.response?.data || error.message);
        console.log('\n⚠️ Make sure Gateway and Rider services are running.');
    }
}

testRiderService();
