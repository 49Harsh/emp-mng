'use client';

import { useState, useEffect } from 'react';

interface SearchBarProps {
  value?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
  debounceMs?: number;
}

export function SearchBar({ value = '', placeholder = 'Search...', onSearch, debounceMs = 400 }: SearchBarProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(local);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [local, debounceMs, onSearch]);

  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="input pl-9 pr-4"
        aria-label={placeholder}
      />
    </div>
  );
}
