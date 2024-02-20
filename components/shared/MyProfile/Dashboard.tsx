import { DashboardData } from "@/types"
import { useState } from "react"
import {DataTable} from "../Table/DataTable"
import { columns } from "../Table/columns"

const Dashboard = ({dashboardData}:{dashboardData:DashboardData[]}) => {
  
  return (
    <div>
      <DataTable columns={columns} data={dashboardData} />
    </div>
  )
}

export default Dashboard
