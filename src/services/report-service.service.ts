import axiosInstance from "@/security/api-secured";

const REPORTS_BASE = "/api/v1/admin/reports";

async function getMessageFromBlob(blob: Blob): Promise<string> {
  try {
    const text = await blob.text();
    const json = JSON.parse(text);
    return json?.message ?? "Download failed.";
  } catch {
    return "Download failed.";
  }
}

/**
 * Download overview report for the given date range and format.
 * Expects backend: GET /api/v1/admin/reports/overview?fromDate=YYYY-MM-DD&toDate=YYYY-MM-DD&format=pdf|csv
 * with response: file stream (Content-Disposition: attachment) or 404/error.
 */
export async function downloadOverviewReport(
  fromDate: string,
  toDate: string,
  format: "pdf" | "csv"
): Promise<void> {
  const params = new URLSearchParams({
    fromDate,
    toDate,
    format,
  });
  try {
    const response = await axiosInstance.get(
      `${REPORTS_BASE}/overview?${params.toString()}`,
      { responseType: "blob" }
    );

    const blob = response.data as Blob;
    const contentType = response.headers["content-type"] || "";

    if (contentType.includes("application/json")) {
      const message = await getMessageFromBlob(blob);
      throw new Error(message);
    }

    const ext = format === "pdf" ? "pdf" : "csv";
    const suggestedName = `overview-report-${fromDate}-to-${toDate}.${ext}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = suggestedName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err: unknown) {
    if (err && typeof err === "object" && "response" in err) {
      const ax = err as { response?: { data?: Blob; status?: number } };
      if (ax.response?.data instanceof Blob) {
        const message = await getMessageFromBlob(ax.response.data);
        throw new Error(message);
      }
      if (ax.response?.status === 404) {
        throw new Error("Report endpoint is not available yet.");
      }
    }
    throw err;
  }
}
