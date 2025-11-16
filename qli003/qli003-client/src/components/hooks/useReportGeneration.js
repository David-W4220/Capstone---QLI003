import { useState } from "react"

/**
 * Custom hook for handling report generation
 * @param {string} reportApiUrl - The report API endpoint URL
 */
const useReportGeneration = (reportApiUrl) => {
  const [reportStatus, setReportStatus] = useState("")

  const handleGenerateReport = async () => {
    setReportStatus("Generating report and sending email...")

    try {
      const response = await fetch(reportApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()

      setReportStatus(data.message)
    } catch (err) {
      setReportStatus(`Something's wrong: ${err.message}`)
    }

    setTimeout(() => setReportStatus(""), 8000)
  }

  return { reportStatus, handleGenerateReport }
}

export default useReportGeneration
