# 👨‍🍳 Kitchen Staff Implementation Guide

## Overview
This document outlines the comprehensive Kitchen Staff management system implemented for the Smart Cafeteria Ordering System. It includes all APIs, database models, and frontend features.

---

## 📦 Database Models Added/Updated

### 1. **Order Model (Updated)**
Enhanced with item-level tracking and kitchen operations fields:

```javascript
// New fields added:
{
  items: [{
    // ... existing fields
    itemStatus: String,           // "pending" | "preparing" | "ready" | "served"
    preparationStartedAt: Date,
    preparationCompletedAt: Date
  }],
  estimatedCompletionTime: Date,  // Calculated when order is accepted
  preparationDelayReason: String, // Reason if order takes longer
  kitchenStaffAssigned: ObjectId, // Reference to User (kitchen staff)
  priority: String,               // "normal" | "rush" | "vip"
  qualityCheckStatus: String      // "pending" | "passed" | "failed"
}
```

### 2. **MenuItem Model (Updated)**
Fixed duplicate fields and added inventory tracking:

```javascript
// Removed duplicate 'availability' field
// Updated to use 'isAvailable' as primary field
{
  isAvailable: Boolean,
  outOfStockReason: String,
  lastAvailabilityUpdate: Date,
  updatedBy: ObjectId  // Reference to User who updated availability
}
```

### 3. **KitchenShift Model (New)**
Tracks kitchen staff shifts and work hours:

```javascript
{
  staffId: ObjectId,              // Reference to User
  shiftType: String,              // "morning" | "afternoon" | "evening" | "night" | "custom"
  startTime: Date,
  endTime: Date,
  status: String,                 // "scheduled" | "active" | "completed" | "cancelled"
  clockInTime: Date,
  clockOutTime: Date,
  breaksStarted: [{
    startTime: Date,
    endTime: Date,
    reason: String
  }],
  ordersAssigned: Number,
  ordersCompleted: Number,
  averagePreparationTime: Number, // in minutes
  notes: String
}
```

### 4. **StockAlert Model (New)**
Tracks inventory and ingredient issues:

```javascript
{
  itemId: ObjectId,               // Reference to MenuItem
  itemName: String,
  alertType: String,              // "out_of_stock" | "low_stock" | "ingredient_shortage" | "quality_issue"
  severity: String,               // "low" | "medium" | "high" | "critical"
  reason: String,
  reportedBy: ObjectId,           // Reference to User
  reportedByRole: String,         // "kitchen" | "admin"
  status: String,                 // "active" | "acknowledged" | "resolved" | "cancelled"
  resolutionNote: String,
  resolvedBy: ObjectId,
  resolvedAt: Date,
  affectedOrders: [{
    orderId: ObjectId,
    orderNumber: String
  }],
  estimatedResolutionTime: Date
}
```

### 5. **KitchenReport Model (New)**
Stores kitchen performance analytics:

```javascript
{
  reportDate: Date,
  reportType: String,             // "daily" | "weekly" | "monthly"
  staffId: ObjectId,              // Optional - for staff-specific reports
  totalOrdersReceived: Number,
  totalOrdersCompleted: Number,
  totalOrdersCancelled: Number,
  orderFulfillmentRate: Number,   // percentage
  averagePreparationTime: Number, // minutes
  peakHourOrders: Number,
  peakHourTime: String,
  totalItemsPrepared: Number,
  mostPreparedItems: [{
    itemId: ObjectId,
    itemName: String,
    count: Number
  }],
  staffPerformance: [{
    staffId: ObjectId,
    staffName: String,
    ordersCompleted: Number,
    averageTime: Number,
    efficiency: Number
  }],
  qualityIssuesReported: Number,
  stockIssuesReported: Number
}
```

---

## 🔌 Backend APIs

### Authentication & Authorization
All endpoints require JWT token with `kitchen` or `KITCHEN_STAFF` role (case-insensitive).

Header: `Authorization: Bearer <token>`

---

## 📋 Order Management APIs

### 1. **Get Kitchen Dashboard**
```
GET /api/v1/kitchen/dashboard
Response: { success, stats, orders: { pending: [], preparing: [], ready: [] } }
```

### 2. **Get Kitchen Orders (List View)**
```
GET /api/v1/kitchen/orders?status=pending|preparing|ready|served
Response: { success, count, orders: [] }
```

### 3. **Get Order Details (Item-Level Tracking)**
```
GET /api/v1/kitchen/orders/:orderId/details
Response: { success, order: { ...full details with item statuses } }
```

### 4. **Accept Order**
```
PATCH /api/v1/kitchen/orders/:orderId/accept
- Calculates estimated completion time based on menu preparation times
- Assigns kitchen staff member
- Sets initial item statuses
- Notifies customer with ETA
Response: { success, message, order }
```

### 5. **Mark Order as Ready**
```
PATCH /api/v1/kitchen/orders/:orderId/ready
Response: { success, message, order }
```

### 6. **Mark Order as Served**
```
PATCH /api/v1/kitchen/orders/:orderId/serve
Response: { success, message, order }
```

### 7. **Reject/Cancel Order**
```
PATCH /api/v1/kitchen/orders/:orderId/reject
Body: { reason: "string" }
Response: { success, message }
```

### 8. **Update Item-Level Preparation Status**
```
PATCH /api/v1/kitchen/orders/:orderId/items/:itemId/status
Body: { itemStatus: "pending|preparing|ready|served" }
Response: { success, message, order }
```

### 9. **Report Preparation Delay**
```
PATCH /api/v1/kitchen/orders/:orderId/delay
Body: { reason: "string" }
- Notifies customer of delay
Response: { success, message }
```

### 10. **Get Kitchen Stats**
```
GET /api/v1/kitchen/stats
Response: { success, stats: { pending, preparing, ready, activeOrders, completedToday } }
```

---

## 🍔 Food Availability Management APIs

### 1. **Get Menu Availability**
```
GET /api/v1/kitchen/menu-availability
Response: { success, count, items: [...] }
- Shows all menu items with availability status
```

### 2. **Update Item Availability**
```
PATCH /api/v1/kitchen/menu/:itemId/availability
Body: { 
  isAvailable: boolean,
  reason: "string" // required if marking unavailable
}
- Automatically creates stock alert if item becomes unavailable
- Notifies customers with affected orders
- Emits socket event to notify other kitchen staff
Response: { success, message, item }
```

### 3. **Report Stock Issue**
```
POST /api/v1/kitchen/stock-alerts
Body: {
  itemId: "ObjectId",           // optional
  itemName: "string",           // required
  alertType: "out_of_stock|low_stock|ingredient_shortage|quality_issue",
  severity: "low|medium|high|critical",
  reason: "string"              // required
}
Response: { success, message, alert }
```

### 4. **Get Stock Alerts**
```
GET /api/v1/kitchen/stock-alerts?status=active|acknowledged|resolved
Response: { success, count, alerts: [] }
```

---

## 👥 Kitchen Staff Management APIs

### 1. **Get Kitchen Shifts**
```
GET /api/v1/kitchen-staff/shifts?status=scheduled|active|completed&staffId=ID&date=YYYY-MM-DD
Response: { success, count, shifts: [...] }
```

### 2. **Create Kitchen Shift** (Admin only)
```
POST /api/v1/kitchen-staff/shifts
Body: {
  staffId: "ObjectId",
  shiftType: "morning|afternoon|evening|night|custom",
  startTime: "ISO-8601",
  endTime: "ISO-8601"
}
- Validates no conflicting shifts
- Notifies staff member
Response: { success, message, shift }
```

### 3. **Get Current Shift**
```
GET /api/v1/kitchen-staff/shifts/current
Response: { success, shift: {...} | null }
```

### 4. **Clock In Shift**
```
PATCH /api/v1/kitchen-staff/shifts/:shiftId/clock-in
- Changes shift status to "active"
Response: { success, message, shift }
```

### 5. **Clock Out Shift**
```
PATCH /api/v1/kitchen-staff/shifts/:shiftId/clock-out
- Changes shift status to "completed"
- Calculates orders completed and average prep time
Response: { success, message, shift }
```

### 6. **Start Break**
```
PATCH /api/v1/kitchen-staff/shifts/:shiftId/break/start
Body: { reason: "string" }
Response: { success, message, shift }
```

### 7. **End Break**
```
PATCH /api/v1/kitchen-staff/shifts/:shiftId/break/end
Response: { success, message, shift }
```

### 8. **Get Kitchen Staff Members** (Admin only)
```
GET /api/v1/kitchen-staff/members
Response: { success, count, staff: [...] }
```

---

## 📊 Kitchen Reports & Analytics APIs

### 1. **Get Kitchen Reports**
```
GET /api/v1/kitchen/reports?startDate=ISO&endDate=ISO&reportType=daily|weekly|monthly
Response: { success, count, reports: [...] }
```

### 2. **Generate Daily Report** (Admin only)
```
POST /api/v1/kitchen/reports/generate
- Aggregates orders from today
- Calculates performance metrics
- Stores in KitchenReport collection
Response: { success, message, report }
```

### 3. **Get Detailed Kitchen Stats**
```
GET /api/v1/kitchen/stats/detailed
Response: { success, stats: {
  ordersStatus: { pending, preparing, ready, served, totalActive },
  performance: { averagePreparationTime, totalOrdersToday, completionRate },
  topItems: [],
  staffing: { activeStaffMembers, stockAlerts },
  peakHour: "string",
  timestamp: Date
}}
```

### 4. **Get Staff Performance Metrics**
```
GET /api/v1/kitchen/staff/:staffId/performance?startDate=ISO&endDate=ISO
Response: { success, performance: {
  totalShifts, totalOrdersCompleted, averagePreparationTime,
  totalActiveHours, averageOrdersPerHour, averageBreakTimePerShift,
  efficiency
}}
```

### 5. **Get Order Preparation Report**
```
GET /api/v1/kitchen/reports/orders?startDate=ISO&endDate=ISO&status=served|cancelled
Response: { success, count, orders: [...] }
```

---

## 🖥️ Frontend Pages Created

### 1. **Order Details Page** (`order-details.html`)
- Path: `/kitchen/order-details.html?id=<orderId>`
- Features:
  - View complete order with customer info
  - Item-level status tracking with individual status updates
  - Timeline view of order progression
  - Report delay functionality
  - Mark as ready/served buttons
  - Real-time time tracking

### 2. **Food Availability Page** (`availability.html`)
- Path: `/kitchen/availability.html`
- Features:
  - View all menu items with current availability
  - Filter by category and status
  - Mark items as unavailable with reason
  - Mark items as available again
  - Shows out-of-stock reasons
  - Real-time updates

### 3. **Stock Alerts Page** (`stock-alerts.html`)
- Path: `/kitchen/stock-alerts.html`
- Features:
  - View active and resolved stock alerts
  - Report new stock/ingredient issues
  - Severity levels and categorization
  - Acknowledge and resolve alerts
  - Affected orders tracking
  - Auto-refresh every 30 seconds

### 4. **JavaScript Files Created**
- `order-details.js` - Order detail page logic
- `availability.js` - Food availability management
- `stock-alerts.js` - Stock alert handling

---

## 🔄 Real-Time Features

Socket.io events implemented:

```javascript
// Kitchen staff receives these events
'order:new'                  // New order arrived
'order:status'               // Order status changed
'item:unavailable'           // Food item marked unavailable
'stock:alert'                // Stock alert created
'notification:new'           // General notification

// Emitted by kitchen staff
(handled automatically via API)
```

---

## ✅ Key Features Implemented

### Kitchen Order Management
✅ Accept/reject orders
✅ Track order status progression
✅ Item-level preparation status
✅ Estimated completion time calculation
✅ Mark orders as ready/served
✅ Report preparation delays
✅ Assign staff members to orders
✅ Set order priority (normal/rush/VIP)

### Food Availability Management
✅ View all menu items and current availability
✅ Mark items as out of stock with reasons
✅ Toggle availability on demand
✅ Auto-notify customers when items become unavailable
✅ Track who updated availability and when
✅ Stock alert system

### Kitchen Staff Management
✅ Create and schedule shifts
✅ Clock in/out tracking
✅ Break time tracking
✅ Assign staff to orders
✅ Track orders completed per staff member
✅ Calculate average preparation time per staff

### Analytics & Reports
✅ Daily kitchen performance reports
✅ Order fulfillment rate metrics
✅ Average preparation time tracking
✅ Peak hour analysis
✅ Most ordered items report
✅ Staff performance metrics
✅ Workload distribution tracking

---

## 🛠️ Installation & Setup

### 1. Database Migration
The new models will be created automatically when first accessed by MongoDB Mongoose.

### 2. Update Server Routes
Routes are already registered in `server.js`:
```javascript
app.use('/api/v1/kitchen-staff', kitchenStaffRoutes);
app.use('/api/v1/kitchen', kitchenReportsRoutes);
```

### 3. Frontend Integration
Add navigation links in the kitchen dashboard to:
- `order-details.html?id=<orderId>` - View order details
- `availability.html` - Manage food availability
- `stock-alerts.html` - View stock alerts

---

## 🔐 Role & Authorization

Kitchen staff endpoints use case-insensitive role checking:
- Accepts: `kitchen`, `KITCHEN_STAFF`
- Admin endpoints require: `admin`, `ADMIN`

Authorization middleware updated in `auth.js` to handle both cases.

---

## 📱 Testing Checklist

- [ ] Create kitchen staff user account
- [ ] Accept orders and verify estimated time calculation
- [ ] Update item availability and check notifications
- [ ] Report stock issues
- [ ] Create and manage shifts
- [ ] Clock in/out and track work hours
- [ ] View kitchen dashboard and stats
- [ ] Generate daily reports
- [ ] Test real-time socket updates
- [ ] Verify role-based access control

---

## 🚀 Next Steps (Optional Enhancements)

1. **Kitchen Station Assignment** - Assign orders to specific stations (Grill, Fryer, etc.)
2. **Recipe Management** - Link recipes and ingredients to menu items
3. **Quality Control** - Add QC inspection workflow
4. **Advanced Analytics** - Dashboards and trend analysis
5. **Mobile App** - Dedicated kitchen staff mobile application
6. **Order Bundling** - Group related orders for efficiency
7. **Ingredient Tracking** - Real-time inventory management
8. **Kitchen Display System (KDS)** - Full-screen order display for physical displays

---

## 📞 Support

For issues or questions about the implementation, refer to:
- API endpoint documentation above
- Database model schemas in `/Backend/src/models/`
- Frontend pages in `/Frontend/src/pages/kitchen/`
- JavaScript logic in `/Frontend/src/js/kitchen/`
