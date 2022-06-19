import { getIconsDB, getIcons } from '../../src/db'

export default async function handler(req, res) {
  const icons = await getIconsDB()
  
  if (req.method === 'POST') {
    const { name, category } = req.query
    let iconRefs
    if(name) {
      if(name.length < 3)
        return res.status(200).json([])
      iconRefs = icons.find({ name: { '$regex': new RegExp(name, 'i') } })
    } else if (category) {
      iconRefs = icons.find({ category_name: category })
    } else {
      return res.status(400).json([])
    }
    const foundIcons = await getIcons(iconRefs)
    return  res.status(200).json(foundIcons)
  } else {
    return res.status(405).json({ error: 'method not supported, please use POST' })
  }
}
