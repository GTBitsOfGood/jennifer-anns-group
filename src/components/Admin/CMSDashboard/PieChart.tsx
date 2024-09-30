import React from "react";
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
  const processed_data = data.map((item) => ({
    ...item,
    label:
      item.label.length > 40 ? item.label.substring(0, 40) + "..." : item.label,
  }));

  const totalCount = data.reduce((sum, item) => sum + item.value, 0);

  const percentagesLegend = data.map((item) => ({
    id: item.id,
    label: Math.round((item.value / totalCount) * 100.0).toString() + "%",
  }));

  return (
    <div
      className={
        type === "sources" ? "my-6 h-36 w-[550px]" : "my-6 h-36 w-[410px]"
      }
    >
      <DynamicResponsivePie
        data={processed_data}
        theme={{
          legends: {
            text: { fontSize: 14 },
          },
        }}
        margin={{ top: 5, bottom: 5, right: type === "sources" ? 405 : 266 }}
        enableArcLabels={false}
        enableArcLinkLabels={false}
        tooltip={() => <></>}
        legends={[
          {
            data: percentagesLegend,
            anchor: "center",
            direction: "column",
            justify: true,
            translateX: 0,
            translateY: 0,
            itemsSpacing: 5,
            itemWidth: type === "sources" ? 900 : 500,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 0,
          },
          {
            anchor: "center",
            direction: "column",
            justify: false,
            translateX: 150,
            translateY: 0,
            itemsSpacing: 5,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 15,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                },
              },
            ],
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
                  /^(https?:\/\/)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}.*$/;
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
  );
};

export default PieChart;
