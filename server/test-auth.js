const axios = require('axios');

async function testLogin() {
  const url = 'http://localhost:5002/api/auth/login';
  const credentials = {
    email: 'bmaasrani565@gmail.com',
    password: '2474317BbCh&'
  };

  console.log('Testing login with:', credentials.email);

  try {
    const response = await axios.post(url, credentials);
    console.log('Login successful!');
    console.log('Token:', response.data.token ? 'Received' : 'Missing');
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Login failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testLogin();
