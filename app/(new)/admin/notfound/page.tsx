'use client'
import { getNotFound } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { FC } from "react";
import { DataTable } from "../users/data-table";
import { columns } from "./columns";

const NotFoundPage : FC = () => {
    const {error, data, isLoading} = useQuery({
        queryKey: ['getNotFound'],
        queryFn: getNotFound
    })

    if (isLoading){
        return <div className='w-full h-full'><Loader className="animate-spin"/></div>
    }

    return <DataTable columns={columns} data={data || []} title="Not Found Items"  />
}

export default NotFoundPage;