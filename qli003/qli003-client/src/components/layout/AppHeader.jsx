import React from "react"

// Component now accepts isLoggedIn and onLoginClick props
const AppHeader = ({ currentUser, isLoggedIn, onLogout, onLoginClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Branding Area (Left) */}
          <div className="flex items-center gap-4">
            {/* QLI Logo */}
            <img 
              src="/logo-qli.png" 
              alt="QLI Logo" 
              className="h-12 w-auto" 
            />
            
            {/* Vertical Divider & Titles */}
            <div className="border-l border-gray-300 pl-4 h-10 flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">OT Closet Inventory</h1>
              <p className="text-xs text-gray-500">Equipment Management System</p>
            </div>
          </div>
          
          {/* User Area (Right) - UPDATED FOR LOGIN/LOGOUT */}
          <div className="flex items-center gap-6">
            
            {isLoggedIn ? (
              // --- STATE: LOGGED IN (ADMIN) ---
              <>
                <div className="text-sm font-medium text-gray-900">
                  Logged in as: <strong>{currentUser}</strong>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-red-300 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
              </>
            ) : (
              // --- STATE: LOGGED OUT (PUBLIC) ---
              <>
                <button
                  onClick={onLoginClick} // Calls the function to open the Login Modal
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-transparent bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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
                    <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3v-4a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Admin Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader