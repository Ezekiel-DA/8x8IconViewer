import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'

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

  return (
    <div>
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
          <h1><div>{iconData.name}</div></h1>
          <div>iconID: {iconData.id}</div>
          <div>category: {iconData.category_name}</div>
          {/* <div>animated: {iconData.isAnimation ? 'yes' : 'no'}</div> */}
        </div>
      </div>
    </Box>
  )
}