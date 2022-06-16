import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { HStack, VStack, Input, Heading, SimpleGrid, Button, Select } from '@chakra-ui/react'
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, } from '@chakra-ui/react'
import IconViewer from '../components/IconViewer'
import { iconviewerURL } from '../config'

const iconSearcher = url => axios.post(url).then(res => res.data)
const debouncedIconSearcher = AwesomeDebouncePromise(iconSearcher, 1000)

function useIconSearch(name) {
  const { data, error } = useSWR(`/api/search?name=${name}`, debouncedIconSearcher)

  return {
    iconSearchResults: data,
    isLoading: !error && !data,
    isError: error
  }
}

function iconViewerPutter(endpoint, val) {
  fetch(new URL(endpoint, iconviewerURL), { method: 'PUT', headers: { 'Content-Type': 'text/plain' }, body: val })
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
    <SimpleGrid columns={{ sm: 1, md: 4 }} spacing={5}>
      {searchResults.map(iconData => <IconViewer key={iconData.id} iconData={iconData} />)}
    </SimpleGrid>
  )
}

function DropdownBuilder({ options, handler }) {
  async function handleSelection(evt) {
    const val = evt.target.options[evt.target.selectedIndex].value
    handler(val)
  }

  return (
    <Select onChange={handleSelection}>
      {options.map((t, idx) => (
        <option value={idx} key={idx}>{t}</option>
      ))}
    </Select>
  )
}

function TemperatureDropdown() {
  const temperatureOptions = [
    'UncorrectedTemperature',
    'Candle', 'Tungsten40W', 'Tungsten100W', 'Halogen', 'CarbonArc', 'HighNoonSun', 'DirectSunlight', 'OvercastSky', 'ClearBlueSky',
    'WarmFluorescent', 'StandardFluorescent', 'CoolWhiteFluorescent', 'FullSpectrumFluorescent', 'GrowLightFluorescent', 'BlackLightFluorescent', 'MercuryVapor', 'SodiumVapor', 'MetalHalide', 'HighPressureSodium'
  ]

  return (
    <DropdownBuilder options={temperatureOptions} handler={val => iconViewerPutter('/temperature', val)} />
  )
}

function CorrectionDropdown() {
  const correctionOptions = [
    'UncorrectedColor',
    'TypicalSMD5050', 'TypicalLEDStrip', 'Typical8mmPixel', 'TypicalPixelString'
  ]

  return (
    <DropdownBuilder options={correctionOptions} handler={val => iconViewerPutter('/correction', val)} />
  )
}

function BrightnessSlider() {
  const [value, setValue] = useState(255)

  useEffect(() => {
    iconViewerPutter('/brightness', value)
  })

  return (
    <Slider value={value} min={1} max={255} onChange={val => setValue(val)}>
  <SliderTrack>
    <SliderFilledTrack />
  </SliderTrack>
  <SliderThumb />
</Slider>
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
            fetch(new URL('/icon', iconviewerURL), { method: 'DELETE' })
          }}>Clear panel</Button>
          <TemperatureDropdown />
          <CorrectionDropdown />
          <BrightnessSlider />
        </HStack>

        <IconSearchResults searchResults={iconSearchResults} isLoading={isLoading} isError={isError} />
      </VStack>
    </div>

  )
}
