import { useId, type KeyboardEvent } from "react";

import { Check, ChevronDown, Search } from "lucide-react";

import type { Customer } from "../../../../../customers/types/customer.types";

type Props = {
  searchTerm: string;

  isSearchOpen: boolean;

  filteredCustomers: Customer[];

  highlightedIndex: number;

  selectedCustomerId: number | null;

  selectedCustomer: Customer | null;

  onSearchChange: (value: string) => void;

  onSearchFocus: () => void;

  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;

  onSelectCustomer: (customerId: number) => void;

  onCloseSearch: () => void;
};

export function CustomerSearch({
  searchTerm,
  isSearchOpen,
  filteredCustomers,
  highlightedIndex,
  selectedCustomerId,
  selectedCustomer,
  onSearchChange,
  onSearchFocus,
  onSearchKeyDown,
  onSelectCustomer,
  onCloseSearch,
}: Props) {
  const searchId = useId();

  const listboxId = `${searchId}-listbox`;

  return (
    <div className="relative max-w-xl">
      <label
        htmlFor={searchId}
        className="
          mb-1.5
          block
          text-xs
          font-semibold
          text-slate-700
        "
      >
        Search Customer
      </label>

      <div className="relative">
        <Search
          size={16}
          className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          id={searchId}
          type="text"
          role="combobox"
          aria-expanded={isSearchOpen}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            highlightedIndex >= 0
              ? `${searchId}-option-${highlightedIndex}`
              : undefined
          }
          value={
            isSearchOpen
              ? searchTerm
              : selectedCustomer
                ? `${selectedCustomer.name}${
                    selectedCustomer.phone ? ` — ${selectedCustomer.phone}` : ""
                  }`
                : searchTerm
          }
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
          onFocus={onSearchFocus}
          onKeyDown={onSearchKeyDown}
          placeholder="Search by name or phone..."
          className="
            h-11
            w-full
            rounded-xl
            border
            border-slate-200
            bg-white
            pl-9
            pr-10
            text-sm
            outline-none
            transition
            focus:border-[#263c93]
            focus:ring-2
            focus:ring-[#263c93]/10
          "
        />

        <button
          type="button"
          aria-label={
            isSearchOpen ? "Close customer search" : "Open customer search"
          }
          onClick={() => {
            if (isSearchOpen) {
              onCloseSearch();
            } else {
              onSearchFocus();
            }
          }}
          className="
            absolute
            right-0
            top-0
            grid
            h-11
            w-10
            place-items-center
            text-slate-400
          "
        >
          <ChevronDown
            size={16}
            className={`
              transition
              ${isSearchOpen ? "rotate-180" : ""}
            `}
          />
        </button>
      </div>

      {isSearchOpen && (
        <div
          id={listboxId}
          role="listbox"
          className="
            absolute
            left-0
            right-0
            top-full
            z-50
            mt-2
            max-h-64
            overflow-y-auto
            rounded-xl
            border
            border-slate-200
            bg-white
            p-1
            shadow-xl
          "
        >
          {filteredCustomers.length === 0 ? (
            <div
              className="
                px-3
                py-4
                text-center
                text-xs
                text-slate-500
              "
            >
              No customers found.
            </div>
          ) : (
            filteredCustomers.map((customer, index) => {
              const isHighlighted = index === highlightedIndex;

              const isSelected = customer.id === selectedCustomerId;

              return (
                <button
                  key={customer.id}
                  id={`${searchId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() => {
                    onSelectCustomer(customer.id);
                  }}
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-lg
                    px-3
                    py-2.5
                    text-left
                    transition
                    ${isHighlighted ? "bg-[#f1f3ff]" : "hover:bg-slate-50"}
                  `}
                >
                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-slate-800
                      "
                    >
                      {customer.name}
                    </p>

                    <p
                      className="
                        mt-0.5
                        truncate
                        text-xs
                        text-slate-500
                      "
                    >
                      {customer.phone}

                      {customer.email ? ` • ${customer.email}` : ""}
                    </p>
                  </div>

                  {isSelected && (
                    <Check
                      size={16}
                      className="
                        shrink-0
                        text-[#263c93]
                      "
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
