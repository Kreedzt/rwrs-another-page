import { useCallback, FC } from 'preact/compat';
import {
  ColumnDef,
  flexRender,
  Table as IReactTableInst,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  table: IReactTableInst<TData>;
  isLoading: boolean;
}

// 使用 memo 优化 TablePagination 组件避免不必要的重新渲染
const TablePagination: FC<{
  table: IReactTableInst<any>;
  isLoading: boolean;
}> = ({ table }: { table: IReactTableInst<any>; isLoading: boolean }) => {
  const pageIndex = table.getState().pagination.pageIndex;
  const totalPages = table.getPageCount();
  const SIBLING_COUNT = 1;
  const DOTS = 'dots';

  const generatePagination = useCallback(() => {
    // 避免页码太多时的不必要计算
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const leftSiblingIndex = Math.max(pageIndex - SIBLING_COUNT, 1);
    const rightSiblingIndex = Math.min(
      pageIndex + SIBLING_COUNT,
      totalPages - 2,
    );

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 3;

    if (!shouldShowLeftDots && !shouldShowRightDots) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from({ length: 3 }, (_, i) => i);
      return [...leftRange, DOTS, totalPages - 1];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from(
        { length: 3 },
        (_, i) => totalPages - 3 + i,
      );
      return [0, DOTS, ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [0, DOTS, ...middleRange, DOTS, totalPages - 1];
  }, [pageIndex, totalPages]);

  const onPageChange = useCallback(
    (index: number) => {
      table.setPageIndex(index);
    },
    [table],
  );

  // 如果没有多页，不显示分页组件
  if (totalPages <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          />
        </PaginationItem>

        {generatePagination().map((pageNum, index) =>
          pageNum === DOTS ? (
            <PaginationItem key={`pagination-dots-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={`pagination-${index}`}>
              <PaginationLink
                isActive={pageIndex === pageNum}
                onClick={() => onPageChange(+pageNum)}
              >
                {+pageNum + 1}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

// 将表格的行组件拆分出来，使用 memo 包装以避免不必要的重新渲染
const TableRowMemo = ({
  row,
  visibleCells,
}: {
  row: any;
  visibleCells: any[];
}) => (
  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
    {visibleCells.map((cell) => (
      <TableCell key={cell.id}>
        {flexRender(cell.column.columnDef.cell, cell.getContext())}
      </TableCell>
    ))}
  </TableRow>
);

// 优化整个 DataList 组件，使用 memo 包装
export const DataList: React.FC<DataTableProps<any, any>> = ({
  table,
  columns,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="hidden md:flex justify-center items-center h-32">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // 预先计算所需数据，避免在渲染中计算
  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const hasRows = rows.length > 0;

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {hasRows ? (
            rows.map((row) => {
              const visibleCells = row.getVisibleCells();
              return (
                <TableRowMemo
                  key={row.id}
                  row={row}
                  visibleCells={visibleCells}
                />
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <TablePagination table={table} isLoading={isLoading} />
      </div>
    </div>
  );
};
