import { useState, useEffect } from "react";
import PieChart, { PieChartDataProps } from "./PieChart";
import { useAnalytics } from "@/context/AnalyticsContext";
import { CustomEvent } from "bog-analytics";
import Image from "next/image";

const UserTraffic = () => {
  const [currentTab, setCurrentTab] = useState("Major Sources");
  const [sourceData, setSourceData] = useState<PieChartDataProps[]>([]);
  const [groupsData, setGroupsData] = useState<PieChartDataProps[]>([]);

  const { analyticsViewer } = useAnalytics();

  const getData = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // beginning of the day today
      const visitEvents = await analyticsViewer.getAllCustomEvents(
        "Jennifer Ann's",
        "Visit",
        "Visit",
        today,
      );

      if (visitEvents.length === 0) {
        setSourceData([]);
        setGroupsData([]);
        return;
      }

      // SOURCE DATA
      const referrerCount: Record<string, number> = {};

      visitEvents.forEach((event: CustomEvent) => {
        const referrer = event.properties.referrer;

        if (referrer in referrerCount) {
          referrerCount[referrer]++;
        } else {
          referrerCount[referrer] = 1;
        }
      });

      const referrerChartData = Object.entries(referrerCount).map(
        ([referrer, count]) => ({
          id: referrer,
          label: referrer,
          value: count,
        }),
      );

      setSourceData(referrerChartData);

      // GROUP DATA
      const groupMap: Record<string, string> = {
        student: "Student",
        educator: "Educator",
        parent: "Parent",
        administrator: "Admin",
      };

      const userGroupCount: Record<string, number> = {
        Student: 0,
        Educator: 0,
        Parent: 0,
        Admin: 0,
      };

      visitEvents.forEach((event: CustomEvent) => {
        const group = groupMap[event.properties.userGroup];
        if (
          group === "Student" ||
          group === "Educator" ||
          group === "Parent" ||
          group === "Admin"
        ) {
          userGroupCount[group]++;
        }
      });

      const groupChartData = Object.entries(userGroupCount).map(
        ([group, count]) => ({
          id: group,
          label: group,
          value: count,
        }),
      );

      setGroupsData(groupChartData);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderContent = () => {
    if (sourceData.length === 0) {
      return (
        <div className="flex flex-col items-center self-stretch">
          <Image
            src={"/orange_heart.svg"}
            alt="No views"
            width={180}
            height={140}
          />
          <h1 className="mt-4 font-inter text-2xl text-orange-primary">
            Sorry, no {currentTab.toLowerCase()}!
          </h1>
          <h2 className="text-sm text-gray-500">
            No users viewed the site today.
          </h2>
        </div>
      );
    }
    switch (currentTab) {
      case "Major Sources":
        return <PieChart data={sourceData} type="sources" />;
      case "Links":
        return <div>Content for Links</div>;
      case "User Groups":
        return <PieChart data={groupsData} type="groups" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-start gap-4 self-stretch rounded-2xl p-6">
      <h1 className="self-stretch font-inter text-2xl text-stone-700">
        User Traffic
      </h1>
      <div className="flex space-x-4 self-stretch border-b-2 border-orange-primary">
        <button
          className={`rounded-t-md px-3 py-2 text-xs ${
            currentTab === "Major Sources"
              ? "bg-orange-primary text-white"
              : "bg-gray-100 text-gray-500"
          }`}
          onClick={() => setCurrentTab("Major Sources")}
        >
          Major Sources
        </button>
        <button
          className={`rounded-t-md px-4 py-2 text-xs ${
            currentTab === "Links"
              ? "bg-orange-primary text-white"
              : "bg-gray-100 text-gray-500"
          }`}
          onClick={() => setCurrentTab("Links")}
        >
          Links
        </button>
        <button
          className={`rounded-t-md px-4 py-2 text-xs ${
            currentTab === "User Groups"
              ? "bg-orange-primary text-white"
              : "bg-gray-100 text-gray-500"
          }`}
          onClick={() => setCurrentTab("User Groups")}
        >
          User Groups
        </button>
      </div>
      <div className="self-stretch overflow-x-auto bg-white">
        {renderContent()}
      </div>
    </div>
  );
};

export default UserTraffic;
