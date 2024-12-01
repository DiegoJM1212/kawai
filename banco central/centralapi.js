const express = require('express');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

const app = express();
const PORT = 3007;

require('dotenv').config();  // Carga las variables de entorno desde el archivo .env

const BCCR_ENDPOINT = process.env.BCCR_ENDPOINT;
const EMAIL = process.env.EMAIL;
const TOKEN = process.env.TOKEN;


// Función para obtener el tipo de cambio
async function getExchangeRate() {
  const xmlData = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"> 
    <soap:Body>
      <ObtenerIndicadoresEconomicosXML xmlns="http://ws.sdde.bccr.fi.cr">
        <Indicador>317</Indicador> <!-- Indicador tipo de cambio oficial -->
        <FechaInicio>13/11/2024</FechaInicio> <!-- Fecha de inicio en formato dd/mm/yyyy -->
        <FechaFinal>13/11/2024</FechaFinal> <!-- Fecha final en formato dd/mm/yyyy -->
        <Nombre>Mi Nombre</Nombre> <!-- El nombre del usuario -->
        <SubNiveles>N</SubNiveles> <!-- 'N' para no obtener subniveles -->
        <CorreoElectronico>${EMAIL}</CorreoElectronico> <!-- Correo electrónico -->
        <Token>${TOKEN}</Token> <!-- Token de suscripción -->
      </ObtenerIndicadoresEconomicosXML>
    </soap:Body>
  </soap:Envelope>`;

  try {
    const response = await axios.post(BCCR_ENDPOINT, xmlData, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://ws.sdde.bccr.fi.cr/ObtenerIndicadoresEconomicosXML'
      }
    });

    // Parsear la respuesta XML
    const parser = new XMLParser();
    const jsonResponse = parser.parse(response.data);

    // Verificación de la existencia de la respuesta esperada
    const body = jsonResponse['soap:Envelope']?.['soap:Body'];

    // Comprobamos si existe una respuesta de fallo en el cuerpo de la respuesta SOAP
    if (body?.['soap:Fault']) {
      const faultString = body['soap:Fault']['faultstring'];
      console.error('Error en la solicitud SOAP:', faultString);
      return null;  // Devolver null si hubo un error
    }

    // Procesar la respuesta correcta
    const resultado = body?.['ObtenerIndicadoresEconomicosXMLResponse']?.['ObtenerIndicadoresEconomicosXMLResult'];
    if (resultado) {
      return resultado;  // Devolver el resultado si se encontró
    } else {
      console.error('No se encontró el resultado esperado en la respuesta.');
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el tipo de cambio:', error.message || error);
    return null;
  }
}

// Ruta para obtener el tipo de cambio
app.get('/tipo-de-cambio', async (req, res) => {
  try {
    const tipoCambio = await getExchangeRate();
    if (tipoCambio) {
      res.json({ tipoDeCambio: tipoCambio });  // Devolver el tipo de cambio como JSON
    } else {
      res.status(500).json({ message: 'No se pudo obtener el tipo de cambio' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Hubo un error al obtener el tipo de cambio' });
  }
});

// Ruta para la página de inicio donde se mostrará el tipo de cambio
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Tipo de Cambio</title>
      </head>
      <body>
        <h1>Bienvenido a la Página de Inicio</h1>
        <p>Tipo de cambio actual: <span id="tipoDeCambio">Cargando...</span></p>
        
        <script>
          // Función para obtener el tipo de cambio desde la API
          fetch('/tipo-de-cambio')
            .then(response => response.json())
            .then(data => {
              document.getElementById('tipoDeCambio').innerText = data.tipoDeCambio || 'No disponible';
            })
            .catch(error => {
              console.error('Error al obtener el tipo de cambio:', error);
              document.getElementById('tipoDeCambio').innerText = 'Error';
            });
        </script>
      </body>
    </html>
  `);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
