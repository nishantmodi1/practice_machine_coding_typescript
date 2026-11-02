### Problem:
## Implement myPromiseAll that behaves exactly like Promise.all.

## Signature:

  - typescript

function myPromiseAll<T>(promises: Array<T | Promise<T>>): Promise<T[]>

## Requirements:

1. Accept mixed inputs

  - Can contain plain values (42, "hello") — treat as already-resolved promises

  - Can contain Promises

  - Can contain thenables (objects with a .then method)

2. Preserve order

  - Result array must match input order

  - Even if the 3rd promise resolves before the 1st, results must be [result1, result2, result3]

3. Reject fast

  - If any promise rejects, myPromiseAll rejects immediately with that error

  - Don't wait for others to complete

4. Empty array edge case

  - myPromiseAll([]) resolves with [] synchronously (per native spec)

5. Non-array input

  - Throw a TypeError if input is not an array (match native behavior)

6. Already-resolved Promise (the twist)

  - What if a promise is already resolved before being passed in? Handle it correctly.

## Constraints:

❌ Do NOT use async/await in the loop — use .then() chaining

❌ Do NOT use the native Promise.all internally

✅ Use Promise.resolve().then() to handle thenables uniformly

✅ TypeScript with proper generics

Why this is a FAANG favorite:
It tests whether you actually understand the event loop, microtasks, and Promise internals — not just how to use them.