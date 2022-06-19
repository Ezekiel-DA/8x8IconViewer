import Head from 'next/head'
import React, { useState } from 'react'

import useSWRImmutable from 'swr/immutable'
import axios from 'axios'
import AwesomeDebouncePromise from 'awesome-debounce-promise'

import { Masonry } from "masonic";
import {Input, InputGroup, InputLeftElement, IconButton, CircularProgress, Select   } from '@chakra-ui/react'
import { SmallCloseIcon, InfoOutlineIcon, SearchIcon } from '@chakra-ui/icons'
import IconViewer from '../components/IconViewer'

import { MdOutlineCategory } from 'react-icons/md';

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
  else if (!searchResults)
    return <></>

  return (
    <Masonry
      items={searchResults}
      columnGutter={12}
      columnWidth={40 * 8}
      overscanBy={2}
      render={(e) => <IconViewer iconData={e.data} />}
      />
  )
}

const Loading = () => {
  return <CircularProgress isIndeterminate  id='state-loading' />
}

const Error = () => {
  return <InfoOutlineIcon id='state-error'/>
}

const Categories = ({values, onSelect, isLoading}) => {
  let options = [<option key={''} value={''}/>, ...values.map(category => <option key={category} value={category}>{category}</option>)]
  return (
    <div className='categories'>
      <Select 
        icon = {<MdOutlineCategory color='gray.600'/>}
        iconColor = { 'gray.600'}
        variant='filled'
        onChange={e => onSelect(e.target.value)}
        disabled={isLoading}>
        { options }
      </Select>
    </div>
  )
}

const Search = ({categories, isLoading, searchQuery, onClearSearch, onNameSearch, onCategorySelection }) => {
  return (
  <div className='header'>
    <Categories
      values={categories} 
      onSelect={onCategorySelection}
      isLoading={isLoading}
      />
    <div className='search'>
      <InputGroup>
        <InputLeftElement
          pointerEvents='none'
          children={<SearchIcon color='gray.600' />}
        />
        <Input
          variant="filled"
          isDisabled={isLoading}
          className = "searchField"
          value={searchQuery.param === 'name'? searchQuery.value : ''}
          onChange={evt => onNameSearch(evt.target.value)} 
        />
          <IconButton
            isDisabled={isLoading}
            className = "clear-searchField"
            variant='unstyled'
            onClick={onClearSearch}
            icon={<SmallCloseIcon color='gray.300'/>}
          />
        </InputGroup>
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
      setsearchQuery({value: selection, param: 'category'})
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
