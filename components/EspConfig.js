import React, { useRef, useState } from "react";
import {
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverBody,
  Portal,
  Flex,
  Icon,
} from "@chakra-ui/react";

import { IoColorPaletteOutline } from "react-icons/io5";

import {
  TemperatureDropdown,
  CorrectionDropdown,
  BrightnessSlider,
  ClearLEDPanelButton,
} from "../components/ESPMatrixConfigurator";

export const EspConfig = () => {
  const ref = useRef(null);

  const [colorTemp, setColorTemp] = useState(0);
  const [colorCorrection, setColorCorrection] = useState(0);
  const [brightness, setBrightness] = useState(25);

  return (
    <Popover closeOnBlur={false} placement="bottom" initialFocusRef={ref}>
      <>
        <PopoverTrigger>
          <IconButton icon={<Icon as={IoColorPaletteOutline} />} />
        </PopoverTrigger>
        <Portal>
          <PopoverContent>
            <PopoverCloseButton />
            <PopoverBody>
              <Flex gap={2} direction="column" style={{ marginTop: "24px" }}>
                <TemperatureDropdown
                  colorTemp={colorTemp}
                  setColorTemp={setColorTemp}
                />
                <CorrectionDropdown
                  colorCorrection={colorCorrection}
                  setColorCorrection={setColorCorrection}
                />
                <BrightnessSlider
                  brightness={brightness}
                  setBrightness={setBrightness}
                />
                <ClearLEDPanelButton />
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </>
    </Popover>
  );
};
