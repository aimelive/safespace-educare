import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const format = request.nextUrl.searchParams.get("format") || "csv"

    let content = ""
    let filename = ""
    let contentType = ""

    if (format === "csv") {
      content = "Date,Sessions,Resources,Check-ins\n2025-11-20,5,12,20\n2025-11-21,6,15,22\n2025-11-22,7,18,25"
      filename = "safespace-educare-report.csv"
      contentType = "text/csv"
    } else if (format === "pdf") {
      content = "SafeSpace Educare Report\n\nWeekly Summary\nTotal Sessions: 156\nResources Accessed: 87"
      filename = "safespace-educare-report.pdf"
      contentType = "application/pdf"
    } else {
      content = JSON.stringify({ totalSessions: 156, resourcesAccessed: 87, checkinsCompleted: 156 })
      filename = "safespace-educare-report.json"
      contentType = "application/json"
    }

    return new NextResponse(content, {
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": contentType,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 })
  }
}
