import { IconSearch } from "./NavIcons";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: SearchInputProps) {
  return (
    <div className={className}>
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <div className="search-field">
        <IconSearch className="search-field__icon" />
        <input
          id="search-input"
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="search-field__input"
        />
      </div>
    </div>
  );
}
