import React, { useState } from 'react';
import "./styles/SearchBar.css";

const SearchBar = ({ onSearch, isLoading, hasSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <label className="search-label" htmlFor="recipe-search">Search recipes</label>
      <input
        id="recipe-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search recipes..."
        autoComplete="off"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </button>
      {hasSearch && (
        <button className="search-clear" type="button" onClick={handleClear}>
          Clear
        </button>
      )}
    </form>
  );
};

export default SearchBar;