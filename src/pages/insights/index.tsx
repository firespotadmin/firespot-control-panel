import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useGetStats } from "@/hooks/stats-hook.hook";
import Header from "@/layouts/dashboard/header";
import SideBar from "@/layouts/dashboard/sideBar";
import type { RootState } from "@/stores/store/store";
import type { PlatformStats, StatsResponse } from "@/types/stats";

const Insights = () => {
  const [data, setData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const { fromDate, toDate } = useSelector((state: RootState) => state.dateRange);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = (await useGetStats({ fromDate, toDate })) as StatsResponse;
      if (response?.success) {
        setData(response);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fromDate, toDate]);

  const stats: PlatformStats | null = data?.data?.data ?? null;

  const transactionBars = useMemo(
    () => [
      { metric: "Total", value: stats?.transactions?.totalTransactions ?? 0, fill: "var(--color-chart-1)" },
      { metric: "Success", value: stats?.transactions?.successfulTransactions ?? 0, fill: "var(--color-chart-2)" },
      { metric: "Pending", value: stats?.transactions?.pendingTransactions ?? 0, fill: "var(--color-chart-4)" },
      { metric: "Failed", value: stats?.transactions?.failedTransactions ?? 0, fill: "var(--color-chart-5)" },
    ],
    [stats]
  );

  const businessBars = useMemo(
    () => [
      { metric: "Total", value: stats?.businesses?.totalBusinesses ?? 0, fill: "var(--color-chart-1)" },
      { metric: "Active", value: stats?.businesses?.activeBusinesses ?? 0, fill: "var(--color-chart-2)" },
      { metric: "Verified", value: stats?.businesses?.verifiedBusinesses ?? 0, fill: "var(--color-chart-3)" },
      { metric: "New Signups", value: stats?.businesses?.newSignUps ?? 0, fill: "var(--color-chart-4)" },
    ],
    [stats]
  );

  const paidCustomers = stats?.customers?.customersPaid ?? 0;
  const signedUpCustomers = stats?.customers?.customersSignedUp ?? 0;
  const unpaidCustomers = Math.max(signedUpCustomers - paidCustomers, 0);

  const customerDoughnut = useMemo(
    () => [
      { name: "Paid", value: paidCustomers, fill: "var(--color-chart-2)" },
      { name: "Unpaid", value: unpaidCustomers, fill: "var(--color-chart-5)" },
    ],
    [paidCustomers, unpaidCustomers]
  );

  return (
    <div className="bg-[#F4F6F8] w-screen h-screen flex flex-col">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <SideBar />

        <div className="flex-1 p-6 overflow-y-auto bg-[#F4F6F8] space-y-5">
          <h1 className="text-[28px] leading-[1.1] font-[700] text-[#0F172A]">Insights</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-4">
              <p className="text-[13px] text-[#6B7280]">Gross Revenue</p>
              <p className="text-[28px] font-[700] text-[#111827] mt-1">
                ₦ {(stats?.transactions?.grossRevenue ?? 0).toLocaleString("en-NG")}
              </p>
            </div>
            <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-4">
              <p className="text-[13px] text-[#6B7280]">Total Businesses</p>
              <p className="text-[28px] font-[700] text-[#111827] mt-1">
                {(stats?.businesses?.totalBusinesses ?? 0).toLocaleString("en-NG")}
              </p>
            </div>
            <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-4">
              <p className="text-[13px] text-[#6B7280]">Signed Up Customers</p>
              <p className="text-[28px] font-[700] text-[#111827] mt-1">
                {(signedUpCustomers ?? 0).toLocaleString("en-NG")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
              <p className="text-[16px] font-[600] text-[#111827]">Transaction Performance</p>
              <p className="text-[13px] text-[#6B7280] mt-1">Success, pending and failed transactions at a glance.</p>
              <ChartContainer
                config={{ value: { label: "Transactions", color: "var(--color-chart-1)" } }}
                className="h-[300px] w-full mt-4"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={transactionBars} margin={{ left: 8, right: 8, top: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="metric" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} width={42} />
                    <ChartTooltip
                      cursor={false}
                      content={(props) => <ChartTooltipContent {...props} />}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {transactionBars.map((entry) => (
                        <Cell key={entry.metric} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
              <p className="text-[16px] font-[600] text-[#111827]">Customer Payment Mix</p>
              <p className="text-[13px] text-[#6B7280] mt-1">Paid versus unpaid customers based on sign ups.</p>
              <ChartContainer
                config={{ value: { label: "Customers", color: "var(--color-chart-2)" } }}
                className="h-[300px] w-full mt-4"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={(props) => <ChartTooltipContent {...props} />}
                    />
                    <Pie
                      data={customerDoughnut}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={105}
                      paddingAngle={3}
                    >
                      {customerDoughnut.map((entry) => (
                        <Cell key={entry.name} fill={entry.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 flex items-center gap-4 text-[13px] text-[#6B7280]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--color-chart-2)]" />
                  Paid
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[var(--color-chart-5)]" />
                  Unpaid
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[14px] border border-[#ECEEF1] p-5">
            <p className="text-[16px] font-[600] text-[#111827]">Business Growth</p>
            <p className="text-[13px] text-[#6B7280] mt-1">Total, active, verified, and newly signed up businesses.</p>
            <ChartContainer
              config={{ value: { label: "Businesses", color: "var(--color-chart-3)" } }}
              className="h-[320px] w-full mt-4"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={businessBars} margin={{ left: 8, right: 8, top: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="metric" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} width={42} />
                  <ChartTooltip
                    cursor={false}
                    content={(props) => <ChartTooltipContent {...props} />}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {businessBars.map((entry) => (
                      <Cell key={entry.metric} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {loading && (
            <p className="text-[13px] text-[#6B7280]">Loading latest insights...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Insights;
