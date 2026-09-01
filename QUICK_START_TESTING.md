# 🚀 Quick Start: Testing Kitchen Staff APIs Locally

Get started testing the Kitchen Staff API in 5 minutes!

---

## 1️⃣ Prerequisites

- Node.js + npm installed
- MongoDB running on `mongodb://localhost:27017/cafeteria`
- Terminal/PowerShell open

---

## 2️⃣ Start the Backend

```bash
cd Backend
npm install
npm run dev
```

✅ **Expected Output:**
```
Server running on http://localhost:5000
Connected to MongoDB
```

---

## 3️⃣ Create Test Data (First Time Only)

### Option A: Using MongoDB Compass/Atlas

1. Connect to MongoDB
2. Create database: `cafeteria`
3. Import sample data (see Section 5 below)

### Option B: Using CLI Script

```bash
cd Backend
node test-connection.js
```

---

## 4️⃣ Quick Test: Get JWT Token

```bash
# Save as: test-login.sh (macOS/Linux) or test-login.ps1 (Windows PowerShell)

# PowerShell:
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/v1/auth/login" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{
    "email": "kitchen@example.com",
    "password": "password123"
  }'

$TOKEN = $response.token
Write-Host "✅ Token: $TOKEN"
```

---

## 5️⃣ Sample Testing Commands

### **A. Get Dashboard** (View Active Orders)

```bash
TOKEN="your_jwt_token_here"

# Linux/macOS:
curl -X GET http://localhost:5000/api/v1/kitchen/dashboard \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# PowerShell:
$headers = @{ 
  "Authorization" = "Bearer $TOKEN"
  "Content-Type" = "application/json"
}
Invoke-RestMethod -Uri "http://localhost:5000/api/v1/kitchen/dashboard" `
  -Headers $headers -Method GET
```

---

### **B. Get All Menu Items**

```bash
curl -X GET http://localhost:5000/api/v1/kitchen/menu-availability \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

### **C. Accept an Order**

```bash
# Get an order ID first from the dashboard
ORDERID="507f1f77bcf86cd799439011"

curl -X PATCH "http://localhost:5000/api/v1/kitchen/orders/$ORDERID/accept" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

### **D. Report Stock Issue**

```bash
curl -X POST http://localhost:5000/api/v1/kitchen/stock-alerts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "507f1f77bcf86cd799439015",
    "itemName": "Burger",
    "alertType": "out_of_stock",
    "severity": "high",
    "reason": "Beef supply delayed"
  }'
```

---

### **E. Get Current Shift**

```bash
curl -X GET http://localhost:5000/api/v1/kitchen-staff/shifts/current \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

### **F. Clock In**

```bash
SHIFTID="507f1f77bcf86cd799439018"

curl -X PATCH "http://localhost:5000/api/v1/kitchen-staff/shifts/$SHIFTID/clock-in" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

### **G. Get Kitchen Statistics**

```bash
curl -X GET http://localhost:5000/api/v1/kitchen/stats/detailed \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 6️⃣ Using Postman (Easier!)

### Import the Collection:

1. Open **Postman**
2. Click **Import** (top-left)
3. Select **Kitchen-Staff-API.postman_collection.json**
4. Set environment variable:
   - `baseUrl`: `http://localhost:5000/api/v1`
5. **Run → Login** (auto-saves token)
6. Run any other request!

**Pro Tip:** Use Postman's `Tests` tab for automated validation

---

## 7️⃣ Automated Testing Script (All Tests in Order)

### **PowerShell Complete Flow:**

```powershell
# Save as: kitchen-api-test-flow.ps1

$baseUrl = "http://localhost:5000/api/v1"

# Step 1: Login
Write-Host "🔐 Step 1: Logging in..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body @{
    email = "kitchen@example.com"
    password = "password123"
  } | ConvertTo-Json -AsString | ConvertFrom-Json

$token = $loginResponse.token
Write-Host "✅ Logged in! Token: $($token.Substring(0, 30))..." -ForegroundColor Green

# Step 2: Get Dashboard
Write-Host "`n📊 Step 2: Getting dashboard..." -ForegroundColor Yellow
$dashboard = Invoke-RestMethod -Uri "$baseUrl/kitchen/dashboard" `
  -Headers @{ "Authorization" = "Bearer $token" } `
  -Method GET

Write-Host "📦 Pending: $($dashboard.stats.pending), Preparing: $($dashboard.stats.preparing), Ready: $($dashboard.stats.ready)" -ForegroundColor Green

# Step 3: Get Menu Availability
Write-Host "`n🍽️ Step 3: Getting menu availability..." -ForegroundColor Yellow
$menu = Invoke-RestMethod -Uri "$baseUrl/kitchen/menu-availability" `
  -Headers @{ "Authorization" = "Bearer $token" } `
  -Method GET

Write-Host "✅ Found $($menu.count) items" -ForegroundColor Green
$menu.items | Select-Object -First 3 | Format-Table -Property @{n="Name";e={$_.name.en}}, isAvailable

# Step 4: Get Stock Alerts
Write-Host "`n⚠️ Step 4: Getting stock alerts..." -ForegroundColor Yellow
$alerts = Invoke-RestMethod -Uri "$baseUrl/kitchen/stock-alerts" `
  -Headers @{ "Authorization" = "Bearer $token" } `
  -Method GET

Write-Host "✅ $($alerts.count) active alerts" -ForegroundColor Green

# Step 5: Get Kitchen Stats
Write-Host "`n📈 Step 5: Getting detailed stats..." -ForegroundColor Yellow
$stats = Invoke-RestMethod -Uri "$baseUrl/kitchen/stats/detailed" `
  -Headers @{ "Authorization" = "Bearer $token" } `
  -Method GET

Write-Host "✅ Average prep time: $($stats.stats.performance.averagePreparationTime) mins" -ForegroundColor Green
Write-Host "✅ Orders today: $($stats.stats.performance.totalOrdersToday)" -ForegroundColor Green

Write-Host "`n✨ All tests completed!" -ForegroundColor Cyan
```

**Run it:**
```powershell
.\kitchen-api-test-flow.ps1
```

---

## 8️⃣ Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `Connection refused` | Backend not running | Run `npm run dev` in Backend folder |
| `Invalid token` | Token expired/wrong | Login again to get new token |
| `Forbidden` | Not a kitchen staff user | Use kitchen account or check role |
| `Order not found` | Wrong order ID | Get ID from `/kitchen/dashboard` |
| `MongoDB connection error` | MongoDB not running | Start MongoDB service |

---

## 9️⃣ Real-Time Testing (Socket.io)

Connect to real-time kitchen updates:

```javascript
// Save as: test-kitchen-socket.js

const io = require('socket.io-client');

const token = 'YOUR_JWT_TOKEN';
const socket = io('http://localhost:5000', {
  auth: { token },
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('✅ Connected to kitchen socket');
  socket.emit('join-room', 'kitchen');
});

socket.on('order:new', (order) => {
  console.log('🔔 New order received:', order);
});

socket.on('order:status', (data) => {
  console.log('📊 Order status updated:', data);
});

socket.on('notification:new', (notif) => {
  console.log('💬 Notification:', notif.message);
});

// Disconnect after 30 seconds
setTimeout(() => {
  socket.disconnect();
  console.log('Disconnected');
}, 30000);
```

**Run it:**
```bash
node test-kitchen-socket.js
```

---

## 🔟 Full API Endpoint Summary

| Category | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| **Orders** | `/kitchen/dashboard` | GET | View active orders |
| | `/kitchen/orders/:orderId/accept` | PATCH | Accept & start preparation |
| | `/kitchen/orders/:orderId/details` | GET | Item-level tracking |
| | `/kitchen/orders/:orderId/ready` | PATCH | Mark order ready |
| | `/kitchen/orders/:orderId/serve` | PATCH | Mark order served |
| **Availability** | `/kitchen/menu-availability` | GET | List all items |
| | `/kitchen/menu/:itemId/availability` | PATCH | Toggle availability |
| **Stock** | `/kitchen/stock-alerts` | GET | View alerts |
| | `/kitchen/stock-alerts` | POST | Report issue |
| **Shifts** | `/kitchen-staff/shifts/current` | GET | Current shift info |
| | `/kitchen-staff/shifts/:shiftId/clock-in` | PATCH | Start work |
| | `/kitchen-staff/shifts/:shiftId/clock-out` | PATCH | End work |
| **Analytics** | `/kitchen/stats/detailed` | GET | Performance metrics |
| | `/kitchen/reports/generate` | POST | Create daily report |
| | `/kitchen/staff/:staffId/performance` | GET | Staff metrics |

---

## 📚 Next Steps

1. ✅ Run backend (`npm run dev`)
2. ✅ Test login to get token
3. ✅ Use Postman collection for easy testing
4. ✅ Check [KITCHEN_API_TESTING_GUIDE.md](./KITCHEN_API_TESTING_GUIDE.md) for detailed tests
5. ✅ Test Socket.io for real-time features
6. ✅ Review frontend at `Frontend/src/pages/kitchen/`

---

## 💡 Tips

- **Save token** in Postman as environment variable
- **Test in order:** Login → Dashboard → Accept → Mark Ready → Serve
- **Check frontend** console for any errors
- **Monitor MongoDB** with Compass for data changes
- **Use browser DevTools** to inspect Socket.io events

---

**Happy Testing! 🎉**
