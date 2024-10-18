import React from "react";
import type { PieChartDataProps } from "./PieChart";
import PieChart from "./PieChart";

interface UserGroupsByGameProps {
  data: PieChartDataProps[];
}

function UserGroupsByGame({ data }: UserGroupsByGameProps) {
  return <PieChart data={data} type="groups" />;
}
export default UserGroupsByGame;
