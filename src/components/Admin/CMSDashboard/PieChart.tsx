import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const DynamicResponsivePie = dynamic(
  () => import("@nivo/pie").then((mod) => mod.ResponsivePie),
  { ssr: false },
);

export interface PieChartDataProps {
  id: string;
  label: string;
  value: number;
}

interface PieChartProps {
  data: PieChartDataProps[];
  type: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, type }) => {
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: "",
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (item: any, event: any) => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: event.clientX - containerRect.left,
        y: event.clientY - containerRect.top,
        content: item.id,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ ...tooltip, visible: false });
  };

  const [processedData, setProcessedData] = useState<PieChartDataProps[]>([]);
  const [percentagesLegend, setPercentagesLegend] = useState<
    { id: string; label: string }[]
  >([]);

  useEffect(() => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Sort data by value descending and get the top 5
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const topData = sortedData.slice(0, 5);
    const othersValue = sortedData
      .slice(5)
      .reduce((sum, item) => sum + item.value, 0);

    // Create processed data
    const othersData =
      othersValue > 0
        ? [{ id: "Other", label: "Other", value: othersValue }]
        : [];
    const processed = [...topData, ...othersData].map((item) => ({
      ...item,
      label:
        item.label.length > 40
          ? item.label.substring(0, 35) + "..."
          : item.label,
    }));

    // Prepare percentages legend
    const percentages = processed.map((item) => ({
      id: item.id,
      label: Math.round((item.value / total) * 100.0).toString() + "%",
    }));

    setProcessedData(processed);
    setPercentagesLegend(percentages);
  }, [data]);

  return (
    <div ref={containerRef} className="relative">
      {tooltip.visible && (
        <div
          style={{
            position: "absolute",
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            backgroundColor: "#38414B",
            color: "#fff",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            fontFamily: "Inter",
            overflowY: "auto",
            zIndex: 10,
          }}
        >
          {tooltip.content}
        </div>
      )}
      <div
        className={
          type === "sources" ? "my-6 h-36 w-[550px]" : "my-6 h-36 w-[410px]"
        }
      >
        <DynamicResponsivePie
          data={processedData}
          theme={{
            legends: {
              text: {
                fontSize: 14,
                fontFamily: "Inter",
                fontWeight: 500,
              },
            },
          }}
          colors={[
            "#FC9300",
            "#57A0D5",
            "#FED499",
            "#A9CBEB",
            "#2352A0",
            "#008AFC",
          ]}
          margin={{ top: 5, bottom: 5, right: type === "sources" ? 405 : 266 }}
          enableArcLabels={false}
          enableArcLinkLabels={false}
          tooltip={() => <></>}
          legends={[
            {
              // Legend for the percentages
              data: percentagesLegend,
              anchor: "center",
              direction: "column",
              justify: true,
              translateX: 0,
              translateY: 0,
              itemsSpacing: 5,
              itemWidth: type === "sources" ? 900 : 600,
              itemHeight: 18,
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 0,
            },
            {
              // Legend for clickable links
              anchor: "center",
              direction: "column",
              justify: false,
              translateX: 550,
              translateY: 0,
              itemsSpacing: 5,
              itemWidth: type === "sources" ? 900 : 915,
              itemHeight: 18,
              itemDirection: "left-to-right",
              itemOpacity: 1,
              itemTextColor: "#7A8086", // Medium color
              symbolSize: 15,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: type === "sources" ? "#000" : "#7A8086",
                  },
                },
              ],
              onMouseEnter: (item, event) => {
                if (type === "sources") {
                  handleMouseEnter(item, event);
                }
              },
              onMouseLeave: () => {
                if (type === "sources") {
                  handleMouseLeave();
                }
              },
              onClick: (legendItem: { id: string | number }) => {
                if (type === "sources") {
                  const url = (legendItem.id as string).trim();

                  // Check for empty, "None", or invalid URL patterns
                  if (!url || url === "None" || url === "about:client") {
                    console.warn("Invalid URL detected:", url);
                    return;
                  }

                  const fullUrl =
                    url.startsWith("http://") || url.startsWith("https://")
                      ? url
                      : `https://${url}`;

                  const urlPattern =
                    /^(https?:\/\/)?[a-zA-Z0-9.-]+(:\d+)?(\/.*)?$/;
                  if (urlPattern.test(fullUrl)) {
                    window.open(fullUrl);
                  } else {
                    console.warn("Invalid URL format:", fullUrl);
                  }
                }
              },
            },
          ]}
        />
      </div>
    </div>
  );
};

export default PieChart;
