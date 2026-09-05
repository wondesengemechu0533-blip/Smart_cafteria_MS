require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

function api(method, path, token, body) {
  return new Promise((resolve, reject) => {
    const opts = { hostname: 'localhost', port: 5000, path, method, headers: { 'Content-Type': 'application/json' } };
    if (token) opts.headers['Authorization'] = 'Bearer ' + token;
    const req = http.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, data: JSON.parse(d) }); } catch (e) { resolve({ status: res.statusCode, raw: d }); } });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  const User = require('./src/models/User');
  const MenuItem = require('./src/models/MenuItem');

  const customer = await User.findOne({ email: { $in: ['wondesengemechuha@gmail.com', 'e2e-customer@test.local'] } });
  const kitchen = await User.findOne({ role: 'kitchen' });
  if (!customer || !kitchen) { console.log('MISSING customer/kitchen user'); await mongoose.disconnect(); return; }
  console.log('customer:', customer.email, '| kitchen:', kitchen.email, kitchen.role, '| status:', kitchen.status);

  const CT = jwt.sign({ id: customer._id, role: customer.role, email: customer.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const KT = jwt.sign({ id: kitchen._id, role: kitchen.role, email: kitchen.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  const item = await MenuItem.findOne({ stockQuantity: { $gt: 5 }, isAvailable: true });
  if (!item) { console.log('No items with stock!'); await mongoose.disconnect(); return; }
  console.log('item:', item.name?.en || item.name, 'stock:', item.stockQuantity);

  let r = await api('POST', '/api/v1/orders', CT, {
    orderType: 'dine-in', customerName: 'Repro Test', customerPhone: '+251900000002',
    paymentMethod: 'CHAPA', items: [{ id: String(item._id), name: item.name?.en || item.name, quantity: 1 }],
    totalAmount: item.price, tableNumber: 'T9'
  });
  const oid = r.data?.order?.orderId || r.data?.data?.orderId;
  console.log('\nORDER CREATED:', r.status, oid || JSON.stringify(r.data).substring(0, 300));
  if (!oid) { await mongoose.disconnect(); return; }

  const dash = await api('GET', '/api/v1/kitchen/dashboard', KT);
  const dm = dash.data?.orders || {};
  const all = [...(dm.pending||[]), ...(dm.preparing||[]), ...(dm.ready||[])];
  const inDash = all.some(o => o.orderId === oid);

  const list = await api('GET', '/api/v1/kitchen/orders', KT);
  const inList = (list.data?.orders || []).some(o => o.orderId === oid);

  console.log('\nKITCHEN DASHBOARD: status', dash.status, '| count', all.length, '| order visible:', inDash);
  if (!inDash) console.log('  pending backlog:', (dm.pending||[]).map(o=>o.orderId));
  console.log('KITCHEN LIST (/orders): status', list.status, '| count', (list.data?.orders||[]).length, '| order visible:', inList);
  console.log('DB status:', (await require('./src/models/Order').findOne({ orderId: oid })).status, '| paymentStatus:', (await require('./src/models/Order').findOne({ orderId: oid })).paymentStatus);

  await mongoose.disconnect();
}
main().catch(e => { console.error('FATAL:', e.message); process.exit(1); });