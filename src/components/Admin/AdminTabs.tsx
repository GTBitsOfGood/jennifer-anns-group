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
    [Pages.THEMES]: "Themes and Tags",
    [Pages.ACCOUNTMANAGEMENT]: "Account Management",
  };
  return (
    <div className="mx-6">
      <ul className="flex flex-wrap border-b-2 border-orange-primary text-center text-sm font-medium">
        {Object.entries(tabs).map(([key, tab]) => (
          <li key={key} className="me-2">
            <Link
              href={key}
              className={cx("inline-block rounded-t-lg p-4 text-base", {
                "bg-orange-primary text-white": page === key,
                "bg-light-gray text-gray-text hover:bg-gray-hover":
                  page !== key,
              })}
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
