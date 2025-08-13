const axios = require('axios');

const API_BASE_URL = 'http://localhost:8080';

async function testAPI() {
  console.log('🧪 Probando API Gateway...\n');

  try {
    // 1. Probar que el API Gateway esté funcionando
    console.log('1. Probando health check...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ API Gateway está funcionando:', healthResponse.data);

    // 2. Probar la ruta raíz
    console.log('\n2. Probando ruta raíz...');
    const rootResponse = await axios.get(`${API_BASE_URL}/`);
    console.log('✅ Rutas disponibles:', rootResponse.data.availableRoutes);

    // 3. Probar crear un evento
    console.log('\n3. Probando crear un evento...');
    const eventData = {
      title: "Evento de Prueba",
      description: "Este es un evento de prueba",
      date: "2024-12-31",
      time: "18:00:00",
      location: "Sala de Conferencias",
      category: "Conferencia",
      totalCapacity: 100,
      status: "active",
      visibility: "public",
      organizerId: 1
    };

    const eventResponse = await axios.post(`${API_BASE_URL}/api/event`, eventData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('✅ Evento creado exitosamente:', eventResponse.data);

    // 4. Probar obtener todos los eventos
    console.log('\n4. Probando obtener eventos...');
    const eventsResponse = await axios.get(`${API_BASE_URL}/api/event`);
    console.log('✅ Eventos obtenidos:', eventsResponse.data);

  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Asegúrate de que el API Gateway esté corriendo en el puerto 8080');
    console.log('2. Asegúrate de que el microservicio de eventos esté corriendo en el puerto 3000');
    console.log('3. Verifica que la base de datos esté configurada correctamente');
    console.log('4. Revisa los logs del servidor para más detalles');
  }
}

testAPI();
