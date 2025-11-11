import { useEffect, useCallback } from "react"

/**
 * Custom hook for SignalR connection management
 * @param {string} hubUrl - The SignalR hub URL
 * @param {function} onRefresh - Callback function when refresh signal is received
 */
const useSignalR = (hubUrl, onRefresh) => {
  const startSignalRConnection = useCallback(async () => {
    const signalR = window.signalR

    if (!signalR || !signalR.HubConnectionBuilder) {
      console.warn("SignalR library not found globally (window.signalR is undefined). Real-time updates disabled.")
      return null
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .build()

    connection.on("RefreshData", () => {
      console.log("Refresh signal received. Re-fetching data...")
      onRefresh()
    })

    try {
      await connection.start()
      console.log("SignalR Connected successfully.")
      return connection
    } catch (err) {
      console.error("SignalR Connection Start Error:", err)
      return null
    }
  }, [hubUrl, onRefresh])

  useEffect(() => {
    let connection = null

    const init = async () => {
      connection = await startSignalRConnection()
    }

    init()

    return () => {
      if (connection) {
        connection.stop()
        console.log("SignalR Connection stopped.")
      }
    }
  }, [startSignalRConnection])
}

export default useSignalR
