import React from "react"

const ErrorDisplay = ({ error }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
        <p className="text-red-800 text-sm">Error fetching data: {error.message}</p>
      </div>
    </div>
  )
}

export default ErrorDisplay
