'use client'

import { useState, useEffect } from 'react'
import { FlickrItem } from '@/types/flickr'
import { TextInput, Badge, Tooltip, CustomFlowbiteTheme } from 'flowbite-react'
import { getImgList } from '@/utils/flickrApi'
import Loading from './Loading'
import { useDebounce } from '@/app/hooks/useDebounce'

export default function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FlickrItem[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearch = useDebounce(async () => {
    setIsLoading(true)
    const response = await getImgList(query.split(' '))
    setResults(response.items)
    setIsLoading(false)
  })

  useEffect(() => {
    if (query.length > 2) {
      debouncedSearch()
    }
  }, [query])

  return (
    <div className="flex flex-col items-center w-full">
      <TextInput
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Flickr..."
        className="mb-4 text-gray-800 dark:text-gray-200 w-full max-w-lg"
      />
      {isLoading && <Loading />}
      {!isLoading && results?.length === 0 && (
        <p className="text-gray-800 dark:text-gray-200">No results found</p>
      )}
      {!isLoading && results && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((item) => (
            <Card key={item.link} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function Card({ item }: { item: FlickrItem }) {
  const customTooltip: CustomFlowbiteTheme["tooltip"] = {
    target: "w-full"
  };

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
      <a href={item.link} target="_blank" rel="noopener noreferrer">
        <img src={item.media.m} alt={item.title} className="w-full h-auto rounded-t-lg" />
      </a>
      <div className="py-4 px-3">
        <Tooltip theme={customTooltip} content={item.title} placement="top">
          <h2 className="w-full text-lg font-bold truncate text-gray-800 dark:text-gray-200">{item.title}</h2>
        </Tooltip>
        <Tooltip theme={customTooltip} content={item.author} placement="bottom">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">By: {item.author}</p>
        </Tooltip>
        <p className="text-sm text-gray-600 dark:text-gray-400">Date Taken: {new Date(item.date_taken).toLocaleDateString()}</p>
        <Tags tags={item.tags.split(' ')} />
      </div>
    </div>
  )
}

function Tags({ tags }: { tags: string[] }) {
  const [showAll, setShowAll] = useState(false)
  const displayedTags = showAll ? tags : tags.slice(0, 10)

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {displayedTags.map((tag) => (
        <Badge key={tag} color="info" className="rounded-full px-2 py-1 text-xs">
          {tag}
        </Badge>
      ))}
      {tags.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-xs text-blue-500 dark:text-blue-300 underline"
        >
          {showAll ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  )
}