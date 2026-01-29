"use client";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input text-sm py-2 px-4 cursor-pointer"
      >
        <option value="newest">Newest First</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="store">Store Name (A-Z)</option>
      </select>
    </div>
  );
}
