import { useState } from "react";
import pageAccessHOC from "@/components/HOC/PageAccess";
import AdminTabs from "@/components/Admin/AdminTabs";
import { Pages } from "@/utils/consts";
import { columns as GameInfoColumns } from "@/components/Admin/Table/game-info-columns";
import { columns as UserLeaderboardColumns } from "@/components/Admin/Table/user-leaderboard-columns";
import { PaginatedTable } from "@/components/Admin/Table/PaginatedTable";

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

const CMSDashboardPage = () => {
  const [selectedRow, setSelectedRow] = useState<number>(0); // TO DO: implement triangle
  const itemsPerPage = 8;

  return (
    <AdminTabs page={Pages.CMSDASHBOARD}>
      <div className="my-6 flex rounded-2xl bg-orange-light-bg p-12">
        <div className="flex w-3/5 flex-col gap-6">
          <div className="rounded-2xl bg-white p-6 text-2xl text-black">
            User Traffic
            <div className="h-24"></div> {/* Placeholder; remove later */}
          </div>
          <div className="rounded-2xl bg-white p-6 text-2xl text-black">
            Game Info
            <PaginatedTable
              columns={GameInfoColumns}
              data={dummyData}
              itemsPerPage={itemsPerPage}
              setSelectedRow={setSelectedRow}
            />
          </div>
        </div>
        <div className="relative h-64 w-6 bg-orange-light-bg">
          {/* White triangle to indicate which game's detailed info is being displayed */}
          <div
            className="h-0 w-0 border-b-[15px] border-r-[25px] border-t-[15px] border-b-transparent border-r-white border-t-transparent"
            style={{
              transform: `translateY(${(selectedRow % itemsPerPage) * 53 + 342}px)`,
            }}
          ></div>
        </div>
        <div className="flex w-2/5 flex-col gap-6 rounded-2xl bg-white p-6 text-2xl text-black">
          {dummyData[selectedRow].gameTitle}
          <div className="rounded-2xl border-[1px] border-orange-primary p-4 text-base text-black">
            User Groups
            <div className="h-24"></div> {/* Placeholder; remove later */}
          </div>
          <div className="flex-grow rounded-2xl border-[1px] border-orange-primary p-4 text-base text-black">
            User Leaderboard
            <PaginatedTable
              columns={UserLeaderboardColumns}
              data={dummyData[selectedRow].userLeaderboard}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
    </AdminTabs>
  );
};

export default pageAccessHOC(CMSDashboardPage);
