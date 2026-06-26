import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [searchText, setSearchText] = useState<string>("");

  function handleSearch(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (searchText.trim() === "") { // empty query
      return;
    }
    const cleaned_query_str = encodeURIComponent(searchText.trim());
    onSearch(cleaned_query_str); // fetch search results via parent callback
  }

  return (
    <form
      action="#"
      method="POST"
      id="search-bar"
      className="bg-[#ffffff] dark:bg-[#1a1816] border border-[#e8e2d9] dark:border-[#2e2822] rounded-xl p-5 shadow-[0_2px_6px_rgba(43,37,32,0.04)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.2)] flex flex-col gap-4"
      onSubmit={handleSearch}
    >
      <p className="w-full">
        <label
          htmlFor="search-books-input"
          className="text-[0.85rem] font-semibold text-[#786d63] dark:text-[#b0a59a] uppercase tracking-[0.05em]"
        >
          Search Books
        </label>
        <br />
        <input
          type="search"
          name="search-books"
          id="search-books-input"
          className="w-full py-3 px-4 rounded-lg border border-[#e8e2d9] dark:border-[#2e2822] bg-[#fcfaf7] dark:bg-[#121110] text-[#2b2520] dark:text-[#f2ebe4] font-inherit text-[0.95rem] outline-none transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:border-[#b45309] dark:focus:border-[#f59e0b] focus:ring-[3px] focus:ring-[#fef3c7] dark:focus:ring-[#451a03]"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="The Stranger by Albert Camus..."
        />
      </p>
      <button
        type="submit"
        className="py-3 px-6 bg-[#b45309] dark:bg-[#f59e0b] text-white border-none rounded-lg font-semibold font-inherit cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] self-start hover:bg-[#92400e] dark:hover:bg-[#d97706] hover:-translate-y-px"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;