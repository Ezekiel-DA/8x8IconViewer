import React, { useEffect } from "react";

import {
  Text,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Button,
  Icon,
  Flex,
} from "@chakra-ui/react";

import { TbBrightnessDown } from "react-icons/tb";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { IoColorFilterOutline } from "react-icons/io5";

import { iconviewerURL, sendToIconViewerDevice } from "../config";

function iconViewerPutter(endpoint, val) {
  if (sendToIconViewerDevice) {
    fetch(new URL(endpoint, iconviewerURL), {
      method: "PUT",
      headers: { "Content-Type": "text/plain" },
      body: val,
    });
  }
}

function DropdownBuilder({ options, handler, selected, setState }) {
  async function handleSelection(evt) {
    const val = evt.target.options[evt.target.selectedIndex].value;
    setState(evt.target.selectedIndex);
    handler(val);
  }

  return (
    <Select onChange={handleSelection}>
      {options.map((t, idx) => (
        <option value={idx} key={idx} selected={idx === selected}>
          {t}
        </option>
      ))}
    </Select>
  );
}

export function PopupItem({ children, icon }) {
  return (
    <Flex gap={2} align="center" justify="center">
      <Icon as={icon} />
      {children}
    </Flex>
  );
}

export function TemperatureDropdown({ colorTemp, setColorTemp }) {
  const temperatureOptions = [
    "UncorrectedTemperature",
    "Candle",
    "Tungsten40W",
    "Tungsten100W",
    "Halogen",
    "CarbonArc",
    "HighNoonSun",
    "DirectSunlight",
    "OvercastSky",
    "ClearBlueSky",
    "WarmFluorescent",
    "StandardFluorescent",
    "CoolWhiteFluorescent",
    "FullSpectrumFluorescent",
    "GrowLightFluorescent",
    "BlackLightFluorescent",
    "MercuryVapor",
    "SodiumVapor",
    "MetalHalide",
    "HighPressureSodium",
  ];

  return (
    <PopupItem icon={HiOutlineColorSwatch}>
      <DropdownBuilder
        options={temperatureOptions}
        selected={colorTemp}
        handler={val => iconViewerPutter("/temperature", val)}
        setState={setColorTemp}
      />
    </PopupItem>
  );
}

export function CorrectionDropdown({ colorCorrection, setColorCorrection }) {
  const correctionOptions = [
    "UncorrectedColor",
    "TypicalSMD5050",
    "TypicalLEDStrip",
    "Typical8mmPixel",
    "TypicalPixelString",
  ];

  return (
    <PopupItem icon={IoColorFilterOutline}>
      <DropdownBuilder
        options={correctionOptions}
        selected={colorCorrection}
        handler={val => iconViewerPutter("/correction", val)}
        setState={setColorCorrection}
      />
    </PopupItem>
  );
}

export function BrightnessSlider({ brightness, setBrightness }) {
  useEffect(() => {
    iconViewerPutter("/brightness", brightness);
  }, [brightness]);

  return (
    <PopupItem icon={TbBrightnessDown}>
      <Slider value={brightness} min={1} max={255} onChange={setBrightness}>
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
    </PopupItem>
  );
}

export function ClearLEDPanelButton() {
  return (
    <Button
      onClick={() => {
        fetch(new URL("/icon", iconviewerURL), { method: "DELETE" });
      }}
    >
      Clear panel
    </Button>
  );
}
