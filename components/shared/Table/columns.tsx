import { DashboardData } from "@/types"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

export const columns: ColumnDef<DashboardData>[] = [
    {
        accessorKey: '_id',
        header:'OrderID',
        
    },{
        accessorKey: 'eventTitle',
        header:'Event Title',
        
    },{
        accessorKey: 'totalAmount',
        header: 'Total Amount',
        cell:({row})=>{
            return <p>₹{row.getValue('totalAmount')}</p>
        }
    },{
        accessorKey: 'buyerUsername',
        header:'Username',
        
    },{
        accessorKey: 'buyerEmail',
        header:'Email',
        
    },
]