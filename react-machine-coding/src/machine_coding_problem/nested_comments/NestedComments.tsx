import React, { useState } from 'react'
import ChildrenNestedComments from './layout/ChildrenNestedComments';

// type Comment = {
//   id: string;
//   text: string;
//   userId: string;
//   author: string;
//   replies: Comment[];
// }

interface Comment {
  id: number;
  text: string;
  userId: string;
  author: string;
  replies: Comment[]
}


export const commentData = [
  {
    id: 1,
    text: "This is the first comment",
    userId: "user01",
    author: "Nishant",
    replies: [
      {
        id: 11,
        text: "This is a reply to the first comment",
        userId: "user02",
        author: "Rahul",
        replies: [
          {
            id: 111,
            text: "This is a nested reply",
            userId: "user03",
            author: "Amit",
            replies: []
          }
        ]
      },
      {
        id: 12,
        text: "Another reply here",
        userId: "user04",
        author: "Madhu",
        replies: []
      }
    ]
  },
  {
    id: 2,
    text: "This is the second comment",
    userId: "user05",
    author: "Ankit",
    replies: [
      {
        id: 21,
        text: "Reply to second comment",
        userId: "user06",
        author: "Neha",
        replies: []
      }
    ]
  },
  {
    id: 3,
    text: "This is the third comment",
    userId: "user07",
    author: "Vikas",
    replies: []
  },
  {
    id: 4,
    text: "This is the fourth comment",
    userId: "user08",
    author: "Sneha",
    replies: [
      {
        id: 41,
        text: "First reply",
        userId: "user09",
        author: "Rohit",
        replies: [
          {
            id: 411,
            text: "Nested reply again",
            userId: "user10",
            author: "Karan",
            replies: []
          }
        ]
      }
    ]
  }
];

const NestedComments = () => {
  const [comments, setComments] = useState<Comment[]>(commentData)

  return (
   <ChildrenNestedComments data={comments} setComments={setComments} />
  )
}

export default NestedComments

