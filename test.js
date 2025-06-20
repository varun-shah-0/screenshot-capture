const http = require('http');
const url = require('url');

const PORT = 3002; // Updated to match the dev server port

function testScreenshotAPI() {
  const testUrl = 'https://example.com';
  const apiUrl = `http://localhost:${PORT}/api/screenshot?url=${encodeURIComponent(testUrl)}`;
  
  console.log('🧪 Testing Newsletter Screenshot API...');
  console.log(`📡 API URL: ${apiUrl}`);
  
  const parsedUrl = url.parse(apiUrl);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || PORT,
    path: parsedUrl.path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req = http.request(options, (res) => {
    console.log(`📊 Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('📄 Response:', JSON.stringify(response, null, 2));
        
        if (response.success) {
          console.log('✅ API test successful!');
          console.log(`📸 Screenshot saved as: ${response.filename}`);
        } else {
          console.log('❌ API test failed!');
        }
      } catch (error) {
        console.log('📄 Raw response:', data);
        console.log('❌ Failed to parse JSON response');
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    console.log(`💡 Make sure the development server is running on port ${PORT}`);
    console.log('💡 Run: npm run dev');
  });
  
  req.end();
}

// Test error cases
function testErrorCases() {
  console.log('\n--- Testing Error Cases ---');
  
  // Test without URL parameter
  const options1 = {
    hostname: 'localhost',
    port: PORT,
    path: '/api/screenshot',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const req1 = http.request(options1, (res) => {
    console.log(`❌ Missing URL - Status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('📄 Response:', JSON.stringify(response, null, 2));
      } catch (error) {
        console.log('📄 Raw response:', data);
      }
    });
  });
  
  req1.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
  });
  
  req1.end();
}

// Run tests
if (require.main === module) {
  console.log('🚀 Starting API Tests...\n');
  
  // Test the main functionality
  testScreenshotAPI();
  
  // Test error cases after a delay
  setTimeout(testErrorCases, 2000);
}

module.exports = { testScreenshotAPI, testErrorCases }; 