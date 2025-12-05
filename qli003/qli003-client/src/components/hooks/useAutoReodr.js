import { useState, useEffect } from "react"

//hook for backend automated mailing service. 
//Since AutoReodrLk.cs's a HostedService (singleton) thats NOT triggered by user, it does not need any endpoints
export default function useAutoReodr() {
  const [autoStatus, setAutoStatus] = useState(null)

  useEffect(() => {
    const handler = (e) => {
      setAutoStatus(e.detail)
    }

    window.addEventListener("auto-reorder-status", handler)
    return () => window.removeEventListener("auto-reorder-status", handler)
  }, [])
    
  
  // Auto-clear message
  useEffect(() => {
    if (!autoStatus) return

    const timer = setTimeout(() => {setAutoStatus(null)}, 5000) // <- adjust timer here(currently 5 sec)

    return () => clearTimeout(timer)}, [autoStatus])

  return { autoStatus }
}
