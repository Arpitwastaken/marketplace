const http = require('http');

function testEndpoint(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function runTests() {
  try {
    console.log('Testing /health...');
    const health = await testEndpoint('/health');
    console.log('Health:', health);
    
    console.log('Testing /api/matches?user_id=test...');
    const matches = await testEndpoint('/api/matches?user_id=test');
    console.log('Matches:', matches);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

runTests();
