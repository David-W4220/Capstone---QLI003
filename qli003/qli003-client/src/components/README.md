# Components Directory

React components and custom hooks for the QLI003 Inventory Application.

## Main Components

- **InventoryAppRefactored.jsx** - Modular main component (✅ CURRENT - in use)
- **InventoryApp.jsx** - Original monolithic component (moved to legacy)

## UI Components

### Core Components
- **AppHeader.jsx** - Logo, user info, logout button
- **Header.jsx** - View selector dropdown (Equipment, Admins, Audit Log, Transaction Log)
- **DashboardStats.jsx** - Statistics cards and low stock alerts
- **LowStockAlert.jsx** - Inline alert for low stock equipment, used in dashboard and tables
- **ActionButtonsBar.jsx** - Add Equipment, Export, Generate Report buttons
- **SearchAndFilter.jsx** - Search bar and filter controls
- **EquipmentTable.jsx** - Basic data table with dynamic columns
- **EquipmentTableWithActions.jsx** - Enhanced table with inline action buttons (checkout, checkin, edit, delete)
- **AuditLogTable.jsx** - Audit log display with search/filter/sort, color-coded action badges
- **TransactionLogTable.jsx** - Transaction log display with check-in/out tracking, user names
- **ActionButtons.jsx** - Sidebar action buttons (legacy)
- **ErrorDisplay.jsx** - Error message display

### Modal Components
- **EquipmentAddModal.jsx** - Add new equipment form
- **EquipmentEditModal.jsx** - Edit equipment details (Name, Description, Location, Threshold, Vendor Link)
- **EquipmentCheckOutModal.jsx** - Simplified checkout with quantity input
- **EquipmentCheckInModal.jsx** - Check in equipment with quantity input and transaction logging
- **EquipmentDeleteModal.jsx** - Confirmation modal for deleting equipment
- **EquipmentDetailsModal.jsx** - View detailed equipment information
- **AuditLogDetailsModal.jsx** - View full audit log entry details
- **TransactionLogDetailsModal.jsx** - View full transaction details with parsed user info
- **EquipmentUpdateModal.jsx** - Update equipment descriptions (legacy)

### Legacy Components (archived)
- **legacy/EquipmentSignOutModal.jsx** - Old sign-out modal with equipment dropdown
- **legacy/EquipmentSignOutModal2.jsx** - Duplicate archived modal
- **legacy/InventoryApp.jsx** - Original monolithic component

---

## Custom Hooks

- **useEquipmentData.js** - Fetches and manages equipment data (returns: `equipment`, `loading`, `error`, `fetchEquipment`)
- **useReportGeneration.js** - Handles report generation and email sending (returns: `reportStatus`, `handleGenerateReport`)
- **useSignalR.js** - Manages SignalR real-time connection for live updates
- **useLowStockCount.js** - Calculates number of items below threshold
- **useEquipmentFilter.js** - Search and filter logic (returns: filtered data, search/filter state and setters)

## Key Features

### ✅ Implemented
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

### ❌ Not Yet Implemented (From Project Requirements)
- **Equipment Categories** - Maintain equipment categories and specifications
- **User Roles and Permissions** - Manage user roles and permissions (Admin vs OT/PT)
- **Automated Low Inventory Alerts** - Generate automated low inventory alerts via email
- **Email Notifications for Inventory Changes** - Send email notifications for inventory changes (checkout/checkin)
- **Automated Reorder Suggestions** - Create automated reorder suggestions with vendor links
- **Email Summaries** - Notification of changes on dashboard / Email summary


