# Components Directory

React components and custom hooks for the QLI003 Inventory Application.

## Main Components

- **InventoryAppRefactored.jsx** - Modular main component (recommended for development)
- **InventoryApp.jsx** - Original monolithic component

## UI Components

### Core Components
- **AppHeader.jsx** - Logo, user info, logout button
- **Header.jsx** - Table selection dropdown, report generation
- **DashboardStats.jsx** - Statistics cards and low stock alerts
- **ActionButtonsBar.jsx** - Add Equipment, Export, Generate Report buttons
- **SearchAndFilter.jsx** - Search bar and filter controls
- **EquipmentTable.jsx** - Basic data table with dynamic columns
- **EquipmentTableWithActions.jsx** - Enhanced table with inline action buttons (checkout, checkin, edit, delete)
- **ActionButtons.jsx** - Sidebar action buttons (legacy)
- **ErrorDisplay.jsx** - Error message display

### Modal Components
- **EquipmentAddModal.jsx** - Add new equipment form
- **EquipmentEditModal.jsx** - Edit equipment details (Name, Description, Location, Threshold, Vendor Link)
- **EquipmentCheckOutModal.jsx** - Quick checkout with quantity input
- **EquipmentCheckInModal.jsx** - Check in equipment with quantity input
- **EquipmentSignOutModal.jsx** - Full sign-out with transaction logging
- **EquipmentDetailsModal.jsx** - View detailed equipment information
- **EquipmentUpdateModal.jsx** - Update equipment descriptions (legacy)
- **QuickCheckOutSelector.jsx** - Select equipment for quick checkout

---

## Custom Hooks

- **useEquipmentData.js** - Fetches and manages equipment data (returns: `equipment`, `loading`, `error`, `fetchEquipment`)
- **useReportGeneration.js** - Handles report generation and email sending (returns: `reportStatus`, `handleGenerateReport`)
- **useSignalR.js** - Manages SignalR real-time connection for live updates
- **useLowStockCount.js** - Calculates number of items below threshold
- **useEquipmentFilter.js** - Search and filter logic (returns: filtered data, search/filter state and setters)

## Quick Start

Update `App.js` to use the refactored component:
```javascript
import InventoryApp from './components/InventoryAppRefactored';
```

## Key Features

- **Modular Architecture** - Separated components and custom hooks
- **Real-time Updates** - SignalR integration for live data sync
- **Search & Filter** - By name, description, location, and status
- **Low Stock Alerts** - Dashboard warnings for items below threshold
- **CRUD Operations** - Add, edit, checkout, checkin, delete equipment
- **Transaction Logging** - Full audit trail for sign-outs
- **Report Generation** - Email PDF reports
