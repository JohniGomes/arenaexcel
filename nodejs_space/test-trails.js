const axios = require('axios');

async function testTrails() {
  try {
    // Primeiro, fazer login para pegar o token
    const loginRes = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'john@doe.com',
      password: 'johndoe123'
    });
    
    const token = loginRes.data.token;
    console.log('✅ Token obtido:', token.substring(0, 20) + '...');
    
    // Agora buscar as trilhas
    const trailsRes = await axios.get('http://localhost:3000/trails', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('\n📋 Trilhas retornadas:');
    trailsRes.data.forEach(trail => {
      console.log(`  ${trail.icon} ${trail.name}`);
      console.log(`     - isUnlocked: ${trail.isUnlocked}`);
      console.log(`     - slug: ${trail.slug}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testTrails();
