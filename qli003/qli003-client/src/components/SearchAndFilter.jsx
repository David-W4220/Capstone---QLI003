import React, { useMemo } from "react"

const SearchAndFilter = ({ 
  searchTerm, 
  onSearchChange, 
  filterStatus, 
  onFilterStatusChange, 
  filterLocation, 
  onFilterLocationChange,
  equipment 
}) => {
  // Get unique locations from equipment data
  const uniqueLocations = useMemo(() => {
    const locations = equipment
      .map(item => item.Alpha_Loc)
      .filter(loc => loc && loc.trim() !== '')
    return [...new Set(locations)].sort()
  }, [equipment])

  const hasActiveFilters = filterStatus !== "all" || filterLocation !== "all"

  const handleClearFilters = () => {
    onFilterStatusChange("all")
    onFilterLocationChange("all")
  }

  return (
    <div className="mb-6 space-y-4">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search equipment by name, description, or location..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        data-testid="search-input"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {/* Filters */}
      <div className="flex gap-4 items-center flex-wrap">
        {/* Filter Label */}
        <div className="flex items-center gap-2">
          <svg 
            className="h-4 w-4 text-gray-600" 
            fill="none" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => onFilterStatusChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Items</option>
          <option value="available">Available</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
        </select>

        {/* Location Filter */}
        <select
          value={filterLocation}
          onChange={(e) => onFilterLocationChange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results Info */}
      {(searchTerm || hasActiveFilters) && (
        <div className="text-sm text-gray-600">
          {searchTerm && (
            <span>Searching for "{searchTerm}"</span>
          )}
          {searchTerm && hasActiveFilters && <span> • </span>}
          {hasActiveFilters && (
            <span>
              Filters active: 
              {filterStatus !== "all" && ` Status: ${filterStatus}`}
              {filterStatus !== "all" && filterLocation !== "all" && ", "}
              {filterLocation !== "all" && ` Location: ${filterLocation}`}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchAndFilter
