# Components Directory - Organized Structure

React components and custom hooks for the QLI003 Inventory Application.

## Folder Structure

```
components/
├── hooks/          # Custom React hooks
├── layout/         # Layout and header components  
├── legacy/         # Archived legacy components
├── main/           # Main application components
├── modals/         # Modal dialog components
├── tables/         # Table display components
└── ui/             # UI elements (buttons, alerts, filters, etc.)
```

---

## hooks/

Custom React hooks for state management and data fetching.

- **useEquipmentData.js** - Fetches and manages equipment data (returns: `equipment`, `loading`, `error`, `fetchEquipment`)
- **useReportGeneration.js** - Handles report generation and email sending (returns: `reportStatus`, `handleGenerateReport`)
- **useSignalR.js** - Manages SignalR real-time connection for live updates
- **useLowStockCount.js** - Calculates number of items below threshold
- **useEquipmentFilter.js** - Search and filter logic (returns: filtered data, search/filter state and setters)

---

## main/

Main application components that compose the app.

- **InventoryAppRefactored.jsx** - **CURRENT** - Modular main component (in use)
- **InventoryApp.jsx** - Original monolithic component (archived, kept for reference)
- **README.md** - This documentation file

**Note:** `App.js` imports from `./components/main/InventoryAppRefactored`

---

## layout/

Layout components for the application structure.

- **AppHeader.jsx** - Top app bar with logo, user info, and logout button
- **Header.jsx** - View selector dropdown (Equipment, Admins, Audit Log, Transaction Log)

---

## ui/

Reusable UI components and widgets.

- **ActionButtonsBar.jsx** - Add Equipment, Export, Generate Report buttons
- **DashboardStats.jsx** - Statistics cards and low stock alerts
- **ErrorDisplay.jsx** - Error message display component
- **LowStockAlert.jsx** - Inline alert for low stock equipment
- **SearchAndFilter.jsx** - Search bar and filter controls

---

## tables/

Data table components for displaying different views.

- **EquipmentTable.jsx** - Basic data table with dynamic columns
- **EquipmentTableWithActions.jsx** - Enhanced table with inline action buttons (checkout, checkin, edit, delete)
- **AuditLogTable.jsx** - Audit log display with search/filter/sort, color-coded action badges
- **TransactionLogTable.jsx** - Transaction log display with check-in/out tracking, user names

---

## modals/

Modal dialog components for user interactions.

### Equipment Modals

- **EquipmentAddModal.jsx** - Add new equipment form
- **EquipmentEditModal.jsx** - Edit equipment details (Name, Description, Location, Threshold, Vendor Link)
- **EquipmentCheckOutModal.jsx** - Simplified checkout with quantity input
- **EquipmentCheckInModal.jsx** - Check in equipment with quantity input and transaction logging
- **EquipmentDeleteModal.jsx** - Confirmation modal for deleting equipment
- **EquipmentDetailsModal.jsx** - View detailed equipment information
- **EquipmentUpdateModal.jsx** - Update equipment descriptions (legacy)

### Log Modals

- **AuditLogDetailsModal.jsx** - View full audit log entry details
- **TransactionLogDetailsModal.jsx** - View full transaction details with parsed user info

---

## Key Features

### Implemented

- **Modular Architecture** - Separated components and custom hooks
- **Real-time Updates** - SignalR integration for live data sync at `/qliHub`
- **Search & Filter** - By name, description, location, and status
- **Low Stock Alerts** - Dashboard warnings for items below threshold
- **CRUD Operations** - Add, edit, checkout, checkin, delete equipment
- **Transaction Logging** - Full checkout/checkin history with user tracking
- **Audit Logging** - Track all administrative actions (add/update/delete equipment)
- **Multiple Views** - Equipment, Admins, Audit Log, Transaction Log tables
- **Report Generation** - Email PDF reports with inventory summary
- **Inline Actions** - Quick actions directly from table rows
- **Color-Coded Status** - Visual indicators (green=good, yellow=low, red=critical)
- **Click-to-View Details** - Row click opens detailed modals
- **Scrollable Tables** - Sticky headers with max height for large datasets

### Not Yet Implemented (From Project Requirements)

- **Equipment Categories** - Maintain equipment categories and specifications
- **User Roles and Permissions** - Manage user roles and permissions (Admin vs OT/PT)
- **Automated Low Inventory Alerts** - Generate automated low inventory alerts via email
- **Email Notifications for Inventory Changes** - Send email notifications for inventory changes (checkout/checkin)
- **Automated Reorder Suggestions** - Create automated reorder suggestions with vendor links
- **Email Summaries** - Notification of changes on dashboard / Email summary

---

## Import Paths

All components now use relative imports based on the new folder structure:

```javascript
// Example imports from main/InventoryApp.jsx
import AppHeader from "../layout/AppHeader"
import EquipmentTable from "../tables/EquipmentTable"
import EquipmentAddModal from "../modals/EquipmentAddModal"
import ActionButtonsBar from "../ui/ActionButtonsBar"
import useEquipmentData from "../hooks/useEquipmentData"
```
