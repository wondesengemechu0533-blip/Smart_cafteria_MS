const CBE_BIRR_API_URL = process.env.CBE_BIRR_API_URL || 'https://api.cbebirr.com/api/v1';

const cbeBirrRequest = async (path, options = {}) => {
    if (!process.env.CBE_BIRR_API_KEY) {
        const error = new Error('CBE_BIRR_API_KEY is not configured');
        error.statusCode = 500;
        throw error;
    }

    const response = await fetch(`${CBE_BIRR_API_URL}${path}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${process.env.CBE_BIRR_API_KEY}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    const data = await response.json();

    if (!response.ok || data.status !== 'success') {
        const error = new Error(data.message || 'CBE Birr request failed');
        error.statusCode = response.status || 502;
        throw error;
    }

    return data;
};

exports.initializePayment = (payload) => cbeBirrRequest('/payment/initialize', {
    method: 'POST',
    body: JSON.stringify(payload)
});

exports.verifyPayment = (reference) => cbeBirrRequest(`/payment/verify/${encodeURIComponent(reference)}`);