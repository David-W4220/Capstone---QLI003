"use client"

import { useState, useEffect, useCallback } from "react"
import AppHeader from "../layout/AppHeader"
import Header from "../layout/Header"
import LowStockAlert from "../ui/LowStockAlert"
import DashboardStats from "../ui/DashboardStats"
import SearchAndFilter from "../ui/SearchAndFilter"
import ActionButtonsBar from "../ui/ActionButtonsBar"
import EquipmentTable from "../tables/EquipmentTable"
import EquipmentTableWithActions from "../tables/EquipmentTableWithActions"
import ErrorDisplay from "../ui/ErrorDisplay"
import EquipmentUpdateModal from "../modals/EquipmentUpdateModal"
import EquipmentDetailsModal from "../modals/EquipmentDetailsModal"
import EquipmentCheckOutModal from "../modals/EquipmentCheckOutModal"
import EquipmentAddModal from "../modals/EquipmentAddModal"
import EquipmentCheckInModal from "../modals/EquipmentCheckInModal"
import EquipmentEditModal from "../modals/EquipmentEditModal"
import EquipmentDeleteModal from "../modals/EquipmentDeleteModal"
import AuditLogTable from "../tables/AuditLogTable"
import AuditLogDetailsModal from "../modals/AuditLogDetailsModal"
import TransactionLogTable from "../tables/TransactionLogTable"
import TransactionLogDetailsModal from "../modals/TransactionLogDetailsModal"
import LoginModal from "../modals/LoginModal" // NEW: Import the new modal
import useEquipmentData from "../hooks/useEquipmentData"
import useReportGeneration from "../hooks/useReportGeneration"
import useSignalR from "../hooks/useSignalR"
import useLowStockCount from "../hooks/useLowStockCount"
import useEquipmentFilter from "../hooks/useEquipmentFilter"

import useAutoReodr from "../hooks/useAutoReodr" //for AutoReorder's UI Feedback

const API_BASE_URL = "https://localhost:7058" // Change the API_Base_URL to your hosts IP.
import useAutoReodr from "../hooks/useAutoReodr"//for AutoReorder's UI Feedback
import AutoReodrRect from "../ui/AutoReodrRect"//NEW rectangle to set reorder mailing interval
// IE: from localhost to 192.168.X.X or the like
const HUB_URL = `${API_BASE_URL}/qliHub`
const LOGIN_API_URL = `${API_BASE_URL}/api/Admins/login` // NEW: Login API URL
const TABLE_CONTROLLERS = {
  Equipment: "Equipment",
  Admins: "Admins",
  "Audit Log": "Auditlog",
  "Transaction Log": "Transactionlog",
}

/**
 * InventoryApp (Main Component)
 * Manages state, data fetching, and SignalR connection.
 */
const InventoryApp = () => {
  // --- UPDATED AUTHENTICATION STATE ---
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Start as logged out
  const [currentUser, setCurrentUser] = useState(null) // Holds user name (e.g., "Olivia")
  const [userRole, setUserRole] = useState("Public") // New state: 'Public' or 'Admin'
  const [showLoginModal, setShowLoginModal] = useState(false) // State for login modal

  // State for which table is currently selected
  const [selectedTable, setSelectedTable] = useState("Equipment")
  const API_URL = `${API_BASE_URL}/api/${selectedTable}`
  const REPORT_API_URL = `${API_BASE_URL}/api/report/send`

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [signOutModalOpen, setSignOutModalOpen] = useState(false)
  const [checkInModalOpen, setCheckInModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [auditLogDetailsOpen, setAuditLogDetailsOpen] = useState(false)
  const [transactionLogDetailsOpen, setTransactionLogDetailsOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)
  const [selectedAuditLog, setSelectedAuditLog] = useState(null)
  const [selectedTransactionLog, setSelectedTransactionLog] = useState(null)

  // Custom hooks
  const { equipment, loading, error, fetchEquipment } = useEquipmentData(API_URL)
  const { reportStatus, handleGenerateReport } = useReportGeneration(REPORT_API_URL)
  const { autoStatus } = useAutoReodr() //for AutoReorder's UI Feedback
  const lowStockCount = useLowStockCount(equipment)
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterLocation,
    setFilterLocation,
    filteredEquipment,
  } = useEquipmentFilter(equipment)

  // Fetch equipment when component mounts or API_URL changes
  useEffect(() => {
    fetchEquipment()
  }, [fetchEquipment])

  // SignalR real-time updates
  useSignalR(HUB_URL, fetchEquipment)

  // --- NEW: Handle Admin Login (API Integration) ---
  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Username: username, Password: password }), // Send credentials
      })

      if (response.ok) {
        const adminData = await response.json()
        
        // Success: Set state based on API response
        setCurrentUser(adminData.Username)
        setUserRole('Admin')
        setIsLoggedIn(true)
        setShowLoginModal(false)
        console.log(`Admin ${adminData.Username} logged in successfully.`)
        return true // Indicate success
      } else {
        // Failure: API returned 401 Unauthorized or similar
        const errorText = await response.text()
        console.error("Login failed:", errorText)
        alert("Login failed: Invalid username or password.")
        return false // Indicate failure
      }
    } catch (error) {
      // Network error
      console.error("Network error during login:", error)
      alert("A network error occurred. Please check the API status.")
      return false // Indicate failure
    }
  }

  // Handle table row click
  const handleRowClick = (item) => {
    if (selectedTable === 'Equipment') {
      setSelectedEquipment(item)
      setDetailsModalOpen(true)
    } else if (selectedTable === 'Auditlog') {
      setSelectedAuditLog(item)
      setAuditLogDetailsOpen(true)
    } else if (selectedTable === 'Transactionlog') {
      setSelectedTransactionLog(item)
      setTransactionLogDetailsOpen(true)
    }
  }

  // Handle check out button click
  const handleCheckOut = () => {
    setSignOutModalOpen(true)
  }

  // Handle table selection change
  const handleTableChange = (table) => {
    if (userRole === 'Admin') {
      setSelectedTable(table)
    } else {
        // Prevent non-admins from changing the table
        setSelectedTable('Equipment')
    }
  }

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentUser(null)
    setUserRole("Public")
    setSelectedTable("Equipment") // Always reset view to Equipment on logout
    console.log("Admin logged out.")
  }

  // Handle view low stock items
  const handleViewLowStock = () => {
    // Set filter to show only low stock items
    setFilterStatus("low")
  }

  // Handle add equipment
  const handleAddEquipment = () => {
    setAddModalOpen(true)
  }

  // Handle export report console.log("Exporting report...")
  const handleExportReport = async () => {
    console.log("Exporting report...")
    try {
      const response = await fetch(`${API_BASE_URL}/api/report/export-summary`, {
        method: "GET",
      })

      if (!response.ok) throw new Error("Failed to generate PDF")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "InventorySummary.pdf")
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
    } catch (error) {
      console.error("Error exporting report:", error)
      alert("Failed to export report. See console for details.")
    }
  }

  // Handle inline table actions
  const handleCheckout = (item) => {
    setSelectedEquipment(item)
    setSignOutModalOpen(true)
  }

  const handleCheckin = (item) => {
    setSelectedEquipment(item)
    setCheckInModalOpen(true)
  }

  const handleEdit = (item) => {
    if (userRole === 'Admin') {
      setSelectedEquipment(item)
      setEditModalOpen(true)
    } else {
        alert("Only Administrators can edit equipment.")
    }
  }

  const handleDelete = (item) => {
    if (userRole === 'Admin') {
      setSelectedEquipment(item)
      setDeleteModalOpen(true)
    } else {
        alert("Only Administrators can delete equipment.")
    }
  }

  const handleConfirmDelete = async (item) => {
    try {
      const equipmentId = item.Equipment_Id || item.ID
      const response = await fetch(`${API_URL}/delete/${equipmentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        console.log("Equipment deleted successfully")

        // Create audit log entry for equipment deletion
        const auditLog = {
          Admin_ID: 1, // TODO: Replace with actual admin ID when authentication is implemented
          Act_Description: `Deleted equipment: ${item.Name} (ID: ${equipmentId})`,
          Timestamp: new Date().toISOString(),
        }

        await fetch(`${API_BASE_URL}/api/Auditlog/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(auditLog),
        })

        fetchEquipment() // Refresh data
      } else {
        console.error("Failed to delete equipment")
        alert("Failed to delete equipment. Please try again.")
      }
    } catch (error) {
      console.error("Error deleting equipment:", error)
      alert("Error deleting equipment. Please try again.")
    }
  }

  // Handle edit submission
  const handleEditSubmit = async (formData) => {
    if (!selectedEquipment) return

    try {
      // Prepare full equipment object for API
      const updateData = {
        ID: selectedEquipment.Equipment_Id || selectedEquipment.ID,
        Name: formData.Name,
        Description: formData.Description,
        Item_Cnt: selectedEquipment.Item_Cnt,
        Alpha_Loc: formData.Location,
        Threshold: parseInt(formData.Threshold) || 0,
        ReodrLk_Pri_Qty: formData.ReorderLink,
        BuyQty: selectedEquipment.BuyQty,
      }

      const response = await fetch(`${API_URL}/update/${updateData.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        console.log("Equipment updated successfully")

        // Create audit log entry for equipment update
        const auditLog = {
          Admin_ID: 1, // TODO: Replace with actual admin ID when authentication is implemented
          Act_Description: `Updated equipment: ${updateData.Name} (ID: ${updateData.ID})`,
          Timestamp: new Date().toISOString(),
        }

        await fetch(`${API_BASE_URL}/api/Auditlog/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(auditLog),
        })

        setEditModalOpen(false)
        setSelectedEquipment(null)
        fetchEquipment() // Refresh data
      } else {
        console.error("Failed to update equipment")
        alert("Failed to update equipment. Please try again.")
      }
    } catch (error) {
      console.error("Error updating equipment:", error)
      alert("Error updating equipment. Please try again.")
    }
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App Header with Logo and User Info - Full width sticky header */}
      <AppHeader 
        currentUser={currentUser}
        userRole={userRole}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onLoginClick={() => setShowLoginModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/*for AutoReorder's UI Feedback */}
        {autoStatus && (
          <div
            className={
              autoStatus.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4"
                : autoStatus.type === "error"
                ? "bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4"
                : ""
            }
          >
            {autoStatus.message}
          </div>
        )}

        {/* Low Stock Alert - Only show for Equipment table */}
        {selectedTable === 'Equipment' && (
          <LowStockAlert
            lowStockCount={lowStockCount}
            onViewLowStock={handleViewLowStock}
          />
        )}

        {/* Table Selection and Report Header (Admin Only) */}
        {userRole === 'Admin' ? (
          <Header
            selectedTable={selectedTable}
            onTableChange={handleTableChange}
            onGenerateReport={handleGenerateReport}
            reportStatus={reportStatus}
            tableControllers={TABLE_CONTROLLERS}
          />
        ) : (
            // Public View Header when dropdown is hidden
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Equipment Inventory</h1>
        )}

        {/* Dashboard Stats Cards - Only show for Equipment table */}
        {selectedTable === 'Equipment' && (
          <DashboardStats
            equipment={equipment}
            lowStockCount={lowStockCount}
          />
        )}

        {/* Action Buttons Bar (Admin Only for Add/Export/Report) */}
        {/* NEW rectangle to set reorder mailing interval */}
        {selectedTable === 'Equipment' && (
          <AutoReodrRect
          API_BASE_URL={API_BASE_URL}
          />
        )}

        {/* Action Buttons Bar - Only show for Equipment table */}
        {selectedTable === 'Equipment' && (
          <ActionButtonsBar
            onAddEquipment={handleAddEquipment} // Pass the handler directly
            onExportReport={handleExportReport} // Pass the handler directly
            onGenerateHistoryReport={handleGenerateReport} // Pass the handler directly
            isGeneratingReport={reportStatus.includes("Generating")}
            userRole={userRole} // <--- CRITICAL: Pass the userRole state
          />
        )}

        {/* Search and Filter - Only show for Equipment table */}
        {selectedTable === 'Equipment' && (
          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            filterLocation={filterLocation}
            onFilterLocationChange={setFilterLocation}
            equipment={equipment}
          />
        )}

        {/* Main Content - Full Width Table with Actions */}
        {selectedTable === 'Equipment' ? (
          <EquipmentTableWithActions
            equipment={filteredEquipment}
            loading={loading}
            userRole={userRole} // Pass role to hide/show inline edit/delete
            onCheckout={handleCheckout}
            onCheckin={handleCheckin}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRowClick={handleRowClick}
          />
        ) : selectedTable === 'Auditlog' ? (
          <AuditLogTable
            logs={equipment}
            loading={loading}
            onRowClick={handleRowClick}
          />
        ) : selectedTable === 'Transactionlog' ? (
          <TransactionLogTable
            logs={equipment}
            loading={loading}
            onRowClick={handleRowClick}
          />
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No table selected</p>
          </div>
        )}

        {/* Modals */}
        <EquipmentDetailsModal 
          equipment={selectedEquipment}
          isOpen={detailsModalOpen}
          onClose={() => {
            setDetailsModalOpen(false)
            setSelectedEquipment(null)
          }}
        />
        
        <EquipmentCheckOutModal 
          selectedEquipment={selectedEquipment}
          isOpen={signOutModalOpen}
          onClose={() => {
            setSignOutModalOpen(false)
            setSelectedEquipment(null)
          }}
          onSignOut={fetchEquipment}
          API_URL={API_URL}
        />

        <EquipmentAddModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={fetchEquipment}
          API_URL={API_URL}
        />

        <EquipmentCheckInModal
          selectedEquipment={selectedEquipment}
          isOpen={checkInModalOpen}
          onClose={() => {
            setCheckInModalOpen(false)
            setSelectedEquipment(null)
          }}
          onCheckIn={fetchEquipment}
          API_URL={API_URL}
        />

        <EquipmentEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
            setSelectedEquipment(null)
          }}
          equipment={selectedEquipment}
          onSave={handleEditSubmit}
        />

        <EquipmentDeleteModal
          equipment={selectedEquipment}
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setSelectedEquipment(null)
          }}
          onConfirm={handleConfirmDelete}
        />

        <AuditLogDetailsModal
          log={selectedAuditLog}
          isOpen={auditLogDetailsOpen}
          onClose={() => {
            setAuditLogDetailsOpen(false)
            setSelectedAuditLog(null)
          }}
        />

        <TransactionLogDetailsModal
          log={selectedTransactionLog}
          isOpen={transactionLogDetailsOpen}
          onClose={() => {
            setTransactionLogDetailsOpen(false)
            setSelectedTransactionLog(null)
          }}
        />

        {/* NEW: Login Modal Inclusion */}
        <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
        />

      </div>
    </div>
  )
}

export default InventoryApp