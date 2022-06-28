import { readFile } from 'fs/promises'

import { iconsFilePath } from '../../../config'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query
    let iconData
    try {
      iconData = await readFile(path.join(iconsFilePath, `${id}.json`))
      res.status(200).json(iconData)
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.status(404).json({error: 'no such icon'})
      } else {
        console.log(err)
        throw(err)
      }
    }
  } else {
    res.status(405).json({ error: 'method not supported, please use GET' })
  }
}
