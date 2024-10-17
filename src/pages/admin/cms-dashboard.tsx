import { useEffect, useState } from "react";
import pageAccessHOC from "@/components/HOC/PageAccess";
import AdminTabs from "@/components/Admin/AdminTabs";
import { Pages } from "@/utils/consts";
import { columns as GameInfoColumns } from "@/components/Admin/Table/GameInfoColumns";
import { columns as UserLeaderboardColumns } from "@/components/Admin/Table/UserLeaderboardColumns";
import { PaginatedTable } from "@/components/Admin/Table/PaginatedTable";
import UserTraffic, {
  groupMap,
} from "@/components/Admin/CMSDashboard/UserTraffic";
import UserGroupsByGame from "@/components/Admin/CMSDashboard/UserGroupsByGame";
import { useAnalytics } from "@/context/AnalyticsContext";
import { CustomVisitEvent } from "@/utils/types";
import { EventEnvironment } from "bog-analytics";

// TO DO: replace dummy data with actual data
const dummyData = Array.from({ length: 100 }, (_, i) => ({
  gameTitle: `Adrift ${i + 1}`,
  hitsToPage: 18 + i,
  hitsToPDF: 22 + i,
  downloads: 0 + i,
  plays: 6 + i,
  userLeaderboard:
    i < 10
      ? Array.from({ length: 10 }, (_, j) => ({
          name: `User ${j + i + 1}`,
          type: "Student",
          playsDownloads: Math.floor(6 + j / 2 + i),
        }))
      : undefined,
}));

interface PieChartDataProps {
  id: string;
  label: string;
  value: number;
}

type UserLeaderboardEntry = {
  name: string;
  type: string;
  playsDownloads: number;
};

type GameData = {
  gameTitle: string;
  hitsToPage: number;
  hitsToPDF: number;
  downloads: number;
  plays: number;
  userLeaderboard?: UserLeaderboardEntry[];
  userGroupsData: PieChartDataProps[];
};

const formatGameEventsData = (
  gameEvents?: any[],
  pdfEvents?: any[],
): GameData[] => {
  // Aggregate the downloads and PDF hits for each game
  const gameDownloadCounts: Record<string, number> = {};
  const pdfHitCounts: Record<string, number> = {};
  const userActivity: Record<
    string,
    Record<string, { count: number; type: string }>
  > = {};

  // Handle game events
  if (gameEvents) {
    gameEvents.forEach((event) => {
      const gameName = event.properties.gameName;
      const userId = event.properties.userId || "Unknown";
      const userGroup = event.properties.userGroup || "Unknown";

      if (!gameName) return; // Skip if gameName is not available

      // Count downloads for the game
      gameDownloadCounts[gameName] = (gameDownloadCounts[gameName] || 0) + 1;

      // Track user activity for leaderboard
      if (!userActivity[gameName]) {
        userActivity[gameName] = {};
      }
      if (!userActivity[gameName][userId]) {
        userActivity[gameName][userId] = {
          count: 0,
          type: groupMap[userGroup],
        };
      }
      userActivity[gameName][userId].count += 1;
    });
  }

  // Handle PDF events
  if (pdfEvents) {
    pdfEvents.forEach((event) => {
      const gameName = event.properties.gameName;
      const userId = event.properties.userId || "Unknown";
      const userGroup = event.properties.userGroup || "Unknown";

      if (!gameName) return; // Skip if gameName is not available

      // Count PDF hits for the game
      pdfHitCounts[gameName] = (pdfHitCounts[gameName] || 0) + 1;

      // Track user activity for leaderboard
      if (!userActivity[gameName]) {
        userActivity[gameName] = {};
      }
      if (!userActivity[gameName][userId]) {
        userActivity[gameName][userId] = {
          count: 0,
          type: groupMap[userGroup],
        };
      }
      userActivity[gameName][userId].count += 1;
    });
  }

  // Transform aggregated data into the desired format
  const gameNames = new Set([
    ...Object.keys(gameDownloadCounts),
    ...Object.keys(pdfHitCounts),
  ]);
  return Array.from(gameNames).map((gameTitle) => {
    // Initialize user group count for the pie chart
    const userGroupCount: Record<string, number> = {
      Student: 0,
      Educator: 0,
      Parent: 0,
      Admin: 0,
      Other: 0,
    };

    // Update the user group counts based on user activity
    if (userActivity[gameTitle]) {
      Object.values(userActivity[gameTitle]).forEach(({ count, type }) => {
        if (userGroupCount[type] !== undefined) {
          userGroupCount[type] += count;
        } else {
          userGroupCount["Other"] += count;
        }
      });
    }

    // Create leaderboard entries
    const userLeaderboard: UserLeaderboardEntry[] | undefined = userActivity[
      gameTitle
    ]
      ? Object.entries(userActivity[gameTitle])
          .map(([userId, { count, type }]) => ({
            name: `User ${userId}`,
            type,
            playsDownloads: count,
          }))
          .sort((a, b) => b.playsDownloads - a.playsDownloads) // Sort by activity count
      : undefined;

    // Create user groups data for pie chart
    const userGroupsData: PieChartDataProps[] = Object.entries(
      userGroupCount,
    ).map(([group, count]) => ({
      id: group,
      label: group,
      value: count,
    }));

    return {
      gameTitle,
      hitsToPage: 0, // Not available
      hitsToPDF: pdfHitCounts[gameTitle] || 0,
      downloads: gameDownloadCounts[gameTitle] || 0,
      plays: 0, // Not available
      userLeaderboard,
      userGroupsData,
    };
  });
};

const CMSDashboardPage = () => {
  const [selectedGameInfoRow, setSelectedGameInfoRow] = useState<number>(0);
  const itemsPerPage = 8;

  const { analyticsViewer } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [allGameData, setAllGameData] = useState<GameData[]>([]);

  const getData = async () => {
    try {
      setLoading(true);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const downloadQueryParams = {
        projectName: "Jennifer Ann's",
        environment: EventEnvironment.DEVELOPMENT,
        category: "Download",
        limit: 1000,
        subcategory: "game",
        afterId: undefined,
      };
      const gameEvents =
        await analyticsViewer.getCustomEventsPaginated(downloadQueryParams);
      const pdfQueryParams = {
        projectName: "Jennifer Ann's",
        environment: EventEnvironment.DEVELOPMENT,
        category: "View",
        limit: 1000,
        subcategory: "pdf",
        afterId: undefined,
      };
      console.log("gameevents", gameEvents?.events);
      const pdfEvents =
        await analyticsViewer.getCustomEventsPaginated(pdfQueryParams);

      setAllGameData(
        formatGameEventsData(gameEvents?.events, pdfEvents?.events),
      );

      // if (!visitEvents || (visitEvents && visitEvents.length === 0)) {
      //   setSourceData([]);
      //   setGroupsData([]);
      //   setLoading(false);
      //   return;
      // }

      // // SOURCE DATA
      // const referrerCount: Record<string, number> = {};

      // visitEvents.forEach((event: CustomVisitEvent) => {
      //   const referrer = event.properties.referrer;

      //   if (referrer in referrerCount) {
      //     referrerCount[referrer]++;
      //   } else {
      //     referrerCount[referrer] = 1;
      //   }
      // });

      // const referrerChartData = Object.entries(referrerCount).map(
      //   ([referrer, count]) => ({
      //     id: referrer,
      //     label: referrer,
      //     value: count,
      //   }),
      // );

      // setSourceData(referrerChartData);

      // // GROUP DATA
      // const groupMap: Record<string, string> = {
      //   student: "Student",
      //   educator: "Educator",
      //   parent: "Parent",
      //   administrator: "Admin",
      // };

      // const userGroupCount: Record<string, number> = {
      //   Student: 0,
      //   Educator: 0,
      //   Parent: 0,
      //   Admin: 0,
      // };

      // visitEvents.forEach((event: CustomVisitEvent) => {
      //   const group = groupMap[event.properties.userGroup];
      //   if (
      //     group === "Student" ||
      //     group === "Educator" ||
      //     group === "Parent" ||
      //     group === "Admin"
      //   ) {
      //     userGroupCount[group]++;
      //   }
      // });

      // const groupChartData = Object.entries(userGroupCount).map(
      //   ([group, count]) => ({
      //     id: group,
      //     label: group,
      //     value: count,
      //   }),
      // );

      // setGroupsData(groupChartData);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <AdminTabs page={Pages.CMSDASHBOARD}>
      {/* prettier-ignore */}
      <div className="bg-orange-light-bg my-6 flex items-stretch rounded-2xl p-12">
        <div className="flex w-3/5 flex-col gap-6">
          <div className="rounded-2xl bg-white p-6 text-2xl text-black">
            <UserTraffic />
          </div>
          <div className="flex h-full flex-col rounded-2xl bg-white p-6 text-2xl text-black">
            <p>Game Info</p>
            <div className="flex-grow overflow-auto">
              <PaginatedTable
                columns={GameInfoColumns}
                data={allGameData}
                itemsPerPage={itemsPerPage}
                setSelectedRow={setSelectedGameInfoRow}
                selectedRow={selectedGameInfoRow}
              />
            </div>
          </div>
        </div>
         {/* prettier-ignore */}
        <div className="bg-orange-light-bg relative h-64 w-6">
          {/* White triangle to indicate which game's detailed info is being displayed */}
          <div
            className="h-0 w-0 border-b-[15px] border-r-[25px] border-t-[15px] border-b-transparent border-r-white border-t-transparent"
            style={{
              transform: `translateY(${(selectedGameInfoRow % itemsPerPage) * 53 + 342}px)`,
            }}
          ></div>
        </div>
        <div className="flex w-2/5 flex-col gap-6 rounded-2xl bg-white p-6 text-2xl text-black">
          {allGameData[selectedGameInfoRow]?.gameTitle ?? ""}
          <div className="rounded-2xl border-[1px] border-orange-primary p-4 text-base text-black">
            User Groups
            <UserGroupsByGame data={allGameData[selectedGameInfoRow]?.userGroupsData ?? []}/>

          </div>
          <div className="flex flex-grow flex-col rounded-2xl border-[1px] border-orange-primary p-4 text-base text-black">
            <p>User Leaderboard</p>
            <PaginatedTable
              columns={UserLeaderboardColumns}
              data={allGameData[selectedGameInfoRow]?.userLeaderboard ?? []}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
    </AdminTabs>
  );
};

export default pageAccessHOC(CMSDashboardPage);
