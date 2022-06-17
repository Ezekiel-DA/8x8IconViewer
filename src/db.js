import { readFile, readdir } from 'fs/promises'
import path from 'path'
import Loki from 'lokijs'
import lfsa from 'lokijs/src/loki-fs-structured-adapter'

const adapter = new lfsa()

const db = new Loki('icons.db', { adapter })

let iconsDB

function* chunkFileList(ls, chunkSize = 5000) {
  for (let idx = 0; idx < ls.length; idx += chunkSize) {
    yield ls.slice(idx, idx + chunkSize)
  }
}

async function createDBFromFiles() {
  const basename = path.join('..', 'LED_matrix_icons', 'data')
  const icons = db.addCollection('icons')

  const chunkedFilelist = [...chunkFileList(await readdir(basename))]
  for (const chunk of chunkedFilelist) {
    for (const filename of chunk) {
      const fileContents = await readFile(path.join(basename, filename))
      icons.insert(JSON.parse(fileContents))
    }
  }
}

export async function getIconsDB() {
  if (!iconsDB) {
    await Promise.resolve().then(() => {
      return new Promise((resolve, reject) => {
        console.log('Loading DB from disk')
        db.loadDatabase({}, async err => {
          if (err) {
            reject(err);
          } else {
            if (!db.getCollection('icons')) {
              console.log('DB empty; processing raw icon files...')
              await createDBFromFiles()
              
              db.saveDatabase(err => {
                if (err) {
                  reject(err)
                } else {
                  console.log('Saved DB to disk')
                  resolve(db)
                }
              })
              
            } else {
              console.log('DB loaded from disk successfully')
              resolve(db)
            }
          }
        })
      })
    })

    iconsDB = db.getCollection('icons')
  }

  return iconsDB
}
