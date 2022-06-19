import Head from 'next/head'
import React, { useState } from 'react'

import { Masonry } from 'masonic'
import { CircularProgress, Flex } from '@chakra-ui/react'
import { InfoOutlineIcon } from '@chakra-ui/icons'

import { iconviewerURL, sendToIconViewerDevice } from '../config'
import { useIconSearch, useCategories } from '../src/useSearch'
import IconViewer from '../components/IconViewer'
import Search from '../components/Search'
import { TemperatureDropdown, CorrectionDropdown, BrightnessSlider, ClearLEDPanelButton } from '../components/ESPMatrixConfigurator'

function IconSearchResults({ searchResults, isLoading, isError }) {
  if (isError)
    return <Error />
  else if (isLoading)
    return <Loading />
  else if (!searchResults)
    return <></>

  return (
    <Masonry
      className='icons'
      items={searchResults}
      columnGutter={12}
      columnWidth={40 * 8}
      overscanBy={2}
      render={(e) => <IconViewer iconData={e.data} />}
    />
  )
}

const Loading = () => {
  return <CircularProgress isIndeterminate id='state-loading' />
}

const Error = () => {
  return <InfoOutlineIcon id='state-error' />
}

export default function Home() {
  const [searchQuery, setsearchQuery] = useState({ value: '', param: 'name' })
  const [colorTemp, setColorTemp] = useState(0)
  const [colorCorrection, setColorCorrection] = useState(0)
  const [brightness, setBrightness] = useState(25)

  const { icons, isLoading, isError } = useIconSearch(searchQuery)
  const { categories, isCategoriesLoading, isCategoriesError } = useCategories()

  const handleClearSearch = () => {
    setsearchQuery({ value: '', param: 'name' })
    if (sendToIconViewerDevice) {
      fetch(new URL('/icon', iconviewerURL), { method: 'DELETE' })
    }
  }

  const handleNameSearch = (search) => {
    setsearchQuery({ value: search, param: 'name' })
  }

  const handleCategorySelection = (selection) => {
    if (searchQuery.value !== selection) {
      setsearchQuery({ value: selection, param: 'category' })
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
                isLoading={isLoading}>
                <Flex minWidth='80%' alignItems='center' gap={2}>
                  <ClearLEDPanelButton />
                  <TemperatureDropdown colorTemp={colorTemp} setColorTemp={setColorTemp} />
                  <CorrectionDropdown colorCorrection={colorCorrection} setColorCorrection={setColorCorrection} />
                  <BrightnessSlider brightness={brightness} setBrightness={setBrightness} />
                </Flex>
              </Search>
              <IconSearchResults
                searchResults={icons}
                isLoading={isLoading}
                isError={isError} />
            </>
      }
    </div>
  )
}
