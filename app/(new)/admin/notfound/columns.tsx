import { NotFound } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<NotFound>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'folder.folder_name',
      header: 'Folder',
    },
    {
        accessorKey: 'account.email',
        header: 'Account'
    }
]