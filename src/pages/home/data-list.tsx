'use client';
import { useCallback, memo } from 'preact/compat';
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

const TablePagination = memo(
  ({
    table,
    pageIndex,
    isLoading,
  }: {
    table: IReactTableInst<any>;
    pageIndex: number;
    isLoading: boolean;
  }) => {
    const totalPages = table.getPageCount();
    const SIBLING_COUNT = 1;
    const DOTS = 'dots';

    const generatePagination = useCallback(() => {
      const pages = [];
      const leftSiblingIndex = Math.max(pageIndex - SIBLING_COUNT, 0);
      const rightSiblingIndex = Math.min(
        pageIndex + SIBLING_COUNT,
        totalPages - 1,
      );

      const shouldShowLeftDots = leftSiblingIndex > 1;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

      if (!shouldShowLeftDots && !shouldShowRightDots) {
        return Array.from({ length: totalPages }, (_, i) => i);
      }

      if (!shouldShowLeftDots && shouldShowRightDots) {
        const leftItemCount = 3 + 2 * SIBLING_COUNT;
        return [...Array(leftItemCount).keys(), DOTS, totalPages - 1];
      }

      if (shouldShowLeftDots && !shouldShowRightDots) {
        const rightItemCount = 3 + 2 * SIBLING_COUNT;
        return [
          0,
          DOTS,
          ...Array(rightItemCount)
            .fill(0)
            .map((_, idx) => totalPages - rightItemCount + idx),
        ];
      }

      return [
        0,
        DOTS,
        ...Array(rightSiblingIndex - leftSiblingIndex + 1)
          .fill(0)
          .map((_, idx) => leftSiblingIndex + idx),
        DOTS,
        totalPages - 1,
      ];
    }, [pageIndex, totalPages]);

    const onPageChange = useCallback(
      (index: number) => {
        table.setPageIndex(index);
      },
      [table],
    );

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            />
          </PaginationItem>

          {generatePagination().map((pageNum, i) =>
            pageNum === DOTS ? (
              <PaginationItem key={`dots-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={pageNum}>
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
  },
);

export function DataList<TData, TValue>({
  table,
  columns,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const pageIndex = table.getState().pagination.pageIndex;
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
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
        <TablePagination
          table={table}
          pageIndex={pageIndex}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
