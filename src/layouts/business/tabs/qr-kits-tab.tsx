import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetBusinessQrKits } from "@/hooks/stats-hook.hook";
import type { BusinessQrKitItem } from "@/types/qr-kit";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const QRKitsTab = ({ businessId }: { businessId?: string }) => {
  const [qrKits, setQrKits] = useState<BusinessQrKitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!businessId) {
      setQrKits([]);
      return;
    }

    const fetchQrKits = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await useGetBusinessQrKits({
          businessId,
          page: 0,
          size: 10,
        });

        const content =
          response?.data?.data?.content ||
          response?.data?.content ||
          response?.content ||
          [];

        setQrKits(Array.isArray(content) ? content : []);
      } catch (err: any) {
        setQrKits([]);
        setError(
          err?.response?.data?.message || err?.message || "Failed to load QR kits"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQrKits();
  }, [businessId]);

  const formatCurrency = (value: number | null | undefined) => {
    const amount = Number(value ?? 0);
    if (Number.isNaN(amount)) return "NGN 0.00";

    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (value: string | null | undefined) => {
    if (!value) return "N/A";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full py-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">QR Kits</h2>

        {loading ? (
          <div className="p-8 text-center">
            <div className="flex justify-center">
              <Loader className="animate-spin" />
            </div>
            <p className="mt-2 text-gray-600">Loading QR kits...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : qrKits.length === 0 ? (
          <p className="text-gray-600">No QR kits found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activated</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qrKits.map((item) => (
                <TableRow key={item.transactionId}>
                  <TableCell className="font-mono text-xs">
                    {item.transactionReference || item.transactionId}
                  </TableCell>
                  <TableCell>{formatCurrency(item.amount)}</TableCell>
                  <TableCell>{item.transactionStatus || "N/A"}</TableCell>
                  <TableCell>{item.activated ? "Yes" : "No"}</TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                  <TableCell>{formatDate(item.expiresAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default QRKitsTab;
