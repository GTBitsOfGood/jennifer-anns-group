import pageAccessHOC from "@/components/HOC/PageAccess";
import GamesSection from "@/components/Admin/ThemesTags/GamesSection";
import ThemesTagsSection from "@/components/Admin/ThemesTags/ThemesTagsSection";
import AdminTabs from "@/components/Admin/AdminTabs";
import { Pages } from "@/utils/consts";

function Themes() {
  return (
    <AdminTabs page={Pages.THEMES}>
      <div className="my-6 flex flex-col items-center gap-10 px-28">
        <ThemesTagsSection />
        <GamesSection />
      </div>
    </AdminTabs>
  );
}

export default pageAccessHOC(Themes);
