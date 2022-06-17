import { getIconsDB } from '../../src/db'

export default async function handler(req, res) {
  const icons = await getIconsDB()
  
  if (req.method === 'POST') {
    const { name } = req.query

    if (name.length < 3) {
      return res.status(200).json([])
    }

    const foundIcons = icons.find({ name: { '$regex': new RegExp(name, 'i') } })
    return res.status(200).json(foundIcons)
  } else {
    return res.status(405).json({ error: 'method not supported, please use POST' })
  }
}
