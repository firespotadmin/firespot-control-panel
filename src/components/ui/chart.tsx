import * as React from "react";
import { Tooltip } from "recharts";
import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import type { TooltipContentProps } from "recharts/types/component/Tooltip";

import { cn } from "@/lib/utils";

export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

const useChart = () => {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }

  return context;
};

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([, value]) => value?.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
${colorConfig
  .map(([key, value]) => {
    return `[data-chart=${id}] { --color-${key}: ${value.color}; }`;
  })
  .join("\n")}
`,
      }}
    />
  );
};

export const ChartContainer = ({
  id,
  className,
  children,
  config,
}: React.ComponentProps<"div"> & {
  config: ChartConfig;
  children: React.ComponentProps<typeof Tooltip>["content"] extends never
    ? React.ReactNode
    : React.ReactNode;
}) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-sector[stroke='transparent']]:stroke-transparent",
          className
        )}
      >
        <ChartStyle id={chartId} config={config} />
        {children}
      </div>
    </ChartContext.Provider>
  );
};

export const ChartTooltip = Tooltip;

export const ChartTooltipContent = ({
  active,
  payload,
  className,
  indicator = "dot",
}: TooltipContentProps<ValueType, NameType> & {
  className?: string;
  indicator?: "dot" | "line";
}) => {
  const { config } = useChart();

  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid min-w-[8rem] items-start gap-2 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl",
        className
      )}
    >
      {payload.map((item: any, index: number) => {
        const key = String(item.dataKey || item.name || "value");
        const chartConfig = config[key];
        const color = item.color || item.payload?.fill || `var(--color-${key})`;

        return (
          <div key={`${key}-${index}`} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {indicator === "dot" ? (
                <div className="h-2.5 w-2.5 rounded-[2px]" style={{ backgroundColor: color }} />
              ) : (
                <div className="h-0.5 w-3" style={{ backgroundColor: color }} />
              )}
              <span className="text-muted-foreground">{chartConfig?.label || item.name || key}</span>
            </div>
            <span className="font-medium text-foreground">{item.value?.toLocaleString?.() ?? item.value}</span>
          </div>
        );
      })}
    </div>
  );
};
