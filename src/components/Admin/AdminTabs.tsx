import { Pages } from "@/utils/consts";
import Link from "next/link";
import cx from "classnames";

interface Props {
  page: Pages;
  children: React.ReactNode;
}

const AdminTabs = ({ page, children }: Props) => {
  const tabs: Partial<Record<Pages, string>> = {
    [Pages.CMSDASHBOARD]: "CMS Dashboard",
    [Pages.THEMES]: "Filter Management",
    [Pages.ACCOUNTMANAGEMENT]: "Account Management",
  };
  return (
    <div className="mx-auto w-[calc(100%-4rem)] max-w-[90%]">
      <ul className="flex flex-wrap border-b-2 border-orange-primary text-center font-medium">
        {Object.entries(tabs).map(([key, tab]) => (
          <li key={key} className="me-2">
            <Link
              href={key}
              className={cx(
                "inline-block rounded-t px-[16px] py-[12px] text-base transition-all",
                {
                  "bg-orange-primary text-white": page === key,
                  "bg-gray-tab text-gray-text hover:bg-gray-tab-hover":
                    page !== key,
                },
              )}
            >
              {tab}
            </Link>
          </li>
        ))}
      </ul>
      {children}
    </div>
  );
};

export default AdminTabs;
