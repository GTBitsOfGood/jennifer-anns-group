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
import { Spinner } from "@chakra-ui/react";
import { set } from "mongoose";

interface PieChartDataProps {
  id: string;
  label: string;
  value: number;
}

type UserLeaderboardEntry = {
  name: string;
  type: string;
  playsDownloads: number;
  id: string;
};

type GameData = {
  gameTitle: string;
  hitsToPage: number;
  hitsToPDF: number;
  downloads: number;
  // plays: number; removed plays for now as it's not being logged
  userGroupsData: PieChartDataProps[];
};

const formatGameEventsData = async (
  gameEvents?: any[],
  pdfEvents?: any[],
  visitEvents?: any[],
): Promise<{
  gameData: GameData[];
  leaderboardData: UserLeaderboardEntry[][];
}> => {
  const gameDownloadCounts: Record<string, number> = {};
  const pdfHitCounts: Record<string, number> = {};
  const userActivity: Record<
    string,
    Record<string, { count: number; type: string; name?: string }>
  > = {};

  const gamePageHitsMap: Record<string, number> = {};

  if (gameEvents) {
    gameEvents.forEach((event) => {
      const gameName = event.properties.gameName;
      const userId = event.properties.userId || "Unknown";
      const userGroup = event.properties.userGroup || "Unknown";

      if (!gameName) return;

      gameDownloadCounts[gameName] = (gameDownloadCounts[gameName] || 0) + 1;

      if (!userActivity[gameName]) {
        userActivity[gameName] = {};
      }
      if (!userActivity[gameName][userId]) {
        userActivity[gameName][userId] = {
          count: 0,
          type: groupMap[userGroup] ? groupMap[userGroup] : "Other",
          name: undefined,
        };
      }
      userActivity[gameName][userId].count += 1;
    });
  }

  if (pdfEvents) {
    pdfEvents.forEach((event) => {
      const gameName = event.properties.gameName;
      if (!gameName) return;
      pdfHitCounts[gameName] = (pdfHitCounts[gameName] || 0) + 1;
    });
  }

  if (visitEvents) {
    visitEvents.forEach((event) => {
      const referrer = event.properties.referrer;
      const match = referrer && referrer.match(/\/games\/([a-zA-Z0-9]{24})/);
      if (match) {
        const gameId = match[1];
        gamePageHitsMap[gameId] = (gamePageHitsMap[gameId] || 0) + 1;
      }
    });
  }
  const gameIds = Object.keys(gamePageHitsMap);
  let gameNames: Record<string, string> = {};
  if (gameIds.length > 0) {
    try {
      const response = await fetch("/api/games/names", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameIds }),
      });

      if (!response.ok) {
        console.error("Failed to fetch game names");
      } else {
        const data = await response.json();
        gameNames = data.gameNames;
      }
    } catch (error) {
      console.error("Error fetching game names:", error);
    }
  }

  const gameTitles = new Set([
    ...Object.keys(gameDownloadCounts),
    ...Object.keys(pdfHitCounts),
  ]);
  const gameData: GameData[] = Array.from(gameTitles).map((gameTitle) => {
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
      hitsToPage: gameNames[gameTitle]
        ? gamePageHitsMap[gameNames[gameTitle]] || 0
        : 0,
      hitsToPDF: pdfHitCounts[gameTitle] || 0,
      downloads: gameDownloadCounts[gameTitle] || 0,
      userGroupsData,
    };
  });

  const leaderboardData: UserLeaderboardEntry[][] = [];

  gameTitles.forEach((gameTitle) => {
    const leaderboardEntries = userActivity[gameTitle]
      ? Object.entries(userActivity[gameTitle])
          .map(([userId, { count, type }]) => ({
            name: "Loading...",
            type,
            playsDownloads: count,
            id: userId,
          }))
          .sort((a, b) => b.playsDownloads - a.playsDownloads)
      : [];

    leaderboardData.push(leaderboardEntries);
  });

  return { gameData, leaderboardData };
};
const CMSDashboardPage = () => {
  const [selectedGameInfoRow, setSelectedGameInfoRow] = useState<number>(2);
  const itemsPerPage = 8;

  const { analyticsViewer } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [allGameData, setAllGameData] = useState<GameData[]>([]);
  const [userLeaderboard, setUserLeaderboard] = useState<
    UserLeaderboardEntry[][]
  >([]);

  const getData = async () => {
    try {
      setLoading(true);
      const downloadQueryParams = {
        projectName: "Jennifer Ann's",
        environment: EventEnvironment.DEVELOPMENT,
        category: "Download",
        subcategory: "game",
        limit: 2000,
        afterId: undefined,
      };
      const gameEvents =
        await analyticsViewer.getCustomEventsPaginated(downloadQueryParams);

      const pdfQueryParams = {
        projectName: "Jennifer Ann's",
        environment: EventEnvironment.DEVELOPMENT,
        category: "View",
        subcategory: "pdf",
        limit: 2000,
        afterId: undefined,
      };
      const pdfEvents =
        await analyticsViewer.getCustomEventsPaginated(pdfQueryParams);

      const visitQueryParams = {
        projectName: "Jennifer Ann's",
        environment: EventEnvironment.DEVELOPMENT,
        category: "Visit",
        subcategory: "Visit",
        limit: 50000,
        afterId: undefined,
      };
      const visitEvents =
        await analyticsViewer.getCustomEventsPaginated(visitQueryParams);

      const { gameData, leaderboardData } = await formatGameEventsData(
        gameEvents?.events,
        pdfEvents?.events,
        visitEvents?.events,
      );

      setAllGameData(gameData);
      setUserLeaderboard(leaderboardData);
    } catch (e) {
      console.error("Error fetching data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const initialSelectedRow = selectedGameInfoRow;
    const currentLeaderboard = userLeaderboard;

    if (!userLeaderboard || userLeaderboard.length === 0) {
      return;
    }

    const userIds = currentLeaderboard[initialSelectedRow].map(
      (entry) => entry.id,
    );

    const shouldFetchNames = currentLeaderboard[initialSelectedRow].some(
      (entry) => entry.name === "Loading...",
    );

    if (!shouldFetchNames) {
      return;
    }

    const fetchUserNames = async (userIds: string[]) => {
      try {
        const response = await fetch("/api/users/names", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds }),
        });

        if (!response.ok) throw new Error("Failed to fetch user names");
        const data = await response.json();
        return data.names;
      } catch (error) {
        console.error("Error fetching user names:", error);
        return {};
      }
    };

    const updateLeaderboardNames = async () => {
      const userNames = await fetchUserNames(userIds);

      setUserLeaderboard((prevData) => {
        const newData = [...prevData];

        if (newData[initialSelectedRow]) {
          newData[initialSelectedRow] = newData[initialSelectedRow].map(
            (entry) => ({
              ...entry,
              name: userNames[entry.id] || "Unknown",
            }),
          );
        }

        return newData;
      });
    };

    updateLeaderboardNames();
  }, [selectedGameInfoRow, userLeaderboard]);

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
              {loading ? 
                  <div className="flex items-center justify-center py-10">
                    <Spinner
                      className="mb-5 h-10 w-10"
                      thickness="4px"
                      emptyColor="#98A2B3"
                      color="#164C96"
                    />
                  </div>
                  :  
                  <PaginatedTable
                    columns={GameInfoColumns}
                    data={allGameData}
                    itemsPerPage={itemsPerPage}
                    setSelectedRow={setSelectedGameInfoRow}
                    selectedRow={selectedGameInfoRow}
                  />
              }
            </div>
          </div>
        </div>
         {/* prettier-ignore */}
        <div className="bg-orange-light-bg relative h-64 w-6">
          {/* White triangle to indicate which game's detailed info is being displayed */}
          <div
            className="h-0 w-0 border-b-[15px] border-r-[25px] border-t-[15px] border-b-transparent border-r-white border-t-transparent"
            style={{
              transform: `translateY(${(selectedGameInfoRow % itemsPerPage) * 53 + 500}px)`,
            }}
          ></div>
        </div>
        <div className="flex w-2/5 flex-col gap-6 rounded-2xl bg-white p-6 text-2xl text-black">
          {allGameData[selectedGameInfoRow]?.gameTitle ?? ""}
          <div className="rounded-2xl border-[1px] border-orange-primary p-4 text-base text-black">
            User Groups
            {loading ? 
              <div className="flex items-center justify-center py-10">
                <Spinner
                  className="mb-5 h-10 w-10"
                  thickness="4px"
                  emptyColor="#98A2B3"
                  color="#164C96"
                />
              </div>
              :  
              <UserGroupsByGame data={allGameData[selectedGameInfoRow]?.userGroupsData ?? []}/>
            }
          </div>
          <div className="flex flex-grow flex-col rounded-2xl border-[1px] border-orange-primary p-4 text-base text-black">
            <p>User Leaderboard</p>
            {loading ? 
              <div className="flex items-center justify-center py-10">
                <Spinner
                  className="mb-5 h-10 w-10"
                  thickness="4px"
                  emptyColor="#98A2B3"
                  color="#164C96"
                />
              </div>
              :  
              <PaginatedTable
              columns={UserLeaderboardColumns}
              data={userLeaderboard[selectedGameInfoRow] ?? []}
              itemsPerPage={itemsPerPage}
              />
            }
          </div>
        </div>
      </div>
    </AdminTabs>
  );
};

export default pageAccessHOC(CMSDashboardPage);
