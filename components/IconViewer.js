import React, { useState } from 'react'
import { Box, Tag, Tooltip } from '@chakra-ui/react'

import { iconviewerURL, sendToIconViewerDevice } from '../config'

function Pixel({ color }) {
  return (
    <div className="pixel" style={{ backgroundColor: color }}>
    </div>
  )
}
function Icon({ iconData }) {
  const [frame, setFrame] = useState(0)

  function renderPixel(idx, colorData) {
    const color = colorData.slice(0, 3).map(x => x * 255)
    return <Pixel key={idx} color={`rgb(${color.join(' ')})`} />
  }

  if (iconData.delays.length > 0) {
    setTimeout(() => {
      setFrame(frame === (iconData.delays.length - 1) ? 0 : frame + 1)
    }, iconData.delays[frame])
  }

  async function iconClicked() {
    if (!sendToIconViewerDevice) {
      return
    }

    if (iconData.icons.length > 1 && iconData.icons.length !== iconData.delays.length) {
      throw new Error("Icon data is invalid: frame data and frame delay arrays are of different length. Cannot send to device.")
    }

    let bufferIdx = 0
    let rawIcon = new Uint8Array(1 + 8 * 8 * 3 * iconData.icons.length + 4 * iconData.icons.length)
    rawIcon[bufferIdx++] = iconData.icons.length
    let iconIdx = 0
    for (const icon of iconData.icons) {
      const delayAs32Bit = new Uint32Array(1)
      delayAs32Bit[0] = iconData?.delays[iconIdx++] || 0
      const delayAs8BitArray = new Uint8Array(delayAs32Bit.buffer)
      rawIcon.set(delayAs8BitArray, bufferIdx)
      bufferIdx += 4

      for (const row of icon) {
        for (const pixel of row) {
          for (const subPixel of pixel.slice(0, 3)) {
            rawIcon[bufferIdx++] = subPixel * 255
          }
        }
      }
    }

    fetch(new URL('/icon', iconviewerURL), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream'
      },
      body: rawIcon
    })
  }

  return (
    <div onClick={iconClicked}>
      {[...Array(8).keys()].map(row => {
        return (
          <div key={row} className="pixel-row">
            {[...Array(8).keys()].map(col => renderPixel(row * 4 + col, iconData.icons[frame][row][col]))}
          </div>
        )
      })}
    </div>
  )
}

export default function IconViewer({ iconData }) {
  return (
    <Box>
      <div className="icon-viewer">
        <div className="icon">
          <Icon iconData={iconData.body} />
        </div>
        <div className="icon-info">
          <div><span className='icon-name'><Tooltip label={iconData.id}>{iconData.name}</Tooltip></span></div>
          <Tag colorScheme='blue'>{iconData.category_name}</Tag>
        </div>
      </div>
    </Box>
  )
}