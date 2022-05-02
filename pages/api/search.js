import { readFile, readdir } from 'fs/promises'
import path from 'path'
import loki from 'lokijs'

const basename = path.join('..', 'LED_matrix_icons', 'data')

const db = new loki('icons.db')
const icons = db.addCollection('icons')

function* chunkFileList (ls, chunkSize=5000) {
    for (let idx = 0; idx < ls.length; idx += chunkSize) {
        yield ls.slice(idx, idx + chunkSize)
    }
}

async function initDB () {
    const chunkedFilelist = [...chunkFileList(await readdir(basename))]
    for (const chunk of chunkedFilelist) {
        for (const filename of chunk) {
            const fileContents = await readFile(path.join(basename, filename))
            icons.insert(JSON.parse(fileContents))
        }
    }
}

const dBReadiness = initDB()


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name } = req.query

    if (name.length < 3) {
        return res.status(200).json([])
    }
    
    await dBReadiness
    
    const foundIcons = icons.find({name: {'$regex': new RegExp(name, 'i')}})
    return res.status(200).json(foundIcons)
  } else {
    return res.status(405).json({ error: 'method not supported, please use POST' })
  }
}
