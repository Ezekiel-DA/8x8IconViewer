import path from 'path'

export const sendToIconViewerDevice = false
export const iconviewerURL = 'http://iconviewer.local/'

export const iconsFilePath = path.join('..', 'LED_matrix_icons', 'data')

// set this to a Number to limit getIcons results, or undefined for no limit
export const resultsLimiter = 20
