"use client";

import * as React from "react";
import { cn } from "../../../lib/utils";

/* -------------------------------------------------------------------------- */
/*                                Table Wrapper                               */
/* -------------------------------------------------------------------------- */

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto rounded-md border border-gray-200">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

/* -------------------------------------------------------------------------- */
/*                                Table Header                                */
/* -------------------------------------------------------------------------- */

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      "bg-gray-50 text-gray-700 border-b text-xs uppercase font-medium tracking-wide",
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = "TableHeader";

/* -------------------------------------------------------------------------- */
/*                                 Table Body                                 */
/* -------------------------------------------------------------------------- */

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("divide-y divide-gray-200 bg-white", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

/* -------------------------------------------------------------------------- */
/*                                 Table Row                                  */
/* -------------------------------------------------------------------------- */

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "hover:bg-gray-50 transition-colors data-[state=selected]:bg-gray-100",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

/* -------------------------------------------------------------------------- */
/*                                 Table Head                                 */
/* -------------------------------------------------------------------------- */

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn("px-4 py-3 text-left font-semibold text-gray-700", className)}
    {...props}
  />
));
TableHead.displayName = "TableHead";

/* -------------------------------------------------------------------------- */
/*                                 Table Cell                                 */
/* -------------------------------------------------------------------------- */

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-4 py-3 align-middle text-gray-800", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/* -------------------------------------------------------------------------- */
/*                                 Export All                                 */
/* -------------------------------------------------------------------------- */

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
