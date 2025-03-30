import React from "react";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

interface SearchBarProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  onSubmit: (event: React.FormEvent) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  onSubmit,
  placeholder = "Search...",
}) => {
  return (
    <form onSubmit={onSubmit}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        name="search"
        value={value}
        onChange={onChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton onClick={onClear} edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : null,
        }}
      />
    </form>
  );
};

export default SearchBar;
