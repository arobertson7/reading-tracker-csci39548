

function SearchBar() {

  return (

    <form action="#" method="POST" id="search-bar">
      <p>
        <label htmlFor="search-books">Search Books</label><br />
        <input type="search" name="search-books" id="search-books-input" placeholder="the stranger by albert camus..." />
      </p>
      <button type="button">Search</button>
    </form>

  )
}

export default SearchBar;