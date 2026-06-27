import type { UserLibraryBook } from "../types";

interface FilterAndSortBarProps {
  activeFilter: string;
  onClickFilter: (filter: string) => void;
  userLibraryBooks: UserLibraryBook[];
  sortBy: string;
  sortOrder: "asc" | "desc";
  onClickSortBy: (sortBy: string) => void;
  onClickSortOrder: (sortOrder: "asc" | "desc") => void;
  averageBookRating: string
}

function FilterAndSortBar({ activeFilter, onClickFilter, userLibraryBooks, sortBy, sortOrder,
                            onClickSortBy, onClickSortOrder, averageBookRating} : FilterAndSortBarProps) {

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 pb-4 border-b border-[#e8e2d9]/60 dark:border-[#2e2822]/60">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#a39b92] dark:text-[#85796d] mr-1">Filter:</span>
        {["All", "To Read", "Reading", "Finished"].map((filter) => (
          <button
            key={filter}
            onClick={() => onClickFilter(filter)}
            className={`px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer inline-flex items-center ${activeFilter === filter
              ? "bg-[#fef3c7] dark:bg-[#451a03] text-[#b45309] dark:text-[#f59e0b] border border-[#b45309]/30 dark:border-[#f59e0b]/30 shadow-sm"
              : "bg-[#ffffff] dark:bg-[#1a1816] text-[#786d63] dark:text-[#b0a59a] border border-[#e8e2d9] dark:border-[#2e2822] hover:bg-[#fcfaf7] dark:hover:bg-[#121110] hover:text-[#2b2520] dark:hover:text-[#f2ebe4]"
              }`}
          >
            <span>
              {filter} ({filter === "All"
                ? userLibraryBooks.length
                : userLibraryBooks.filter((book) => book.readingStatus === filter.toLowerCase().split(' ').join('-')).length
              })
            </span>
            {filter === "Finished" && userLibraryBooks.filter((book) => book.rating).length > 0 && (
              <span className={`ml-1.5 text-[10px] md:text-xs font-medium ${activeFilter === "Finished"
                ? "text-[#b45309]/75 dark:text-[#f59e0b]/75"
                : "text-[#786d63]/70 dark:text-[#b0a59a]/70"
                }`}>
                Avg <span className="text-[#d97706] dark:text-[#fbbf24]">★</span>{averageBookRating}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Sort Dropdown & Order Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#a39b92] dark:text-[#85796d] mr-1">Sort by:</span>
        <div className="relative inline-flex items-center bg-[#ffffff] dark:bg-[#1a1816] border border-[#e8e2d9] dark:border-[#2e2822] rounded-lg shadow-sm hover:border-[#b45309]/50 dark:hover:border-[#f59e0b]/50 transition-colors">
          <select
            value={sortBy}
            onChange={(e) => onClickSortBy(e.target.value)}
            className="appearance-none bg-transparent pr-8 pl-3 py-1.5 text-xs md:text-sm font-semibold text-[#786d63] dark:text-[#b0a59a] focus:outline-none cursor-pointer"
          >
            <option value="Title" className="bg-[#ffffff] dark:bg-[#1a1816]">Title</option>
            <option value="Author" className="bg-[#ffffff] dark:bg-[#1a1816]">Author</option>
            <option value="Date Added" className="bg-[#ffffff] dark:bg-[#1a1816]">Date Added</option>
          </select>
          <div className="pointer-events-none absolute right-2.5 flex items-center text-[#786d63] dark:text-[#b0a59a]">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <button
          onClick={() => onClickSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="p-1.5 rounded-lg bg-[#ffffff] dark:bg-[#1a1816] border border-[#e8e2d9] dark:border-[#2e2822] text-[#786d63] dark:text-[#b0a59a] hover:bg-[#fcfaf7] dark:hover:bg-[#121110] hover:text-[#2b2520] dark:hover:text-[#f2ebe4] cursor-pointer shadow-sm hover:border-[#b45309]/50 dark:hover:border-[#f59e0b]/50 transition-all flex items-center justify-center"
          title={sortOrder === "asc" ? "Sort Ascending" : "Sort Descending"}
        >
          {sortOrder === "asc" ? (
            <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

export default FilterAndSortBar;