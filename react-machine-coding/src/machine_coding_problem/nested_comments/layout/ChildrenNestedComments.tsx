import React, { useState } from "react";

interface Comment {
  id: number;
  text: string;
  userId: string;
  author: string;
  replies: Comment[]
}

interface props {
  data: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  depth?: number
}

const CommentItem = React.memo(({ comment }: { comment: Comment }) => {
  console.log("Rendered:", comment.id);

  return (
    <div>
      <p>{comment.author}</p>
      <p>{comment.text}</p>
    </div>
  );
});

const ChildrenNestedComments = ({ data, setComments, depth=0 }: props ) => {
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null)
  const [inputText, setInputText] = useState<string>('')
  const [mode, setMode] = useState<"reply" | "update" | null>(null)

  const handleReply = (id: number): void => {
    console.log(id)
    setActiveCommentId(id)
    setMode("reply")
    setInputText("")
  }

  const handleCancel = (id: number): void => {
    console.log(id)
    setActiveCommentId(null)
    setInputText("")
    setMode(null)
  }

  const handleReplyText = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    e.preventDefault();
    setInputText(e.target.value)
  }

  const addReply = (comments: Comment[], parentId: number | null, newReply: Comment): Comment[] => {
    return comments.map((comment) => {
      if(comment.id === parentId){
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        }
      }
      return {...comment, replies: addReply(comment.replies, parentId, newReply)}
    })
  }

  const updateComment = (comments: Comment[], commentId: number | null, newText: string): Comment[] => {
    return comments.map((comment) => {
      if(comment.id === commentId){
        return { ...comment, text: newText}
      }
      return {
        ...comment,
        replies: updateComment(comment.replies, commentId, newText)
      }
    });
  }

  const handleSubmit = () => {
    if(!inputText || inputText.trim()==="") return;
    if(activeCommentId === null) return

    if(mode==="reply"){
      const newReply:Comment = {
        id: Date.now(),
        text: inputText,
        userId: "CurrentUser",
        author: "Nishant Modi",
        replies: []
      }
  
      setComments((prevComments) => addReply(prevComments, activeCommentId, newReply))
    }
    if(mode==="update"){
      setComments((prevComments) => updateComment(prevComments, activeCommentId, inputText))
    }

    setInputText("")
    setActiveCommentId(null)
    setMode(null)
  }

  const handleUpdate = (id: number, value:string): void => {
    setActiveCommentId(id)
    setMode("update")
    setInputText(value)
  }

  const deleteComment = (comments: Comment[], currentId: number | null): Comment[] => {
    return comments.filter((comment) => comment.id !== currentId)
    .map((comment) => ({ ...comment, replies: deleteComment(comment.replies, currentId)}))
  }

  const handleDelete = (id: number): void => {
    setComments((prevComments) => deleteComment(prevComments, id))
  }

  return (
    <div style={{display: 'flex', flexDirection:'column', gap:'20px'}}>
      {data.map((c: Comment) => {
        return (
            <div key={c.id} style={{
      paddingLeft: `${depth * 20}px`,
      marginTop:'10px',
      borderLeft: depth > 0
        ? `2px solid ${
            ["#64748b", "#0d9488", "#8b5cf6"][depth % 3]
          }`
        : "none",
    }}  >
              <div  style={{display:'flex', alignItems:'flex-start', gap:'10px'}}>
                <div style={{width:'30px', height:'30px', display:'flex', justifyContent:'center', alignItems: 'center', background:'#101010', border: '1px solid gray', borderRadius:'50%'}}>{c.author.charAt(0)}</div>
                {/* <div style={{textAlign: 'left'}}>
                  <p>{c.author}</p>
                  <p>{c.text}</p>
                </div> */}
                <CommentItem comment={c} />
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                <div style={{marginLeft: '50px', display:'flex',  gap:'10px'}}>
                  <button onClick={() => handleReply(c.id)} style={{ width: '50px', background:'transparent'}}>Reply</button>
                  <button onClick={() => handleUpdate(c.id, c.text)} style={{ width: '50px', background:'transparent'}}>Update</button>
                  <button onClick={() => handleDelete(c.id)} style={{ width: '50px', background:'transparent'}}>Delete</button>
                </ div>
                {activeCommentId === c.id && <div style={{display:'flex',  gap:'10px'}}>
                  <textarea value={inputText} onChange={(e) => handleReplyText(e)} style={{width: '200px', marginLeft: '50px',}}/>
                  <button onClick={handleSubmit} style={{ width: '50px', background:'transparent'}}>Submit</button>
                  <button onClick={() => handleCancel(c.id)} style={{ width: '50px', background:'transparent'}}>Cancel</button>
                </div>}
              </div>
              {/* <div style={{paddingLeft:'50px', borderLeft: '1px solid gray'}}>
                <ChildrenNestedComments data={c.replies} setComments={setComments} depth={depth+1} />
              </div> */}
              {c.replies.length > 0 && (
      <ChildrenNestedComments
        data={c.replies}
        setComments={setComments}
        depth={depth + 1}
      />
    )}
              {/* <div
                style={{
                  paddingLeft: `${depth * 20}px`,
                  borderLeft: `2px solid ${
                    ["#64748b", "#0d9488", "#8b5cf6"][depth % 3]
                  }`
                }}
              >
                <ChildrenNestedComments
                  data={c.replies}
                  setComments={setComments}
                  depth={depth + 1}
                />
              </div> */}
            </div>
          )
      })}
    </div>
  )
}

export default ChildrenNestedComments
