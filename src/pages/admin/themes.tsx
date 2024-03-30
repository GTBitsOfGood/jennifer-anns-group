import GamesSection from "@/components/ThemesTags/GamesSection";
import ThemesTagsSection from "@/components/ThemesTags/ThemesTagsSection";

function Themes() {
  return (
    <div className="flex flex-col items-center gap-10 px-[10em] py-8">
      <h1 className="text-4xl font-semibold">Themes and Tags</h1>
      <ThemesTagsSection />
      <GamesSection />
    </div>
  );
}

export default Themes;
