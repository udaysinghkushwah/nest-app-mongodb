const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sample_training';
const COLLECTIONS = ['companies', 'grades', 'inspections', 'posts', 'routes', 'trips', 'zips'];

async function inspect() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  for (const name of COLLECTIONS) {
    const samples = await db.collection(name).find().limit(2).toArray();
    console.log(`\n===== ${name} =====`);
    console.log(JSON.stringify(samples, null, 2));
  }

  await mongoose.disconnect();
}

inspect().catch(e => { console.error(e); process.exit(1); });
