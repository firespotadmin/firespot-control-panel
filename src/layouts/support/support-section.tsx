import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ArrowLeft2, ArrowRight2, MessageText1, SearchNormal1 } from "iconsax-reactjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ColorBox from "@/components/common/dashboard/color-box";
import {
  useGetSupportTickets,
  useRespondToSupportTicket,
  useUpdateSupportTicketStatus,
} from "@/hooks/support-hook.hook";
import type { SupportTicket, SupportTicketStatus } from "@/types/support";

const PAGE_SIZE = 10;

const DEMO_SUPPORT_TICKET: SupportTicket = {
  id: "demo-support-ticket-001",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  email: "customer.demo@firespot.com",
  name: "Demo Customer",
  subject: "Unable to complete payment",
  message:
    "Hello support, my card gets debited but the order remains pending. Please help me confirm the transaction status.",
  status: "OPEN",
  response: null,
  respondedAt: null,
};

const STATUS_OPTIONS: Array<{ label: string; value: SupportTicketStatus | "ALL" }> = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

const STATUS_BADGES: Record<SupportTicketStatus, string> = {
  OPEN: "bg-[#FEF3C7] text-[#92400E]",
  IN_PROGRESS: "bg-[#DBEAFE] text-[#1E40AF]",
  RESOLVED: "bg-[#DCFCE7] text-[#166534]",
  CLOSED: "bg-[#F3F4F6] text-[#374151]",
};

const formatStatusLabel = (status: SupportTicketStatus) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (value: string | undefined) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const meridiem = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;

  return `${month}/${day}/${year} . ${hour12}:${minutes}${meridiem}`;
};

const SupportSection = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"ALL" | SupportTicketStatus>("ALL");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [responseText, setResponseText] = useState("");
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);

      const response = await useGetSupportTickets({
        page,
        size: PAGE_SIZE,
        search,
        status: statusFilter === "ALL" ? "" : statusFilter,
      });

      const payload = response?.data || response;
      const rows =
        payload?.data?.content ||
        payload?.content ||
        payload?.data?.data?.content ||
        [];

      const nextTickets = (Array.isArray(rows) ? rows : []) as SupportTicket[];
      setTickets(nextTickets.length > 0 ? nextTickets : [DEMO_SUPPORT_TICKET]);

      setTotalPages(
        payload?.data?.totalPages ||
          payload?.totalPages ||
          payload?.data?.data?.totalPages ||
          1
      );
    } catch {
      setTickets([]);
      setTotalPages(1);
      toast.error("Failed to load support requests");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, statusFilter, search]);

  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((ticket) => ticket.status === "OPEN").length;
    const inProgress = tickets.filter((ticket) => ticket.status === "IN_PROGRESS").length;
    const resolved = tickets.filter((ticket) => ticket.status === "RESOLVED").length;

    return { total, open, inProgress, resolved };
  }, [tickets]);

  const getPageItems = () => {
    const total = Math.max(totalPages, 1);
    const current = page + 1;

    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    if (current <= 4) {
      return [1, 2, 3, "...", total - 2, total - 1, total];
    }

    if (current >= total - 3) {
      return [1, 2, 3, "...", total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const pageItems = getPageItems();

  const handleStatusUpdate = async (ticket: SupportTicket, status: SupportTicketStatus) => {
    try {
      setUpdatingStatusId(ticket.id);
      const response = await useUpdateSupportTicketStatus({
        ticketId: ticket.id,
        payload: { status },
      });

      if (response?.success === false) {
        toast.error(response?.message || "Failed to update ticket status");
        return;
      }

      setTickets((prev) =>
        prev.map((item) => (item.id === ticket.id ? { ...item, status } : item))
      );
      toast.success("Ticket status updated");
    } catch {
      toast.error("Failed to update ticket status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const openResponseModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setResponseText(ticket.response || "");
    setIsResponseModalOpen(true);
  };

  const submitResponse = async () => {
    if (!selectedTicket || !responseText.trim()) {
      toast.error("Enter a response message");
      return;
    }

    try {
      setIsSubmittingResponse(true);
      const response = await useRespondToSupportTicket({
        ticketId: selectedTicket.id,
        payload: { response: responseText.trim() },
      });

      if (response?.success === false) {
        toast.error(response?.message || "Failed to send response");
        return;
      }

      setTickets((prev) =>
        prev.map((item) =>
          item.id === selectedTicket.id
            ? {
                ...item,
                response: responseText.trim(),
                status: item.status === "OPEN" ? "IN_PROGRESS" : item.status,
                respondedAt: new Date().toISOString(),
              }
            : item
        )
      );

      toast.success("Response sent successfully");
      setIsResponseModalOpen(false);
    } catch {
      toast.error("Failed to send response");
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  return (
    <div className="pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 pb-5 border-b border-[#E5E7EB]">
        <ColorBox color="#111827" count={String(stats.total)} label="Total Support Tickets" />
        <ColorBox color="#F59E0B" count={String(stats.open)} label="Open Tickets" />
        <ColorBox color="#2563EB" count={String(stats.inProgress)} label="In Progress Tickets" />
        <ColorBox color="#22C55E" count={String(stats.resolved)} label="Resolved Tickets" />
      </div>

      <div className="mt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative w-full lg:max-w-[340px]">
          <SearchNormal1
            size={18}
            color="#9CA3AF"
            className="absolute left-3 top-1/2 -translate-y-1/2"
          />
          <Input
            value={search}
            onChange={(event) => {
              setPage(0);
              setSearch(event.target.value);
            }}
            placeholder="Search by subject, email, name"
            className="pl-10 h-[44px] rounded-[10px] border-[#E5E7EB] bg-white"
          />
        </div>

        <div className="w-full lg:w-[220px]">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setPage(0);
              setStatusFilter(value as "ALL" | SupportTicketStatus);
            }}
          >
            <SelectTrigger className="w-full h-[44px] rounded-[10px] bg-white border-[#E5E7EB]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 rounded-[14px] bg-white border border-[#ECEEF1] p-2">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E5E7EB] hover:bg-transparent">
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5">Ticket</TableHead>
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5">Requester</TableHead>
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5">Created</TableHead>
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5">Status</TableHead>
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-[#6B7280]">
                  Loading support requests...
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-[#6B7280]">
                  No support requests found.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id} className="border-b border-[#F3F4F6] last:border-0 hover:bg-transparent">
                  <TableCell className="py-4 px-5 align-top">
                    <p className="text-[13px] font-[600] text-[#111827]">{ticket.subject || "Untitled request"}</p>
                    <p className="text-[12px] text-[#6B7280] mt-1 line-clamp-2">{ticket.message || "No message"}</p>
                  </TableCell>
                  <TableCell className="py-4 px-5 align-top">
                    <p className="text-[13px] text-[#111827]">{ticket.name || "N/A"}</p>
                    <p className="text-[12px] text-[#6B7280] mt-1">{ticket.email || "N/A"}</p>
                  </TableCell>
                  <TableCell className="py-4 px-5 align-top text-[13px] text-[#374151]">
                    {formatDate(ticket.createdAt)}
                  </TableCell>
                  <TableCell className="py-4 px-5 align-top">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-[600] ${STATUS_BADGES[ticket.status]}`}>
                        {formatStatusLabel(ticket.status)}
                      </span>
                      <Select
                        value={ticket.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(ticket, value as SupportTicketStatus)
                        }
                        disabled={updatingStatusId === ticket.id}
                      >
                        <SelectTrigger className="h-[34px] min-w-[140px] bg-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OPEN">Open</SelectItem>
                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                          <SelectItem value="CLOSED">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-5 align-top text-right">
                    <Button
                      variant="outline"
                      className="h-[34px] rounded-full border-[#E5E7EB]"
                      onClick={() => openResponseModal(ticket)}
                    >
                      <MessageText1 size={16} color="#111827" />
                      Respond
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
          disabled={page === 0}
          className="h-[34px] w-[34px] rounded-full border border-[#E5E7EB] disabled:opacity-50 flex items-center justify-center"
        >
          <ArrowLeft2 size={16} color="#111827" />
        </button>

        {pageItems.map((item, index) => {
          if (item === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 text-[#9CA3AF] text-[13px]">
                ...
              </span>
            );
          }

          const pageNumber = item as number;
          const isActive = pageNumber === page + 1;

          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber - 1)}
              className={`h-[34px] min-w-[34px] px-2 rounded-full text-[12px] font-[600] border ${
                isActive
                  ? "bg-[#111827] text-white border-[#111827]"
                  : "bg-white text-[#374151] border-[#E5E7EB]"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, Math.max(totalPages - 1, 0)))}
          disabled={page >= totalPages - 1}
          className="h-[34px] w-[34px] rounded-full border border-[#E5E7EB] disabled:opacity-50 flex items-center justify-center"
        >
          <ArrowRight2 size={16} color="#111827" />
        </button>
      </div>

      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="max-w-[620px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-[700] text-[#111827]">Respond to Support Request</DialogTitle>
            <DialogDescription>
              {selectedTicket?.subject || "Write and send your response to this ticket."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] p-3">
              <p className="text-[12px] text-[#6B7280]">Requester</p>
              <p className="text-[13px] font-[600] text-[#111827] mt-1">
                {selectedTicket?.name || "N/A"} • {selectedTicket?.email || "N/A"}
              </p>
              <p className="text-[12px] text-[#6B7280] mt-2">Request</p>
              <p className="text-[13px] text-[#111827] mt-1 whitespace-pre-wrap">
                {selectedTicket?.message || "No message"}
              </p>
            </div>

            <div>
              <p className="text-[13px] text-[#374151] mb-2">Response</p>
              <textarea
                value={responseText}
                onChange={(event) => setResponseText(event.target.value)}
                placeholder="Write your response to the customer..."
                rows={6}
                className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] outline-none focus:ring-2 focus:ring-[#1118271A]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => setIsResponseModalOpen(false)}
              disabled={isSubmittingResponse}
            >
              Cancel
            </Button>
            <Button
              className="rounded-full bg-[#111827] hover:bg-[#1F2937] text-white"
              onClick={submitResponse}
              disabled={isSubmittingResponse}
            >
              {isSubmittingResponse ? "Sending..." : "Send response"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportSection;
