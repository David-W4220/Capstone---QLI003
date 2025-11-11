"use client"

import { useState, useEffect } from "react"
import AppHeader from "./AppHeader"
import Header from "./Header"
import DashboardStats from "./DashboardStats"
import SearchAndFilter from "./SearchAndFilter"
import ActionButtonsBar from "./ActionButtonsBar"
import ActionButtons from "./ActionButtons"
import EquipmentTable from "./EquipmentTable"
import EquipmentTableWithActions from "./EquipmentTableWithActions"
import ErrorDisplay from "./ErrorDisplay"
import EquipmentUpdateModal from "./EquipmentUpdateModal"
import EquipmentDetailsModal from "./EquipmentDetailsModal"
import EquipmentSignOutModal from "./EquipmentSignOutModal"
import EquipmentAddModal from "./EquipmentAddModal"
import EquipmentCheckOutModal from "./EquipmentCheckOutModal"
import EquipmentCheckInModal from "./EquipmentCheckInModal"
import EquipmentEditModal from "./EquipmentEditModal"
import useEquipmentData from "./useEquipmentData"
import useReportGeneration from "./useReportGeneration"
import useSignalR from "./useSignalR"
import useLowStockCount from "./useLowStockCount"
import useEquipmentFilter from "./useEquipmentFilter"

const API_BASE_URL = "http://localhost:5097" // Change the API_Base_URL to your hosts IP.
// IE: from localhost to 192.168.X.X or the like
const HUB_URL = `${API_BASE_URL}/qliHub`
const TABLE_CONTROLLERS = {
  Equipment: "Equipment",
  Admins: "Admins",
  Auditlog: "Auditlog",
  Transactionlog: "Transactionlog",
}

/**
 * InventoryApp (Main Component)
 * Manages state, data fetching, and SignalR connection.
 */
const InventoryApp = () => {
  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [currentUser, setCurrentUser] = useState("Admin User")

  // State for which table is currently selected
  const [selectedTable, setSelectedTable] = useState("Equipment")
  const API_URL = `${API_BASE_URL}/api/${selectedTable}`
  const REPORT_API_URL = `${API_BASE_URL}/api/report/send`

  // Modal states
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [signOutModalOpen, setSignOutModalOpen] = useState(false)
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false)
  const [checkInModalOpen, setCheckInModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState(null)

  // Custom hooks
  const { equipment, loading, error, fetchEquipment } = useEquipmentData(API_URL)
  const { reportStatus, handleGenerateReport } = useReportGeneration(REPORT_API_URL)
  const lowStockCount = useLowStockCount(equipment)
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterLocation,
    setFilterLocation,
    filteredEquipment
  } = useEquipmentFilter(equipment)

  // Fetch equipment when component mounts or API_URL changes
  useEffect(() => {
    fetchEquipment()
  }, [fetchEquipment])

  // SignalR real-time updates
  useSignalR(HUB_URL, fetchEquipment)

  // Handle table row click
  const handleRowClick = (item) => {
    if (selectedTable === 'Equipment') {
      setSelectedEquipment(item)
      setDetailsModalOpen(true)
    }
  }

  // Handle check out button click
  const handleCheckOut = () => {
    setSignOutModalOpen(true)
  }

  // Handle table selection change
  const handleTableChange = (table) => {
    setSelectedTable(table)
  }

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false)
    // Add logout logic here (clear tokens, redirect, etc.)
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

  // Handle export report
  const handleExportReport = () => {
    // TODO: Implement export logic
    console.log("Exporting report...")
    alert("Export functionality coming soon!")
  }

  // Handle checkout from table
  const handleCheckOutFromTable = (item) => {
    setSelectedEquipment(item)
    setCheckOutModalOpen(true)
  }

  // Handle checkout submission
  const handleCheckOutSubmit = (quantity) => {
    // TODO: Implement checkout logic
    console.log(`Checking out ${quantity} of ${selectedEquipment?.Name}`)
    setCheckOutModalOpen(false)
    setSelectedEquipment(null)
    // fetchEquipment() // Refresh after checkout
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
    setSelectedEquipment(item)
    setEditModalOpen(true)
  }

  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete "${item.Name}"?`)) {
      // TODO: Implement delete API call
      console.log("Deleting item:", item.Equipment_Id)
      // After successful delete:
      // fetchEquipment()
    }
  }

  // Handle check-in submission
  const handleCheckInSubmit = (quantity) => {
    if (!selectedEquipment) return
    
    // Update local state (no API call yet)
    const updatedEquipment = equipment.map(item => 
      item.Equipment_Id === selectedEquipment.Equipment_Id
        ? { ...item, In_Stock: item.In_Stock + quantity }
        : item
    )
    
    console.log(`Checked in ${quantity} of ${selectedEquipment.Name}`)
    setCheckInModalOpen(false)
    setSelectedEquipment(null)
    // fetchEquipment() // Uncomment when API is ready
  }

  // Handle edit submission
  const handleEditSubmit = (formData) => {
    if (!selectedEquipment) return
    
    // Update local state (no API call yet)
    const updatedEquipment = equipment.map(item =>
      item.Equipment_Id === selectedEquipment.Equipment_Id
        ? { ...item, ...formData }
        : item
    )
    
    console.log("Updated equipment:", { ...selectedEquipment, ...formData })
    setEditModalOpen(false)
    setSelectedEquipment(null)
    // fetchEquipment() // Uncomment when API is ready
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* App Header with Logo and User Info */}
        <AppHeader 
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Table Selection and Report Header */}
        <Header
          selectedTable={selectedTable}
          onTableChange={handleTableChange}
          onGenerateReport={handleGenerateReport}
          reportStatus={reportStatus}
          tableControllers={TABLE_CONTROLLERS}
        />

        {/* Dashboard Stats - Only show for Equipment table */}
        {selectedTable === 'Equipment' && (
          <DashboardStats
            equipment={equipment}
            lowStockCount={lowStockCount}
            onViewLowStock={handleViewLowStock}
          />
        )}

        {/* Action Buttons Bar - Only show for Equipment table */}
        {selectedTable === 'Equipment' && (
          <ActionButtonsBar
            onAddEquipment={handleAddEquipment}
            onExportReport={handleExportReport}
            onGenerateHistoryReport={handleGenerateReport}
            isGeneratingReport={reportStatus.includes("Generating")}
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
            onCheckout={handleCheckout}
            onCheckin={handleCheckin}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Action Buttons - Left Column */}
            <ActionButtons
              onCheckOut={handleCheckOut}
              EquipmentUpdateModal={EquipmentUpdateModal}
              equipment={equipment}
              fetchEquipment={fetchEquipment}
              apiUrl={API_URL}
            />

            {/* Data Table - Right Column */}
            <EquipmentTable
              selectedTable={selectedTable}
              equipment={equipment}
              loading={loading}
              onRowClick={handleRowClick}
            />
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
        
        <EquipmentSignOutModal 
          equipment={equipment}
          isOpen={signOutModalOpen}
          onClose={() => setSignOutModalOpen(false)}
          onSignOut={fetchEquipment}
          API_URL={API_URL}
        />

        <EquipmentAddModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onAdd={fetchEquipment}
          API_URL={API_URL}
        />

        <EquipmentCheckOutModal
          isOpen={checkOutModalOpen}
          onClose={() => {
            setCheckOutModalOpen(false)
            setSelectedEquipment(null)
          }}
          equipment={selectedEquipment}
          onCheckOut={handleCheckOutSubmit}
          API_URL={API_URL}
        />

        <EquipmentCheckInModal
          isOpen={checkInModalOpen}
          onClose={() => {
            setCheckInModalOpen(false)
            setSelectedEquipment(null)
          }}
          equipment={selectedEquipment}
          onCheckIn={handleCheckInSubmit}
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
      </div>
    </div>
  )
}

export default InventoryApp
