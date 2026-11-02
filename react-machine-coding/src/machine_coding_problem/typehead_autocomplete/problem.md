## Problem:

  - Build a search bar that queries https://jsonplaceholder.typicode.com/posts?q={query} and shows a dropdown of titles.

## Requirements:

  - Debounce API call by 300ms

  - Cancel previous pending request (AbortController) — if user types "App" then "Apple", the "App" request must abort

  - Cache results in a Map<string, Post[]> — repeat queries hit cache, no new fetch

  - Highlight matching text (bold the matched substring)

  - Keyboard nav: ArrowUp/ArrowDown to move, Enter to select, Escape to close

  - Show loading state, empty state, error state

## Constraints:

  - No external libraries (no lodash, no react-query)

  - Plain CSS

  - TypeScript strict mode