const axios = require('axios');
const config = require('./config');

async function checkHealth() {
  console.log('Checking Floe Credit API Health...');
  try {
    const response = await axios.get(`${config.FLOE_API_URL}/v1/health`);
    console.log('Health Status:', response.data.status);
    console.log('API Timestamp:', response.data.timestamp);
    return response.data.status === 'ok';
  } catch (error) {
    console.error('API Health Check Failed:', error.message);
    return false;
  }
}

async function verifySetup() {
  console.log('=========================================');
  console.log('Floe Agent Production Readiness Check');
  console.log('=========================================');
  
  const isHealthy = await checkHealth();
  
  if (isHealthy) {
    console.log('Setup looks good. Ready to run agent.js');
  } else {
    console.warn('CRITICAL: Floe API appears to be down.');
  }
  console.log('=========================================');
}

verifySetup();
