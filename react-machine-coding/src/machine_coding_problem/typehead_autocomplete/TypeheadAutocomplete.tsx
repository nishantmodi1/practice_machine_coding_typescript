import React, { useEffect, useRef, useState } from 'react'
import './Style.css'

interface Detail {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const TypeheadAutocomplete = () => {
  const [query, setQuery] = useState<string>("")
  const [details, setDetails] = useState<Detail[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isError, setisError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [isOpen, setisOpen] = useState<boolean>(false)
  const cache = useRef<Map<string, Detail[]>>(new Map())
  
  const handleFetchSearch = async(controller: AbortController):Promise<void> => {
    const searchQuery = query.trim()

    // check cache first
    const cachedData = cache.current.get(searchQuery)

    if(cachedData) {
      setDetails(cachedData)
      setSelectedIndex(-1)
      setisOpen(true)
      setIsLoading(false)
      return
    }

    setDetails([])
    setSelectedIndex(-1)
    setisError(null)
    setisOpen(true)
    setIsLoading(true)

    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts?q=${encodeURIComponent(searchQuery)}`, {
        signal: controller.signal
      })
  
      if(!res.ok){
        throw new Error(`HTTP error: ${res.status}`)
      }
      const data: Detail[] = await res.json()

      // save result in cache
      cache.current.set(searchQuery, data)

      setDetails(data); 
      setSelectedIndex(-1); 
      setisOpen(true)
    } catch (error) {
      if(error instanceof DOMException && error.name === "AbortError"){
        return
      }
      setisError(error instanceof Error ? error.message : 'Something went wrong')
    } finally{
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === "Escape"){
      e.preventDefault();
      console.log('fdsa', e.key)
      setisOpen(false)
      setSelectedIndex(-1)
    }
    
    if(details.length === 0) return

    if(e.key === "ArrowDown"){
      e.preventDefault()
      console.log('fdsa', e.key)
      setSelectedIndex((prev) => {
        if(prev < details.length - 1){
          return prev + 1
        }
        return prev
      })

    }
    if(e.key === "ArrowUp"){
      e.preventDefault()
      console.log('fdsa', e.key)
      setSelectedIndex((prev) => {
        if(prev > 0){
          return prev - 1
        }
        return prev
      })
    }
    if(e.key === "Enter"){
      e.preventDefault()
      console.log('fdsa', e.key, details[selectedIndex])
      if(selectedIndex >= 0){
        setQuery(details[selectedIndex].title)
      }
    }
    
  }

  const highlightText = (
  text: string,
  search: string
): React.ReactNode => {
  if (!search.trim()) return text;

  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const parts = text.split(new RegExp(`(${escapedSearch})`, "gi"));

  return parts.map((part, index) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <strong key={index} style={{ color: "yellow" }}>
        {part}
      </strong>
    ) : (
      part
    )
  );
};

  useEffect(() => {
    if(query.trim() === ""){
      setDetails([])
      setSelectedIndex(-1)
      setisError(null)
      setisOpen(false)
      setIsLoading(false)
      return
    }

    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController()

    timer = setTimeout(() => {
      handleFetchSearch(controller)
    }, 300)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [query])

  return (
    <div style={{position:'relative'}}>
      <input 
        value={query}
        onChange={(e) => {setQuery(e.target.value); setSelectedIndex(-1)}}
        onKeyDown={handleKeyDown}
        style={{display:'flex', justifyContent:'center', flexDirection:'column', width: '400px', height:'30px', position:'fixed', margin: '0px auto', marginLeft: '23.5%'}}
      />
      {isOpen && <div style={{ margin:'0px auto', width: '400px', maxHeight:'80vh', ...((!isLoading && details.length<=0) && {border: '1px solid white'}), marginTop: '5%', overflow:'auto', }} >
      {isLoading ? (
        <h2 style={{color: 'white', textAlign:'center'}}>query searching...</h2>
      ) : (
        details.length>0 ? details.map((user: Detail, index: number) => (
          <ul key={user.id} style={{border: '1px solid white', background:index===selectedIndex?'black':'#282323', }}>
            {/* <div>{user.id}</div> */}
            <li>{highlightText(user.title, query)}</li>
          </ul>
        )) : isError ? (
          <p style={{ color: 'red' }}>Error: {isError}</p>
        ) : (
          <div>No Result found</ div>
        )
      )}
      </div>}
    </div>
  )
}

export default TypeheadAutocomplete
