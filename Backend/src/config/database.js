const mongoose = require('mongoose');

const connectDatabase = async (retries = 3) => {
	const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
	if (!uri) throw new Error('MONGODB_URI is not configured');

	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			await mongoose.connect(uri, {
				serverSelectionTimeoutMS: 8000,
				connectTimeoutMS: 8000,
				socketTimeoutMS: 8000,
				family: 4,
				retryWrites: true,
				w: 'majority',
				maxPoolSize: 10,
				minPoolSize: 2,
				heartbeatFrequencyMS: 10000
			});
			console.log(`✓ MongoDB connected: ${mongoose.connection.name}`);
			return true;
		} catch (error) {
			const isLastAttempt = attempt === retries;
			const message = error.message || 'Unknown connection error';
			
			if (isLastAttempt) {
				console.error('✗ MongoDB connection failed (final attempt):', message);
				console.error('\n⚠️  SOLUTION - MongoDB Atlas IP Whitelist:');
				console.error('   1. Go to: https://cloud.mongodb.com/v2');
				console.error('   2. Select your project "Cluster0"');
				console.error('   3. Click "Network Access" → "Add IP Address"');
				console.error('   4. Click "Allow Access from Anywhere" (0.0.0.0/0)');
				console.error('   5. Restart the server\n');
				throw error;
			}
			
			console.warn(`⏳ MongoDB connection attempt ${attempt}/${retries} failed, retrying...`);
			await new Promise(resolve => setTimeout(resolve, 2000 * attempt));
		}
	}
};

module.exports = connectDatabase;
