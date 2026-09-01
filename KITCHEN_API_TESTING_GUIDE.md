## 🧪 Kitchen Staff API Testing Guide

This guide provides comprehensive instructions for testing all Kitchen Staff management APIs.

---

## 📋 Prerequisites

1. **Backend Running** - Server must be running on `http://localhost:5000`
2. **Valid Kitchen Staff Account** - Role: `kitchen` or `KITCHEN_STAFF`
3. **JWT Token** - Obtained after login
4. **API Client** - Postman, Insomnia, or curl

---

## 🔐 Authentication

All endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Step 1: Login to Get Token

**Request:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "kitchen@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Kitchen",
    "email": "kitchen@example.com",
    "role": "kitchen"
  }
}
```

**Save the token:**
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## ✅ Test Cases

### **Section 1: Order Management**

---

#### 1.1 Get Kitchen Dashboard

**Purpose:** View all active orders grouped by status

**Request:**
```bash
curl -X GET http://localhost:5000/api/v1/kitchen/dashboard \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "pending": 3,
    "preparing": 2,
    "ready": 1,
    "activeOrders": 5,
    "completedToday": 12
  },
  "orders": {
    "pending": [...],
    "preparing": [...],
    "ready": [...]
  }
}
```

**Status:** ✅ PASS if response contains all order statuses

---

#### 1.2 Accept Order

**Purpose:** Accept a pending order and start preparation

**Request:**
```bash
ORDERID="test-order-001"
curl -X PATCH http://localhost:5000/api/v1/kitchen/orders/$ORDERID/accept \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order #test-order-001 accepted and is now being prepared",
  "order": {
    "id": "507f1f77bcf86cd799439011",
    "orderId": "test-order-001",
    "status": "preparing",
    "estimatedCompletionTime": "2026-09-01T14:35:00Z",
    "estimatedRemainingTime": 15,
    "kitchenStaffAssigned": "507f1f77bcf86cd799439012"
  }
}
```

**Validation Points:**
- ✅ Status changes to "preparing"
- ✅ Estimated completion time calculated
- ✅ Kitchen staff assigned
- ✅ Customer receives notification

---

#### 1.3 Get Order Details with Item-Level Tracking

**Purpose:** View detailed order information including item status

**Request:**
```bash
ORDERID="test-order-001"
curl -X GET http://localhost:5000/api/v1/kitchen/orders/$ORDERID/details \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "order": {
    "id": "507f1f77bcf86cd799439011",
    "orderId": "test-order-001",
    "customer": {
      "name": "Jane Doe",
      "phone": "0911234567"
    },
    "items": [
      {
        "id": "507f1f77bcf86cd799439013",
        "name": "Burger",
        "quantity": 2,
        "price": 85,
        "itemStatus": "preparing",
        "preparationStartedAt": "2026-09-01T14:20:00Z",
        "preparationCompletedAt": null
      },
      {
        "id": "507f1f77bcf86cd799439014",
        "name": "Fries",
        "quantity": 1,
        "price": 45,
        "itemStatus": "ready",
        "preparationStartedAt": "2026-09-01T14:20:00Z",
        "preparationCompletedAt": "2026-09-01T14:23:00Z"
      }
    ],
    "estimatedCompletionTime": "2026-09-01T14:35:00Z",
    "estimatedRemainingTime": 12,
    "totalAmount": 215
  }
}
```

**Validation Points:**
- ✅ Individual items have status
- ✅ Preparation times tracked
- ✅ Estimated completion time shown

---

#### 1.4 Update Item-Level Preparation Status

**Purpose:** Update the status of individual items

**Request:**
```bash
ORDERID="test-order-001"
ITEMID="507f1f77bcf86cd799439013"

curl -X PATCH http://localhost:5000/api/v1/kitchen/orders/$ORDERID/items/$ITEMID/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemStatus": "ready"
  }'
```

**Valid Item Statuses:**
- `pending` - Not started
- `preparing` - Currently being prepared
- `ready` - Ready to serve
- `served` - Given to customer

**Expected Response:**
```json
{
  "success": true,
  "message": "Item status updated to ready",
  "order": { ... }
}
```

---

#### 1.5 Mark Order as Ready

**Purpose:** Indicate entire order is ready for pickup

**Request:**
```bash
ORDERID="test-order-001"
curl -X PATCH http://localhost:5000/api/v1/kitchen/orders/$ORDERID/ready \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order #test-order-001 is now ready for pickup",
  "order": { ... }
}
```

**Validation:**
- ✅ Status becomes "ready"
- ✅ Customer notified with pickup notification
- ✅ Order appears in "Ready" section

---

#### 1.6 Mark Order as Served

**Purpose:** Mark order as picked up/served

**Request:**
```bash
ORDERID="test-order-001"
curl -X PATCH http://localhost:5000/api/v1/kitchen/orders/$ORDERID/serve \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order #test-order-001 has been served",
  "order": { ... }
}
```

---

#### 1.7 Report Preparation Delay

**Purpose:** Notify customer when order takes longer than expected

**Request:**
```bash
ORDERID="test-order-001"
curl -X PATCH http://localhost:5000/api/v1/kitchen/orders/$ORDERID/delay \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Ingredient shortage for burger, waiting for new stock"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Delay reason recorded and customer notified"
}
```

---

#### 1.8 Reject/Cancel Order

**Purpose:** Reject order due to issues or unavailable items

**Request:**
```bash
ORDERID="test-order-001"
curl -X PATCH http://localhost:5000/api/v1/kitchen/orders/$ORDERID/reject \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Burger ingredient out of stock"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Order #test-order-001 has been rejected"
}
```

---

### **Section 2: Food Availability Management**

---

#### 2.1 Get Menu Availability

**Purpose:** View all menu items and their availability status

**Request:**
```bash
curl -X GET http://localhost:5000/api/v1/kitchen/menu-availability \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 24,
  "items": [
    {
      "id": "507f1f77bcf86cd799439015",
      "name": {
        "en": "Burger",
        "am": "በርገር"
      },
      "category": "main-meals",
      "price": 85,
      "isAvailable": true,
      "preparationTime": 10,
      "outOfStockReason": null,
      "lastUpdate": "2026-09-01T12:00:00Z"
    },
    {
      "id": "507f1f77bcf86cd799439016",
      "name": {
        "en": "Fries",
        "am": "ፍራይስ"
      },
      "category": "main-meals",
      "price": 45,
      "isAvailable": false,
      "preparationTime": 8,
      "outOfStockReason": "Potatoes out of stock",
      "lastUpdate": "2026-09-01T13:30:00Z"
    }
  ]
}
```

---

#### 2.2 Toggle Item Availability

**Purpose:** Mark item as unavailable or available

**Request:**
```bash
ITEMID="507f1f77bcf86cd799439015"

# Mark as unavailable
curl -X PATCH http://localhost:5000/api/v1/kitchen/menu/$ITEMID/availability \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isAvailable": false,
    "reason": "Sold out for today"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Item availability updated: Out of stock",
  "item": {
    "id": "507f1f77bcf86cd799439015",
    "name": { "en": "Burger", "am": "በርገር" },
    "isAvailable": false,
    "outOfStockReason": "Sold out for today",
    "lastUpdate": "2026-09-01T14:00:00Z"
  }
}
```

**Validation:**
- ✅ Stock alert automatically created
- ✅ Affected customers notified
- ✅ Item marked unavailable in menu

---

#### 2.3 Report Stock Issue

**Purpose:** Report ingredient or stock problems

**Request:**
```bash
curl -X POST http://localhost:5000/api/v1/kitchen/stock-alerts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "507f1f77bcf86cd799439015",
    "itemName": "Burger",
    "alertType": "ingredient_shortage",
    "severity": "high",
    "reason": "Beef supply delayed, expected arrival in 30 minutes"
  }'
```

**Valid alertType values:**
- `out_of_stock` - Item completely unavailable
- `low_stock` - Running low but available
- `ingredient_shortage` - Missing ingredient
- `quality_issue` - Quality problem detected

**Valid severity values:**
- `low` - Can continue but plan to fix
- `medium` - Should address soon
- `high` - Needs immediate attention
- `critical` - Stop production immediately

**Expected Response:**
```json
{
  "success": true,
  "message": "Stock issue reported successfully",
  "alert": {
    "id": "507f1f77bcf86cd799439017",
    "itemName": "Burger",
    "alertType": "ingredient_shortage",
    "severity": "high",
    "status": "active",
    "createdAt": "2026-09-01T14:05:00Z"
  }
}
```

---

#### 2.4 Get Stock Alerts

**Purpose:** View all active stock alerts

**Request:**
```bash
# Get all active alerts
curl -X GET http://localhost:5000/api/v1/kitchen/stock-alerts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# Get only active alerts
curl -X GET "http://localhost:5000/api/v1/kitchen/stock-alerts?status=active" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "count": 3,
  "alerts": [
    {
      "id": "507f1f77bcf86cd799439017",
      "itemName": "Burger",
      "alertType": "ingredient_shortage",
      "severity": "high",
      "reason": "Beef supply delayed",
      "status": "active",
      "reportedBy": "John Kitchen",
      "affectedOrders": 2,
      "createdAt": "2026-09-01T14:05:00Z"
    }
  ]
}
```

---

### **Section 3: Kitchen Staff Shift Management**

---

#### 3.1 Get Current Shift (Kitchen Staff)

**Purpose:** View current active shift information

**Request:**
```bash
curl -X GET http://localhost:5000/api/v1/kitchen-staff/shifts/current \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "shift": {
    "id": "507f1f77bcf86cd799439018",
    "staff": {
      "id": "507f1f77bcf86cd799439019",
      "name": "John Kitchen",
      "email": "john@example.com"
    },
    "shiftType": "morning",
    "startTime": "2026-09-01T06:00:00Z",
    "endTime": "2026-09-01T14:00:00Z",
    "status": "active",
    "clockInTime": "2026-09-01T06:05:00Z",
    "clockOutTime": null,
    "ordersCompleted": 0,
    "averagePreparationTime": 0
  }
}
```

---

#### 3.2 Clock In Shift

**Purpose:** Start work shift

**Request:**
```bash
SHIFTID="507f1f77bcf86cd799439018"
curl -X PATCH http://localhost:5000/api/v1/kitchen-staff/shifts/$SHIFTID/clock-in \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Clocked in successfully",
  "shift": {
    "id": "507f1f77bcf86cd799439018",
    "status": "active",
    "clockInTime": "2026-09-01T06:05:32Z"
  }
}
```

---

#### 3.3 Clock Out Shift

**Purpose:** End work shift and calculate performance metrics

**Request:**
```bash
SHIFTID="507f1f77bcf86cd799439018"
curl -X PATCH http://localhost:5000/api/v1/kitchen-staff/shifts/$SHIFTID/clock-out \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Clocked out successfully",
  "shift": {
    "id": "507f1f77bcf86cd799439018",
    "status": "completed",
    "clockInTime": "2026-09-01T06:05:32Z",
    "clockOutTime": "2026-09-01T14:02:15Z",
    "ordersCompleted": 23,
    "averagePreparationTime": 18
  }
}
```

---

#### 3.4 Start Break

**Purpose:** Take a break during shift

**Request:**
```bash
SHIFTID="507f1f77bcf86cd799439018"
curl -X PATCH http://localhost:5000/api/v1/kitchen-staff/shifts/$SHIFTID/break/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Lunch break"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Break started"
}
```

---

#### 3.5 End Break

**Purpose:** Return from break

**Request:**
```bash
SHIFTID="507f1f77bcf86cd799439018"
curl -X PATCH http://localhost:5000/api/v1/kitchen-staff/shifts/$SHIFTID/break/end \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Break ended"
}
```

---

### **Section 4: Kitchen Analytics & Reports**

---

#### 4.1 Get Detailed Kitchen Stats

**Purpose:** View real-time kitchen performance metrics

**Request:**
```bash
curl -X GET http://localhost:5000/api/v1/kitchen/stats/detailed \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "stats": {
    "ordersStatus": {
      "pending": 3,
      "preparing": 5,
      "ready": 2,
      "served": 18,
      "totalActive": 8
    },
    "performance": {
      "averagePreparationTime": 16,
      "totalOrdersToday": 28,
      "completionRate": 18
    },
    "topItems": [
      {
        "name": "Burger",
        "count": 12
      },
      {
        "name": "Fries",
        "count": 10
      }
    ],
    "staffing": {
      "activeStaffMembers": 3,
      "stockAlerts": 2
    },
    "peakHour": "12:00",
    "timestamp": "2026-09-01T14:10:00Z"
  }
}
```

---

#### 4.2 Generate Daily Report (Admin Only)

**Purpose:** Create daily performance report

**Request:**
```bash
curl -X POST http://localhost:5000/api/v1/kitchen/reports/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Daily report generated successfully",
  "report": {
    "id": "507f1f77bcf86cd799439020",
    "reportDate": "2026-09-01",
    "reportType": "daily",
    "totalOrdersReceived": 45,
    "totalOrdersCompleted": 42,
    "totalOrdersCancelled": 3,
    "orderFulfillmentRate": 93,
    "averagePreparationTime": 16,
    "mostPreparedItems": [
      { "itemName": "Burger", "count": 15 }
    ],
    "staffPerformance": [
      {
        "staffName": "John Kitchen",
        "ordersCompleted": 23,
        "averageTime": 15,
        "efficiency": 85
      }
    ]
  }
}
```

---

#### 4.3 Get Staff Performance Metrics

**Purpose:** View individual staff member performance

**Request:**
```bash
STAFFID="507f1f77bcf86cd799439019"

curl -X GET "http://localhost:5000/api/v1/kitchen/staff/$STAFFID/performance" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# With date range
curl -X GET "http://localhost:5000/api/v1/kitchen/staff/$STAFFID/performance?startDate=2026-09-01&endDate=2026-09-30" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "performance": {
    "staffId": "507f1f77bcf86cd799439019",
    "totalShifts": 12,
    "totalOrdersCompleted": 245,
    "averagePreparationTime": 15,
    "totalActiveHours": 96.5,
    "averageOrdersPerHour": "2.54",
    "averageBreakTimePerShift": 35,
    "efficiency": 95
  }
}
```

---

## 📊 Postman Collection

Save this as `Kitchen-Staff-API.postman_collection.json`:

```json
{
  "info": {
    "name": "Kitchen Staff API",
    "description": "Complete Kitchen Staff Management APIs",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "  var jsonData = pm.response.json();",
                  "  pm.environment.set('token', jsonData.token);",
                  "  pm.environment.set('userId', jsonData.user.id);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"kitchen@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Order Management",
      "item": [
        {
          "name": "Get Dashboard",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/kitchen/dashboard",
              "host": ["{{baseUrl}}"],
              "path": ["kitchen", "dashboard"]
            }
          }
        },
        {
          "name": "Accept Order",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/kitchen/orders/{{orderId}}/accept",
              "host": ["{{baseUrl}}"],
              "path": ["kitchen", "orders", "{{orderId}}", "accept"]
            }
          }
        }
      ]
    }
  ]
}
```

**To Import in Postman:**
1. Open Postman
2. Click "Import"
3. Paste the collection JSON
4. Set environment variables:
   - `baseUrl`: `http://localhost:5000/api/v1`
   - `token`: (Auto-populated after login)

---

## ✨ Testing Workflow

### **Daily Testing Scenario**

1. **Staff Login**
   - Test: Login endpoint
   - Expected: Token saved in environment

2. **Start Shift**
   - Test: Get current shift
   - Test: Clock in shift

3. **Process Orders**
   - Test: Get dashboard
   - Test: Accept order
   - Test: Update item status
   - Test: Mark ready
   - Test: Mark served

4. **Manage Availability**
   - Test: Get menu availability
   - Test: Update item availability

5. **Report Issues**
   - Test: Report stock issue
   - Test: Get stock alerts

6. **View Analytics**
   - Test: Get detailed stats
   - Test: Get staff performance

7. **End Shift**
   - Test: Clock out shift

---

## 🐛 Debugging Tips

### Problem: Invalid Token
```
"error": "Invalid or expired token"
```
**Solution:** Ensure token is fresh (login again)

### Problem: Access Denied
```
"error": "Forbidden"
```
**Solution:** Check user role is `kitchen` or `KITCHEN_STAFF`

### Problem: Order Not Found
```
"error": "Order not found"
```
**Solution:** Verify order ID is correct and order exists

### Problem: Item Status Invalid
```
"error": "Order cannot be marked ready (status: pending)"
```
**Solution:** Must be in "preparing" status to mark ready

---

## 📚 Additional Resources

- [API Documentation](./KITCHEN_STAFF_IMPLEMENTATION.md)
- [Database Schema](./KITCHEN_STAFF_IMPLEMENTATION.md#database-models)
- [Error Codes](#debugging-tips)
- [Socket.io Events](#real-time-features)

---

**Last Updated:** September 1, 2026
**Version:** 1.0
