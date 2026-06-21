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

    <form action="#" method="POST" id="search-bar" onSubmit={handleSearch}>
      <p>
        <label htmlFor="search-books-input">Search Books</label><br />
        <input type="search" name="search-books" id="search-books-input" onChange={(e) => setSearchText(e.target.value)} placeholder="The Stranger by Albert Camus..." />
      </p>
      <button type="submit">Search</button>
    </form>

  )
}

export default SearchBar;