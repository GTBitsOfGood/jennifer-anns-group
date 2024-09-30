import { useState } from "react";
import pageAccessHOC from "@/components/HOC/PageAccess";
import AdminTabs from "@/components/Admin/AdminTabs";
import { Pages } from "@/utils/consts";
import { columns as GameInfoColumns } from "@/components/Admin/Table/GameInfoColumns";
import { columns as UserLeaderboardColumns } from "@/components/Admin/Table/UserLeaderboardColumns";
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
  const [selectedGameInfoRow, setSelectedGameInfoRow] = useState<number>(0);
  const itemsPerPage = 8;

  return (
    <AdminTabs page={Pages.CMSDASHBOARD}>
      {/* prettier-ignore */}
      <div className="bg-orange-light-bg my-6 flex items-stretch rounded-2xl p-12">
        <div className="flex w-3/5 flex-col gap-6">
          <div className="rounded-2xl bg-white p-6 text-2xl text-black">
            User Traffic
            <div className="h-24"></div> {/* Placeholder; remove later */}
          </div>
          <div className="flex h-full flex-col rounded-2xl bg-white p-6 text-2xl text-black">
            <p>Game Info</p>
            <div className="flex-grow overflow-auto">
              <PaginatedTable
                columns={GameInfoColumns}
                data={dummyData}
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
          {dummyData[selectedGameInfoRow].gameTitle}
          <div className="rounded-2xl border-[1px] border-orange-primary p-4 text-base text-black">
            User Groups
            <div className="h-24"></div> {/* Placeholder; remove later */}
          </div>
          <div className="flex flex-grow flex-col rounded-2xl border-[1px] border-orange-primary p-4 text-base text-black">
            <p>User Leaderboard</p>
            <PaginatedTable
              columns={UserLeaderboardColumns}
              data={dummyData[selectedGameInfoRow].userLeaderboard}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
    </AdminTabs>
  );
};

export default pageAccessHOC(CMSDashboardPage);
