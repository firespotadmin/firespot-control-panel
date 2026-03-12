import DOMPurify from "dompurify";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  ArrowLeft2,
  ArrowRight2,
  MessageText1,
  SmsEdit,
  Refresh2,
} from "iconsax-reactjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { topHeaderActionButtonClassName } from "@/components/common/dashboard/top-header-action-button";
import FilterPillSelect from "@/components/common/filters/filter-pill-select";
import FilterSearchInput from "@/components/common/filters/filter-search-input";
import {
  closeTicket,
  replyToTicket,
  sendEmail,
  syncTickets,
  useSupportTickets,
  useSupportUnreadCount,
  useTicketDetail,
} from "@/hooks/support-hook.hook";
import type { TicketStatus } from "@/types/support";
import type { TicketSummary } from "@/types/support";

const PAGE_SIZE = 20;

/** Renders message body safely: HTML is sanitized and previewed; plain text keeps newlines. */
function MessageBody({ content }: { content: string }) {
  const hasHtml = /<[a-z][\s\S]*>/i.test(content);
  const sanitized = hasHtml
    ? DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          "p", "br", "div", "span", "strong", "b", "em", "i", "u", "a", "ul", "ol", "li",
          "h1", "h2", "h3", "h4", "pre", "code", "blockquote", "hr", "table", "thead", "tbody", "tr", "th", "td",
        ],
        ALLOWED_ATTR: ["href", "target", "rel", "class"],
      })
    : null;

  if (sanitized) {
    return (
      <div
        className="support-message-body text-[13px] text-[#111827] break-words [&_a]:text-[#2563EB] [&_a]:underline [&_pre]:bg-[#F3F4F6] [&_pre]:p-2 [&_pre]:rounded [&_pre]:text-[12px] [&_pre]:overflow-x-auto [&_code]:bg-[#F3F4F6] [&_code]:px-1 [&_code]:rounded [&_code]:text-[12px] [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-4 [&_ol]:pl-4 [&_li]:my-0.5 [&_p]:my-1 [&_p]:first:mt-0 [&_p]:last:mb-0"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }
  return (
    <p className="text-[13px] text-[#111827] mt-1 whitespace-pre-wrap break-words">
      {content}
    </p>
  );
}

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: "All", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "Replied", value: "REPLIED" },
  { label: "Closed", value: "CLOSED" },
];

const STATUS_BADGES: Record<TicketStatus, string> = {
  OPEN: "bg-[#FEF3C7] text-[#92400E]",
  REPLIED: "bg-[#DBEAFE] text-[#1E40AF]",
  CLOSED: "bg-[#F3F4F6] text-[#374151]",
};

function formatDate(value: string | undefined) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatStatusLabel(status: TicketStatus) {
  return status.replace(/_/g, " ");
}

const SupportSection = () => {
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [detailTicketId, setDetailTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isSendEmailOpen, setIsSendEmailOpen] = useState(false);
  const [sendEmailTo, setSendEmailTo] = useState("");
  const [sendEmailSubject, setSendEmailSubject] = useState("");
  const [sendEmailMessage, setSendEmailMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const { data, isLoading, error, refetch } = useSupportTickets({
    page,
    size: PAGE_SIZE,
    status: statusFilter || undefined,
    search: search || undefined,
  });

  const { refetch: refetchUnread } = useSupportUnreadCount();
  const { detail, isLoading: detailLoading, refetch: refetchDetail } = useTicketDetail(detailTicketId);

  // When detail loads, backend has marked ticket as read – refresh unread count
  useEffect(() => {
    if (detail && detailTicketId) refetchUnread();
  }, [detail, detailTicketId, refetchUnread]);

  const tickets = data?.tickets ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleSearch = useCallback(() => {
    setPage(0);
    setSearch(searchInput.trim());
  }, [searchInput]);

  const handleSync = useCallback(async () => {
    try {
      setIsSyncing(true);
      const result = await syncTickets();
      toast.success(
        result?.message ?? `Synced. ${result?.ticketsCreated ?? 0} new ticket(s) created.`
      );
      refetch();
      refetchUnread();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setIsSyncing(false);
    }
  }, [refetch, refetchUnread]);

  const openDetail = useCallback((ticket: TicketSummary) => {
    setDetailTicketId(ticket.id);
    setReplyText("");
  }, []);

  const closeDetail = useCallback(() => {
    setDetailTicketId(null);
    setReplyText("");
    refetchUnread();
  }, [refetchUnread]);

  const handleReply = useCallback(async () => {
    if (!detailTicketId || !replyText.trim()) {
      toast.error("Enter a reply message");
      return;
    }
    try {
      setIsSubmittingReply(true);
      await replyToTicket(detailTicketId, { message: replyText.trim() });
      toast.success("Reply sent successfully");
      setReplyText("");
      refetchDetail();
      refetch();
      refetchUnread();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send reply");
    } finally {
      setIsSubmittingReply(false);
    }
  }, [detailTicketId, replyText, refetchDetail, refetch, refetchUnread]);

  const handleCloseTicket = useCallback(async () => {
    if (!detailTicketId) return;
    try {
      setIsClosing(true);
      await closeTicket(detailTicketId);
      toast.success("Ticket closed successfully");
      closeDetail();
      refetch();
      refetchUnread();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to close ticket");
    } finally {
      setIsClosing(false);
    }
  }, [detailTicketId, closeDetail, refetch, refetchUnread]);

  const handleSendEmail = useCallback(async () => {
    const to = sendEmailTo.trim();
    const subject = sendEmailSubject.trim();
    const message = sendEmailMessage.trim();
    if (!to || !subject || !message) {
      toast.error("Fill in To, Subject, and Message");
      return;
    }
    try {
      setIsSendingEmail(true);
      await sendEmail({ to, subject, message });
      toast.success("Email sent successfully");
      setIsSendEmailOpen(false);
      setSendEmailTo("");
      setSendEmailSubject("");
      setSendEmailMessage("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send email");
    } finally {
      setIsSendingEmail(false);
    }
  }, [sendEmailTo, sendEmailSubject, sendEmailMessage]);

  const pageItems = useMemo(() => {
    const total = Math.max(totalPages, 1);
    const current = page + 1;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, "...", total - 2, total - 1, total];
    if (current >= total - 3) return [1, 2, "...", total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  }, [page, totalPages]);

  return (
    <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
      <p className="text-[16px] font-[600] text-[#111827]">Tickets</p>
      <p className="text-[13px] text-[#6B7280] mt-1">Sync inbox, search, filter, and manage support tickets.</p>
      <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <FilterPillSelect
            value={statusFilter}
            onChange={(value) => {
              setPage(0);
              setStatusFilter(value);
            }}
            options={STATUS_OPTIONS.map((opt) => ({
              value: opt.value === "ALL" ? "" : opt.value,
              label: opt.label,
            }))}
            className="min-w-[160px]"
          />
          <FilterSearchInput
            value={searchInput}
            onChange={setSearchInput}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by sender email or subject"
            className="w-full lg:w-[340px]"
          />
          <Button
            variant="outline"
            className={`${topHeaderActionButtonClassName} border-0 text-[11px] font-[700] uppercase tracking-[0.08em]`}
            onClick={() => {
              setPage(0);
              setStatusFilter("");
              setSearch("");
              setSearchInput("");
            }}
          >
            Clear
          </Button>
          <Button
            className={`${topHeaderActionButtonClassName} text-[11px] font-[700] uppercase tracking-[0.08em]`}
            onClick={handleSearch}
          >
            Apply
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="h-[44px] rounded-[10px] border-[#E5E7EB]"
            onClick={handleSync}
            disabled={isSyncing}
          >
            <Refresh2 size={18} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing..." : "Sync inbox"}
          </Button>
          <Button
            variant="outline"
            className="h-[44px] rounded-[10px] border-[#E5E7EB]"
            onClick={() => setIsSendEmailOpen(true)}
          >
            <SmsEdit size={18} />
            Send email
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-[10px] border border-[#ECEEF1] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#E5E7EB] hover:bg-transparent">
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5">
                Ticket ID
              </TableHead>
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5">
                Sender
              </TableHead>
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5">
                Subject
              </TableHead>
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5">
                Status
              </TableHead>
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5">
                Date
              </TableHead>
              <TableHead className="text-[#374151] font-[500] text-[12px] py-4 px-5 text-right">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-[#6B7280]">
                  Loading tickets...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-red-600">
                  {error}
                </TableCell>
              </TableRow>
            ) : tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-[#6B7280]">
                  No tickets found.
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className={`border-b border-[#F3F4F6] last:border-0 hover:bg-transparent ${ticket.unread ? "bg-[#F0F9FF]/50" : ""}`}
                >
                  <TableCell className="py-4 px-5 align-top text-[13px] font-[600] text-[#111827]">
                    {ticket.ticketNumber}
                  </TableCell>
                  <TableCell className="py-4 px-5 align-top text-[13px] text-[#374151]">
                    {ticket.senderEmail}
                  </TableCell>
                  <TableCell className="py-4 px-5 align-top">
                    <p className="text-[13px] text-[#111827] line-clamp-2">
                      {ticket.subject || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="py-4 px-5 align-top">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-[600] ${STATUS_BADGES[ticket.status]}`}
                    >
                      {formatStatusLabel(ticket.status)}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-5 align-top text-[13px] text-[#374151]">
                    {formatDate(ticket.createdAt)}
                  </TableCell>
                  <TableCell className="py-4 px-5 align-top text-right">
                    <Button
                      variant="outline"
                      className="h-[34px] rounded-full border-[#E5E7EB]"
                      onClick={() => openDetail(ticket)}
                    >
                      <MessageText1 size={16} color="#111827" />
                      View
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
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className="h-[34px] w-[34px] rounded-full border border-[#E5E7EB] disabled:opacity-50 flex items-center justify-center"
        >
          <ArrowLeft2 size={16} color="#111827" />
        </button>
        {pageItems.map((item, idx) =>
          item === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-[#9CA3AF] text-[13px]">
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => setPage((item as number) - 1)}
              className={`h-[34px] min-w-[34px] px-2 rounded-full text-[12px] font-[600] border ${
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
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page >= totalPages - 1}
          className="h-[34px] w-[34px] rounded-full border border-[#E5E7EB] disabled:opacity-50 flex items-center justify-center"
        >
          <ArrowRight2 size={16} color="#111827" />
        </button>
      </div>

      {/* Ticket detail modal */}
      <Dialog open={!!detailTicketId} onOpenChange={(open) => !open && closeDetail()}>
        <DialogContent className="max-w-[620px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-[700] text-[#111827]">
              Ticket {detail?.ticketNumber ?? detailTicketId}
            </DialogTitle>
            <DialogDescription>
              {detail?.subject ?? "Loading..."} · {detail?.senderEmail ?? ""}
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <p className="text-[#6B7280] py-4">Loading conversation...</p>
          ) : detail ? (
            <>
              <div className="space-y-3 rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] p-3 max-h-[280px] overflow-y-auto">
                {detail.messages?.length ? (
                  detail.messages.map((msg, i) => (
                    <div key={i} className="border-b border-[#E5E7EB] pb-2 last:border-0 last:pb-0">
                      <p className="text-[11px] text-[#6B7280] font-medium">{msg.from}</p>
                      <p className="text-[12px] text-[#6B7280]">{formatDate(msg.date)}</p>
                      <div className="mt-1">
                        <MessageBody content={msg.message} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-[13px] text-[#6B7280]">No messages yet.</p>
                )}
              </div>

              {detail.status !== "CLOSED" && (
                <div className="space-y-2">
                  <p className="text-[13px] text-[#374151]">Reply</p>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write your reply..."
                    rows={4}
                    className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] outline-none focus:ring-2 focus:ring-[#1118271A]"
                  />
                </div>
              )}

              <DialogFooter>
                {detail.status !== "CLOSED" && (
                  <Button
                    className="rounded-full bg-[#111827] hover:bg-[#1F2937] text-white"
                    onClick={handleReply}
                    disabled={isSubmittingReply || !replyText.trim()}
                  >
                    {isSubmittingReply ? "Sending..." : "Send reply"}
                  </Button>
                )}
                {detail.status !== "CLOSED" && (
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={handleCloseTicket}
                    disabled={isClosing}
                  >
                    {isClosing ? "Closing..." : "Close ticket"}
                  </Button>
                )}
                <Button variant="outline" className="rounded-full" onClick={closeDetail}>
                  Cancel
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Send email modal */}
      <Dialog open={isSendEmailOpen} onOpenChange={setIsSendEmailOpen}>
        <DialogContent className="max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-[18px] font-[700] text-[#111827]">
              Send new email
            </DialogTitle>
            <DialogDescription>
              Send an email that is not tied to a ticket.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-[13px] text-[#374151] mb-1 block">To</label>
              <Input
                value={sendEmailTo}
                onChange={(e) => setSendEmailTo(e.target.value)}
                placeholder="recipient@email.com"
                className="rounded-[10px] border-[#E5E7EB]"
              />
            </div>
            <div>
              <label className="text-[13px] text-[#374151] mb-1 block">Subject</label>
              <Input
                value={sendEmailSubject}
                onChange={(e) => setSendEmailSubject(e.target.value)}
                placeholder="Subject"
                className="rounded-[10px] border-[#E5E7EB]"
              />
            </div>
            <div>
              <label className="text-[13px] text-[#374151] mb-1 block">Message</label>
              <textarea
                value={sendEmailMessage}
                onChange={(e) => setSendEmailMessage(e.target.value)}
                placeholder="Message body..."
                rows={5}
                className="w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 py-2 text-[13px] text-[#111827] outline-none focus:ring-2 focus:ring-[#1118271A]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-full" onClick={() => setIsSendEmailOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-full bg-[#111827] hover:bg-[#1F2937] text-white"
              onClick={handleSendEmail}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? "Sending..." : "Send email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportSection;
