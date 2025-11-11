import React from "react"

const AppHeader = ({ currentUser, onLogout }) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <img 
          src="/logo-qli.png" 
          alt="QLI Logo" 
          className="h-10 w-auto" 
          style={{ maxWidth: '120px' }}
        />
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">OT Closet Inventory</h1>
          <p className="text-sm text-gray-600">Occupational Therapy Equipment Management System</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          Logged in as <span className="font-semibold text-gray-900">{currentUser}</span>
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
        >
          <svg 
            className="h-4 w-4" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  )
}

export default AppHeader
