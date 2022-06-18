import Head from 'next/head'
import React, { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import AwesomeDebouncePromise from 'awesome-debounce-promise'
import { HStack, VStack, Flex, Spacer, Input, Heading, SimpleGrid, Button, ButtonGroup, Select, Text } from '@chakra-ui/react'
import { Slider, SliderTrack, SliderFilledTrack, SliderThumb, SliderMark, } from '@chakra-ui/react'
import IconViewer from '../components/IconViewer'
import { iconviewerURL } from '../config'

const iconSearcher = url => axios.post(url).then(res => res.data)
const debouncedIconSearcher = AwesomeDebouncePromise(iconSearcher, 1000)

function useIconSearch(name) {
  const { data, error } = useSWR(name ? `/api/search?name=${name}` : null, debouncedIconSearcher)

  return {
    iconSearchResults: data,
    isLoading: name && !error && !data,
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
      {searchResults?.map(iconData => <IconViewer key={iconData.id} iconData={iconData} />)}
    </SimpleGrid>
  )
}

function DropdownBuilder({ options, handler, selected, setState }) {
  async function handleSelection(evt) {
    const val = evt.target.options[evt.target.selectedIndex].value
    setState(evt.target.selectedIndex)
    handler(val)
  }

  return (
    <Select onChange={handleSelection}>
      {options.map((t, idx) => (
        <option value={idx} key={idx} selected={idx === selected}>{t}</option>
      ))}
    </Select>
  )
}

function TemperatureDropdown({ colorTemp, setColorTemp }) {
  const temperatureOptions = [
    'UncorrectedTemperature',
    'Candle', 'Tungsten40W', 'Tungsten100W', 'Halogen', 'CarbonArc', 'HighNoonSun', 'DirectSunlight', 'OvercastSky', 'ClearBlueSky',
    'WarmFluorescent', 'StandardFluorescent', 'CoolWhiteFluorescent', 'FullSpectrumFluorescent', 'GrowLightFluorescent', 'BlackLightFluorescent', 'MercuryVapor', 'SodiumVapor', 'MetalHalide', 'HighPressureSodium'
  ]

  return (
    <DropdownBuilder options={temperatureOptions} selected={colorTemp} handler={val => iconViewerPutter('/temperature', val)} setState={setColorTemp} />
  )
}

function CorrectionDropdown({ colorCorrection, setColorCorrection }) {
  const correctionOptions = [
    'UncorrectedColor',
    'TypicalSMD5050', 'TypicalLEDStrip', 'Typical8mmPixel', 'TypicalPixelString'
  ]

  return (
    <DropdownBuilder options={correctionOptions} selected={colorCorrection} handler={val => iconViewerPutter('/correction', val)} setState={setColorCorrection} />
  )
}

function BrightnessSlider({ brightness, setBrightness }) {
  useEffect(() => {
    iconViewerPutter('/brightness', brightness)
  }, [brightness])

  return (
    <>
      <Text>Brightness:</Text>
      <Slider value={brightness} min={1} max={255} onChange={setBrightness}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </>
  )
}

export default function Home() {
  const [searchQuery, setsearchQuery] = useState('')
  const [colorTemp, setColorTemp] = useState(0)
  const [colorCorrection, setColorCorrection] = useState(0)
  const [brightness, setBrightness] = useState(25)

  const { iconSearchResults, isLoading, isError } = useIconSearch(searchQuery)

  return (
    <div className="container">
      <Head>
        <title>8x8 Icon Viewer</title>
      </Head>

      <VStack>
        <Flex mt={2} minWidth='80%' alignItems='center' gap={2}>
          <Heading size='md'>Search:</Heading>
          <Input value={searchQuery} onChange={(evt) => setsearchQuery(evt.target.value)} />
          <ButtonGroup gap='2'>
            <Button onClick={() => {
              fetch(new URL('/icon', iconviewerURL), { method: 'DELETE' })
            }}>Clear panel</Button>
          </ButtonGroup>
          <Spacer />
          <TemperatureDropdown colorTemp={colorTemp} setColorTemp={setColorTemp} />
          <CorrectionDropdown colorCorrection={colorCorrection} setColorCorrection={setColorCorrection}/>
          <BrightnessSlider brightness={brightness} setBrightness={setBrightness}/>
        </Flex>

        <IconSearchResults searchResults={iconSearchResults} isLoading={isLoading} isError={isError} />
      </VStack>
    </div>

  )
}
