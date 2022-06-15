import Head from 'next/head'
import React, { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { HStack, VStack, Input, Heading, SimpleGrid, Button } from '@chakra-ui/react'
import IconViewer from '../components/IconViewer'

const iconSearcher = url => axios.post(url).then(res => res.data)
const debouncedIconSearcher = AwesomeDebouncePromise( iconSearcher, 1000)

function useIconSearch(name) {
  const { data, error } = useSWR(`/api/search?name=${name}`, debouncedIconSearcher)

  return {
    iconSearchResults: data,
    isLoading: !error && !data,
    isError: error
  }
}

function IconSearchResults({ searchResults, isLoading, isError }) {
  if (isLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }
  return (
    <SimpleGrid columns={{sm: 1, md: 4}} spacing={5}>
      {searchResults.map(iconData => <IconViewer key={iconData.id} iconData={iconData} />)}
    </SimpleGrid>
  )
}

export default function Home() {
  const [searchQuery, setsearchQuery] = useState('')

  const { iconSearchResults, isLoading, isError } = useIconSearch(searchQuery)

  return (
    <div className="container">
      <Head>
        <title>8x8 Icon Viewer</title>
      </Head>

      <VStack>
        <HStack m={2}>
          <Heading size='md'>Search:</Heading>
          <Input value={searchQuery} onChange={(evt) => setsearchQuery(evt.target.value)} />
          <Button pl={8} pr={8} onClick={() => {
            fetch('http://iconviewer.local/icon', { method: 'DELETE' })
          }}>Clear panel</Button>
        </HStack>

        <IconSearchResults searchResults={iconSearchResults} isLoading={isLoading} isError={isError} />
      </VStack>
    </div>

  )
}
