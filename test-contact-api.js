// Test script untuk debug contact form API
// Run: node test-contact-api.js

async function testContactAPI() {
  console.log('🔍 Testing Contact Form API...\n');

  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '081234567890',
    subject: 'Testing Contact Form',
    message: 'This is a test message to verify the contact form API is working correctly.',
  };

  console.log('📤 Sending POST request to: http://localhost:3000/api/contact');
  console.log('📦 Data:', JSON.stringify(testData, null, 2));
  console.log('');

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📡 Response Status:', response.status, response.statusText);
    console.log('');

    const data = await response.json();
    console.log('📥 Response Data:', JSON.stringify(data, null, 2));
    console.log('');

    if (response.ok) {
      console.log('✅ SUCCESS! Contact form is working!');
    } else {
      console.log('❌ ERROR! Check the response above for details.');
    }
  } catch (error) {
    console.log('❌ FETCH ERROR:', error.message);
    console.log('');
    console.log('Possible causes:');
    console.log('1. Server is not running (npm run dev)');
    console.log('2. Server is running on different port');
    console.log('3. Network/firewall issue');
  }
}

// Run test
testContactAPI();
