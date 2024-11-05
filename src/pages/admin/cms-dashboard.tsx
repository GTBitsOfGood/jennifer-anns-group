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
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PieChartDataProps {
  id: string;
  label: string;
  value: number;
  ratio?: string;
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

const formatUserTrafficData = (
  visitEvents: any[],
): {
  sourceData: PieChartDataProps[];
  groupsData: PieChartDataProps[];
} => {
  // No data
  if (!visitEvents || (visitEvents && visitEvents.length === 0)) {
    const sourceData: PieChartDataProps[] = [];
    const groupsData: PieChartDataProps[] = [];
    return { sourceData, groupsData };
  }

  // SOURCE DATA
  const referrerCount: Record<string, number> = {};

  visitEvents.forEach((event: CustomVisitEvent) => {
    const referrer = event.properties.referrer;
    if (referrer in referrerCount) {
      referrerCount[referrer]++;
    } else {
      referrerCount[referrer] = 1;
    }
  });

  let referrerChartData = Object.entries(referrerCount).map(
    ([referrer, count]) => ({
      id: referrer,
      label: referrer,
      value: count,
      ratio: ((count / visitEvents.length) * 100).toFixed(2),
    }),
  );
  referrerChartData = referrerChartData.filter((data) => data.label != "None");
  // We'll have to implement proper filtering later to remove local urls, but they're useful for testing

  const sourceData = referrerChartData;

  // GROUP DATA
  const userGroupCount: Record<string, number> = {
    Student: 0,
    Educator: 0,
    Parent: 0,
    Admin: 0,
  };

  visitEvents.forEach((event: CustomVisitEvent) => {
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

  const groupsData = groupChartData;

  return { sourceData, groupsData };
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
  const [dataAge, setDataAge] = useState<"Day" | "Week" | "Month">("Day");
  const [selectedGameInfoRow, setSelectedGameInfoRow] = useState<number>(2);
  const itemsPerPage = 8;

  const { getCustomEventsPaginated } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [trafficSourceData, setTrafficSourceData] = useState<
    PieChartDataProps[]
  >([]);
  const [trafficGroupsData, setTrafficGroupsData] = useState<
    PieChartDataProps[]
  >([]);
  const [allGameData, setAllGameData] = useState<GameData[]>([]);
  const [userLeaderboard, setUserLeaderboard] = useState<
    UserLeaderboardEntry[][]
  >([]);

  const getData = async () => {
    try {
      setLoading(true);

      const afterTime = new Date();
      switch (dataAge) {
        case "Day":
          afterTime.setDate(afterTime.getDate() - 1);
          break;
        case "Week":
          afterTime.setDate(afterTime.getDate() - 7);
          break;
        case "Month":
          afterTime.setDate(afterTime.getDate() - 30);
          break;
      }

      const visitQueryParams = {
        projectName: "Jennifer Ann's",
        environment: EventEnvironment.DEVELOPMENT,
        category: "Visit",
        subcategory: "Visit",
        limit: 50000,
        afterId: undefined,
        afterTime: afterTime.toString(),
      };
      const visitEvents = await getCustomEventsPaginated(visitQueryParams);

      const { sourceData, groupsData } = formatUserTrafficData(
        visitEvents ? visitEvents.events : [],
      );

      const downloadQueryParams = {
        projectName: "Jennifer Ann's",
        environment: EventEnvironment.DEVELOPMENT,
        category: "Download",
        subcategory: "game",
        limit: 2000,
        afterId: undefined,
      };
      const gameEvents = await getCustomEventsPaginated(downloadQueryParams);

      const pdfQueryParams = {
        projectName: "Jennifer Ann's",
        environment: EventEnvironment.DEVELOPMENT,
        category: "View",
        subcategory: "pdf",
        limit: 2000,
        afterId: undefined,
      };
      const pdfEvents = await getCustomEventsPaginated(pdfQueryParams);

      const { gameData, leaderboardData } = await formatGameEventsData(
        gameEvents?.events,
        pdfEvents?.events,
        visitEvents?.events,
      );

      setTrafficSourceData(sourceData);
      setTrafficGroupsData(groupsData);
      setAllGameData(gameData);
      setUserLeaderboard(leaderboardData);
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  };

  useEffect(() => {
    getData();
  }, [dataAge]); // re-fetch data when data age limit is changed

  useEffect(() => {
    const fetchAllUserNames = async () => {
      if (!userLeaderboard || userLeaderboard.length === 0) {
        return;
      }

      const shouldFetchNames = userLeaderboard.some((gameRow) =>
        gameRow.some((entry) => entry.name === "Loading..."),
      );

      if (!shouldFetchNames) {
        return;
      }

      // Collect all unique user IDs from the leaderboard
      const allUserIds = Array.from(
        new Set(
          userLeaderboard.flatMap((gameRow) =>
            gameRow.map((entry) => entry.id),
          ),
        ),
      );

      try {
        const response = await fetch("/api/users/names", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: allUserIds }),
        });

        if (!response.ok) return;

        const data = await response.json();
        const userNames = data.names;

        // Update the leaderboard with fetched names
        setUserLeaderboard((prevData) =>
          prevData.map((gameRow) =>
            gameRow.map((entry) => ({
              ...entry,
              name: userNames[entry.id] || "Unknown",
            })),
          ),
        );
      } catch (error) {
        console.error("Error fetching user names:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUserNames();
  }, [userLeaderboard]);

  function downloadDataXLSX() {
    // cleaning data objects for spreadsheet
    let sourceInfo = trafficSourceData.map(({ label, value, ratio }) => ({
      URL: label,
      "Hits from Page": value,
      "Percent of Hits": ratio,
    }));

    const totalCount = trafficGroupsData.reduce(
      (sum, item) => sum + item.value,
      0,
    );

    const groupsInfo = trafficGroupsData.map((item) => ({
      "User Group": item.id,
      Percentage:
        Math.round((item.value / totalCount) * 100.0).toString() + "%",
    }));

    let gameInfo = allGameData.map(
      ({ gameTitle, hitsToPage, hitsToPDF, downloads }) => ({
        "Game Title": gameTitle,
        "Hits To Page": hitsToPage,
        "Hits To PDF": hitsToPDF,
        Downloads: downloads,
      }),
    );

    let wb = XLSX.utils.book_new();

    let sourceSheet = XLSX.utils.json_to_sheet(sourceInfo);
    let groupSheet = XLSX.utils.json_to_sheet(groupsInfo);
    let gameSheet = XLSX.utils.json_to_sheet(gameInfo);

    XLSX.utils.book_append_sheet(wb, sourceSheet, "Referrer Breakdown");
    XLSX.utils.book_append_sheet(wb, groupSheet, "User Groups");
    XLSX.utils.book_append_sheet(wb, gameSheet, "Game Info");

    userLeaderboard.map((leaderboard, i) => {
      let entryInfo = leaderboard.map(({ name, type, playsDownloads }) => ({
        Name: name,
        Type: type,
        Downloads: playsDownloads,
      }));

      let ws = XLSX.utils.json_to_sheet(entryInfo);
      let gameName = gameInfo[i]["Game Title"];
      if (gameName.length > 15) {
        gameName = gameName.substring(0, 11) + "...";
      }
      let name = "Leaderboard " + (i + 1) + " (" + gameName + ")";

      XLSX.utils.book_append_sheet(wb, ws, name);
    });
    XLSX.writeFile(wb, `Dashboard Analytics (1 ${dataAge}).xlsx`);
  }

  return (
    <div>
      <div className="relative mx-auto w-[calc(100%-4rem)] max-w-[90%]">
        <div className="absolute right-0 flex gap-2">
          <Select
            defaultValue={dataAge}
            onValueChange={(value) =>
              setDataAge(value as "Day" | "Week" | "Month")
            }
          >
            <SelectTrigger className="gap-2 text-black">
              <SelectValue>{dataAge}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Day">Day</SelectItem>
              <SelectItem value="Week">Week</SelectItem>
              <SelectItem value="Month">Month</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="mainblue"
            className="text-md gap-2"
            disabled={loading}
            onClick={downloadDataXLSX}
          >
            <ArrowDownToLine size={18} /> Download XLSX
          </Button>
        </div>
      </div>
      <AdminTabs page={Pages.CMSDASHBOARD}>
        <div className="my-6 flex flex-col items-stretch gap-6 rounded-2xl bg-orange-light-bg p-8">
          <div className="flex">
            <div className="flex w-3/5 flex-col gap-6">
              <div className="rounded-2xl bg-white p-6 text-2xl text-black">
                <UserTraffic
                  trafficSourceData={trafficSourceData}
                  trafficGroupsData={trafficGroupsData}
                  loading={loading}
                />
              </div>
              {/* prettier-ignore */}
              <div className="text-black-title flex h-full flex-col rounded-2xl bg-white p-6 text-2xl font-medium">
                <p>Game Info</p>
                <div className="flex-grow overflow-auto">
                  {loading ? (
                    <div className="flex items-center justify-center py-10">
                      <Spinner
                        className="mb-5 h-10 w-10"
                        thickness="4px"
                        emptyColor="#98A2B3"
                        color="#164C96"
                      />
                    </div>
                  ) : (
                    <PaginatedTable
                      columns={GameInfoColumns}
                      data={allGameData}
                      itemsPerPage={itemsPerPage}
                      setSelectedRow={setSelectedGameInfoRow}
                      selectedRow={selectedGameInfoRow}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="relative h-64 w-6 bg-orange-light-bg">
              {/* White triangle to indicate which game's detailed info is being displayed */}
              <div
                className="h-0 w-0 border-b-[15px] border-r-[25px] border-t-[15px] border-b-transparent border-r-white border-t-transparent"
                style={{
                  transform: `translateY(${(selectedGameInfoRow % itemsPerPage) * 53 + 510}px)`,
                }}
              ></div>
            </div>
            {/* prettier-ignore */}

            <div className="text-black-title flex w-2/5 flex-col gap-6 truncate text-wrap rounded-2xl bg-white p-6 text-2xl font-medium">
              {allGameData[selectedGameInfoRow]?.gameTitle ?? ""}
              <div className="rounded-2xl border-[1px] border-orange-primary p-4 text-base text-black">
                User Groups
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Spinner
                      className="mb-5 h-10 w-10"
                      thickness="4px"
                      emptyColor="#98A2B3"
                      color="#164C96"
                    />
                  </div>
                ) : (
                  <UserGroupsByGame
                    data={
                      allGameData[selectedGameInfoRow]?.userGroupsData ?? []
                    }
                  />
                )}
              </div>
              <div className="flex flex-grow flex-col rounded-2xl border-[1px] border-orange-primary p-4 text-base text-black">
                <p>User Leaderboard</p>
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Spinner
                      className="mb-5 h-10 w-10"
                      thickness="4px"
                      emptyColor="#98A2B3"
                      color="#164C96"
                    />
                  </div>
                ) : (
                  <PaginatedTable
                    columns={UserLeaderboardColumns}
                    data={userLeaderboard[selectedGameInfoRow] ?? []}
                    itemsPerPage={itemsPerPage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </AdminTabs>
    </div>
  );
};

export default pageAccessHOC(CMSDashboardPage);
