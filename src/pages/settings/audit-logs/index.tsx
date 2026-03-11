import Header from "@/layouts/dashboard/header";
import SideBar from "@/layouts/dashboard/sideBar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FilterPillDate from "@/components/common/filters/filter-pill-date";
import FilterPillInput from "@/components/common/filters/filter-pill-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { getStoredAuthUser } from "@/lib/auth-storage";
import { isAuditLogsVerified, setAuditLogsVerified } from "@/lib/audit-access";
import { sendAdminOtp, validateAdminOtp } from "@/services/admin-otp.service";
import { getAuditLogs } from "@/services/audit-service.service";
import type { AuditLogFilters, RequestAuditLog } from "@/types/audit";
import { ArrowLeft, ArrowRight, Loader, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
const OTP_LENGTH = 4;

function formatDate(value: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function truncate(s: string | null | undefined, max = 40) {
  if (s == null || s === "") return "—";
  return s.length <= max ? s : s.slice(0, max) + "…";
}

export default function AuditLogsPage() {
  const navigate = useNavigate();
  const user = getStoredAuthUser();
  const email = user?.emailAddress ?? "";

  const [step, setStep] = useState<"request" | "verify" | "view">("request");
  const [verified, setVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [otp, setOtp] = useState("");

  const [logs, setLogs] = useState<RequestAuditLog[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [userEmailFilter, setUserEmailFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");

  const checkVerified = useCallback(() => {
    if (isAuditLogsVerified()) {
      setVerified(true);
      setStep("view");
    }
  }, []);

  useEffect(() => {
    checkVerified();
  }, [checkVerified]);

  const requestOtp = useCallback(async () => {
    if (!email) {
      toast.error("No email found. Please log in again.");
      return;
    }
    setSendingOtp(true);
    try {
      await sendAdminOtp();
      toast.success("OTP sent to your email.");
      setStep("verify");
      setOtp("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  }, [email]);

  const verifyOtp = useCallback(async () => {
    if (otp.length < OTP_LENGTH) {
      toast.error("Please enter the full OTP.");
      return;
    }
    setVerifying(true);
    try {
      await validateAdminOtp(otp);
      setAuditLogsVerified();
      setVerified(true);
      setStep("view");
      toast.success("Verified. You can view audit logs.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  }, [otp]);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: AuditLogFilters = {
        page,
        size,
        from: from || undefined,
        to: to || undefined,
        userEmail: userEmailFilter || undefined,
        userId: userIdFilter || undefined,
      };
      const data = await getAuditLogs(params);
      setLogs(data.content);
      setTotalElements(data.totalElements);
      setTotalPages(data.totalPages);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load audit logs");
      setLogs([]);
      setTotalElements(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [page, size, from, to, userEmailFilter, userIdFilter]);

  useEffect(() => {
    if (step === "view" && verified) fetchLogs();
  }, [step, verified, fetchLogs]);

  const pageItems = useMemo(() => {
    const totalP = Math.max(totalPages, 1);
    const current = page + 1;
    if (totalP <= 7) return Array.from({ length: totalP }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, "...", totalP - 2, totalP - 1, totalP];
    if (current >= totalP - 3) return [1, 2, "...", totalP - 2, totalP - 1, totalP];
    return [1, "...", current - 1, current, current + 1, "...", totalP];
  }, [page, totalPages]);

  const clearFilters = () => {
    setFrom("");
    setTo("");
    setUserEmailFilter("");
    setUserIdFilter("");
    setPage(0);
  };

  if (!email) {
    return (
      <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <SideBar />
          <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8] flex items-center justify-center">
            <p className="text-[#6B7280]">Session expired. Please log in again.</p>
            <Button asChild className="ml-3">
              <Link to="/">Log in</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
      <Toaster position="top-center" />
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <SideBar />
        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8] space-y-5">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/settings")}
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-[28px] leading-[1.1] font-[700] text-[#0F172A]">
              Audit logs
            </h1>
          </div>

          {step !== "view" && (
            <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-8 max-w-[480px]">
              <div className="flex items-center gap-2 text-[#111827] font-[600] text-[16px]">
                <ShieldCheck size={20} />
                Verify your identity
              </div>
              <p className="text-[13px] text-[#6B7280] mt-2">
                We'll send a one-time code to <strong>{email}</strong>. Enter it below to view audit logs.
              </p>

              {step === "request" && (
                <Button
                  className="mt-6 rounded-full bg-[#111827] hover:bg-[#1F2937]"
                  onClick={requestOtp}
                  disabled={sendingOtp}
                >
                  {sendingOtp ? (
                    <Loader className="animate-spin size-4" />
                  ) : (
                    "Send OTP to my email"
                  )}
                </Button>
              )}

              {step === "verify" && (
                <div className="mt-6 space-y-4">
                  <p className="text-[13px] text-[#6B7280]">Enter the 4-digit code</p>
                  <InputOTP
                    maxLength={OTP_LENGTH}
                    value={otp}
                    onChange={setOtp}
                  >
                    <InputOTPGroup className="gap-1">
                      {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                        <InputOTPSlot key={i} index={i} className="rounded-md" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="rounded-full"
                      onClick={() => setStep("request")}
                      disabled={verifying}
                    >
                      Back
                    </Button>
                    <Button
                      className="rounded-full bg-[#111827] hover:bg-[#1F2937]"
                      onClick={verifyOtp}
                      disabled={otp.length < OTP_LENGTH || verifying}
                    >
                      {verifying ? (
                        <Loader className="animate-spin size-4" />
                      ) : (
                        "Verify & view logs"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === "view" && (
          <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
            <p className="text-[16px] font-[600] text-[#111827]">Request audit log</p>
            <p className="text-[13px] text-[#6B7280] mt-1">
              Filter by date range (ISO yyyy-MM-dd), user ID, or user email.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <FilterPillDate
                value={from}
                onChange={(value) => {
                  setFrom(value);
                  setPage(0);
                }}
                placeholder="From date"
              />
              <FilterPillDate
                value={to}
                onChange={(value) => {
                  setTo(value);
                  setPage(0);
                }}
                placeholder="To date"
              />
              <FilterPillInput
                value={userIdFilter}
                onChange={(value) => {
                  setUserIdFilter(value);
                  setPage(0);
                }}
                placeholder="User ID"
              />
              <FilterPillInput
                value={userEmailFilter}
                onChange={(value) => {
                  setUserEmailFilter(value);
                  setPage(0);
                }}
                placeholder="User email"
                className="min-w-[220px]"
              />
              <Button
                variant="outline"
                className="h-9 rounded-full border-[#E5E7EB]"
                onClick={clearFilters}
              >
                Clear
              </Button>
              <Button
                className="h-9 rounded-full bg-[#111827] hover:bg-[#1F2937]"
                onClick={fetchLogs}
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin size-4" /> : "Apply"}
              </Button>
            </div>

            <div className="mt-4 rounded-[10px] border border-[#ECEEF1] overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E5E7EB] hover:bg-transparent">
                    <TableHead className="text-[12px] font-[500] text-[#374151]">Time</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151]">Method</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151]">Path</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151]">User</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151]">User type</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151]">Status</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151]">Duration</TableHead>
                    <TableHead className="text-[12px] font-[500] text-[#374151]">IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center text-[#6B7280]">
                        Loading...
                      </TableCell>
                    </TableRow>
                  ) : logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center text-[#6B7280]">
                        No audit logs found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => (
                      <TableRow
                        key={log.id}
                        className="border-[#F3F4F6] last:border-0"
                      >
                        <TableCell className="text-[13px] text-[#374151] py-3 whitespace-nowrap">
                          {formatDate(log.timestamp)}
                        </TableCell>
                        <TableCell className="text-[13px] font-[500] text-[#111827]">
                          {log.method}
                        </TableCell>
                        <TableCell className="text-[13px] text-[#374151] max-w-[200px] truncate" title={log.path}>
                          {log.path}
                        </TableCell>
                        <TableCell className="text-[13px] text-[#374151]">
                          {log.userEmail ?? log.userId ?? "—"}
                        </TableCell>
                        <TableCell className="text-[13px] text-[#6B7280]">
                          {log.userType}
                        </TableCell>
                        <TableCell className="text-[13px] text-[#374151]">
                          {log.responseStatus}
                        </TableCell>
                        <TableCell className="text-[13px] text-[#6B7280]">
                          {log.durationMs} ms
                        </TableCell>
                        <TableCell className="text-[13px] text-[#6B7280]">
                          {truncate(log.remoteAddr, 16)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <p className="text-[13px] text-[#6B7280]">
                  {totalElements === 0
                    ? "No results"
                    : `Showing ${page * size + 1}–${Math.min(page * size + logs.length, totalElements)} of ${totalElements}`}
                </p>
                <Select
                  value={String(size)}
                  onValueChange={(v) => {
                    setSize(Number(v));
                    setPage(0);
                  }}
                >
                  <SelectTrigger className="h-8 w-[100px] rounded-[8px] border-[#E5E7EB] text-[13px]">
                    <SelectValue placeholder="Per page" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_SIZE_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} per page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#6B7280] mr-1">
                  Page {page + 1} of {Math.max(totalPages, 1)}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="h-8 w-8 rounded-full border border-[#E5E7EB] disabled:opacity-50 flex items-center justify-center"
                >
                  <ArrowLeft size={14} />
                </button>
                {pageItems.map((item, idx) =>
                  item === "..." ? (
                    <span key={`e-${idx}`} className="px-2 text-[13px] text-[#9CA3AF]">...</span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage((item as number) - 1)}
                      className={`h-8 min-w-[32px] px-2 rounded-full text-[12px] font-[600] border ${
                        page + 1 === item
                          ? "bg-[#111827] text-white border-[#111827]"
                          : "bg-white text-[#374151] border-[#E5E7EB]"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className="h-8 w-8 rounded-full border border-[#E5E7EB] disabled:opacity-50 flex items-center justify-center"
                >
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
