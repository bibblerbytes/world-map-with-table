import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { CountryData } from '../types';

interface DataTableProps {
  data: CountryData[];
  onDataChange: (newData: CountryData[]) => void;
}

const DataTable: React.FC<DataTableProps> = ({ data, onDataChange }) => {
  const [editingRow, setEditingRow] = useState<number | null>(null);

  const columns: ColumnDef<CountryData>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      ),
    },
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'stateProvince',
      header: 'State/Province',
      cell: ({ row }) => (
        editingRow === row.index ? (
          <input
            value={row.original.stateProvince}
            onChange={(e) => handleEdit(row.index, 'stateProvince', e.target.value)}
            className="w-full p-1 border rounded"
          />
        ) : (
          row.original.stateProvince
        )
      ),
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => (
        editingRow === row.index ? (
          <input
            value={row.original.country}
            onChange={(e) => handleEdit(row.index, 'country', e.target.value)}
            className="w-full p-1 border rounded"
          />
        ) : (
          row.original.country
        )
      ),
    },
    {
      accessorKey: 'totalUsers',
      header: 'Total Users',
      cell: ({ row }) => (
        editingRow === row.index ? (
          <input
            type="number"
            value={row.original.totalUsers}
            onChange={(e) => handleEdit(row.index, 'totalUsers', parseInt(e.target.value))}
            className="w-full p-1 border rounded"
          />
        ) : (
          row.original.totalUsers.toLocaleString()
        )
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          {editingRow === row.index ? (
            <>
              <button onClick={() => handleSave(row.index)} className="text-green-600 hover:text-green-800">
                <Check size={18} />
              </button>
              <button onClick={() => setEditingRow(null)} className="text-red-600 hover:text-red-800">
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditingRow(row.index)} className="text-blue-600 hover:text-blue-800">
                <Edit size={18} />
              </button>
              <button onClick={() => handleDelete(row.index)} className="text-red-600 hover:text-red-800">
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEdit = (rowIndex: number, field: keyof CountryData, value: any) => {
    const newData = [...data];
    newData[rowIndex] = { ...newData[rowIndex], [field]: value };
    onDataChange(newData);
  };

  const handleSave = (rowIndex: number) => {
    setEditingRow(null);
  };

  const handleDelete = (rowIndex: number) => {
    const newData = data.filter((_, index) => index !== rowIndex);
    onDataChange(newData);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        const newData: CountryData[] = lines.slice(1).map((line, index) => {
          const values = line.split(',');
          return {
            id: index + 1,
            stateProvince: values[headers.indexOf('State/Province')],
            country: values[headers.indexOf('Country')],
            totalUsers: parseInt(values[headers.indexOf('Total Users')]),
          };
        });
        onDataChange(newData);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="mb-4">
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleImport}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between items-center">
        <div>
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out disabled:opacity-50"
          >
            {'<<'}
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="ml-2 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out disabled:opacity-50"
          >
            {'<'}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="ml-2 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out disabled:opacity-50"
          >
            {'>'}
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="ml-2 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue active:bg-blue-600 transition duration-150 ease-in-out disabled:opacity-50"
          >
            {'>>'}
          </button>
        </div>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
      </div>
    </div>
  );
};

export default DataTable;