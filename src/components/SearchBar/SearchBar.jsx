import "./SearchBar.css";
import { useState } from "react";

function SearchBar({ onSearch, input }) {
    
    const [search, setSearch] = useState('');
  
    const handleChange = (e) => {
      const value = e.target.value;
      setSearch(value);
      onSearch(value);
    };
  
    return (
      <>
        <input
          id="search-bar-input"
          placeholder={input}
          type="search"
          value={search}
          onChange={handleChange}
        />
      </>
    );
  }

export default SearchBar;
