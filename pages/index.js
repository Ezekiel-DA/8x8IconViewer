import Head from 'next/head'
import React, { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import {Input, SimpleGrid, Button } from '@chakra-ui/react'
import IconViewer from '../components/IconViewer'
import ReactLoading from 'react-loading'
import Select from 'react-select'
import List from 'react-virtualized/dist/commonjs/List';
import useSWRImmutable from 'swr/immutable'

import { MdOutlineClear, MdErrorOutline } from 'react-icons/md';

const iconSearcher = url => axios.post(url).then(res => res.data)
const categoriesSearcher = url => axios.get(url).then(res => res.data.split(','))
const debouncedIconSearcher = AwesomeDebouncePromise( iconSearcher, 1000)

function useIconSearch(query) {
    const { data, error } = useSWRImmutable(query && query.value ? `/api/search?${query.param}=${query.value}` : undefined, debouncedIconSearcher)
    return {
      icons: data,
      isLoading: !error && !data && query.value,
      isError: error
    }
}

function useCategories() {
  const { data, error } = useSWRImmutable(`/api/categories`, categoriesSearcher)
  return {
    categories: data,
    isCategoriesLoading: !error && !data,
    isCategoriesError: error
  }
}

function IconSearchResults({ searchResults, isLoading, isError }) {
  
  if (isError)
    return <Error />
  else if (isLoading)
    return <Loading />

  // return (
  // <List
  //   width={600}
  //   height={600}
  //   rowHeight={20}
  //   rowCount={searchResults.length}
  //   rowRenderer={({ key, index, style }) => {
  //     return (
  //       <IconViewer key={key} iconData={searchResults[index]} />
  //     );
  //   }} />
  // )
  return (
    <SimpleGrid columns={{sm: 1, md: 4}} spacing={5}>
      {searchResults?.map(iconData => <IconViewer key={iconData.id} iconData={iconData} />)}
    </SimpleGrid>
  )
}

const Loading = () => {
  return <ReactLoading type={"spinningBubbles"} color={"#EDF2F7"} height={80} width={80} />
}

const Error = () => {
  return<MdErrorOutline id='error'/>
}

const Categories = ({values, onSelect, isLoading}) => {
  console.log('category')
  return <Select 
    className='categories'
    isDisabled={isLoading}
    options={values.map(v => { return { value: v, label: v }})}
    onChange={onSelect}
    // onInputChange={onSelect}
    />
}

const Search = ({categories, isLoading, searchQuery, onClearSearch, onNameSearch, onCategorySelection }) => {
  return (
  <div className='header'>
    <Categories
      values={categories} 
      onSelect={(e) => onCategorySelection(e.value)}
      isLoading={isLoading}
      />
    <div className='search'>
      <Input
        isDisabled={isLoading}
        className = "searchField"
        value={searchQuery.param === 'name'? searchQuery.value : ''}
        onChange={evt => onNameSearch(evt.target.value)} />
      <Button 
        className = "clearSearch"
        isDisabled={isLoading}
        onClick={onClearSearch}>
          <MdOutlineClear/>
      </Button>
    </div>
  </div>
  )
}

export default function Home() {
  const [searchQuery, setsearchQuery] = useState({value: '', param:  'name'})

  const { icons, isLoading, isError } = useIconSearch(searchQuery)
  const { categories, isCategoriesLoading, isCategoriesError } = useCategories()

  const handleClearSearch = () => {
    setsearchQuery({value: '', param: 'name'})
    fetch('http://iconviewer.local/icon', { method: 'DELETE' })
  }

  const handleNameSearch = (search) => {
    setsearchQuery({value: search, param:  'name'}) 
  }

  const handleCategorySelection = (selection) => { 
    if(searchQuery.value !== selection) {
      setsearchQuery({value: selection, param:  'category'})
    }
  }

  return (
    <div className="container">
      <Head>
        <title>8x8 Icon Viewer</title>
      </Head>
      {
        isCategoriesLoading
          ? <Loading />
          : isCategoriesError 
          ? <Error />
          : <>
            <Search
              searchQuery={searchQuery}
              categories={categories} 
              onClearSearch={handleClearSearch} 
              onNameSearch={handleNameSearch} 
              onCategorySelection={handleCategorySelection}
              isLoading={isLoading}/>
            <IconSearchResults 
              searchResults={icons} 
              isLoading={isLoading} 
              isError={isError} />
         </>
      }
    </div>
  )
}
