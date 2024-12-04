const axios = require('axios');
require('dotenv').config();

const obtenerToken = async () => {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;

    if (!clientId || !secret) {
        throw new Error('PayPal credentials are not set in environment variables');
    }

    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');

    try {
        const response = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', 
            'grant_type=client_credentials', 
            {
                headers: {
                    'Authorization': `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error obtaining PayPal access token:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const createPayment = async (req, res) => {
    const totalAmount = req.body.monto;

    try {
        const accessToken = await obtenerToken();

        const paymentData = {
            intent: 'sale',
            payer: {
                payment_method: 'paypal'
            },
            transactions: [{
                amount: {
                    total: totalAmount,
                    currency: 'USD'
                },
                description: 'Compra en KawaiPet'
            }],
            redirect_urls: {
                return_url: 'https://kawai-u5jc.onrender.com/inicio',
                cancel_url: 'https://kawai-u5jc.onrender.com/inicio'
            }
        };

        const response = await axios.post('https://api-m.sandbox.paypal.com/v1/payments/payment', 
            paymentData, 
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const approvalUrl = response.data.links.find(link => link.rel === 'approval_url').href;
        res.json({ redirectUrl: approvalUrl });
    } catch (error) {
        console.error('Error creating PayPal payment:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error al procesar el pago' });
    }
};

module.exports = { createPayment };

