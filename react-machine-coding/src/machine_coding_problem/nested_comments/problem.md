# Problem:
## Build a Reddit/Hacker-News style nested comment thread. Users can reply to any comment, edit their own comments, and delete comments (which cascades to all replies).

Data Structure:

typescript code
type Comment = {
  id: string;
  text: string;
  userId: string;
  author: string;
  replies: Comment[];
}

Seed Data: Start with a hardcoded tree of 2 root comments, each with 2-3 nested replies.

## Requirements:

  1. Recursive Rendering

  - Render the comment tree with indentation (left padding grows with depth)

  - Each depth level gets a different subtle left-border color (visual depth cue)

  2. Reply

  - Each comment has a "Reply" button

  - Clicking opens an inline textarea directly below that comment

  - On submit: the new reply nests under that specific parent (immutably)

  - "Cancel" button closes the textarea without adding

  3. Edit

  - Each comment has an "Edit" button (only for that user's comments — simulate with currentUserId = "user1")

  - Opens inline textarea pre-filled with current text

  - On save: updates only that comment's text, not the whole tree

  4. Delete

  - Each comment has a "Delete" button

  - Deleting a parent removes all nested children

  - Hard part: Do this immutably — do NOT mutate the original state object

  5. Performance Optimization (The Differentiator)

  - Wrap CommentItem in React.memo

  - When you edit a leaf comment, the parent comments should NOT re-render (verify with console.log in the component body)

  - When you add a reply deep in the tree, only the affected branch re-renders

  6. Show Reply Count

  - Each comment displays "X replies" (total descendants, not just direct children)

## Constraints:

  - No external libraries (no lodash, no immer)

  - Use useState + immutable update helpers

  - TypeScript strict mode

  - Plain CSS