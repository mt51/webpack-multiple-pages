const path = require('path')
const fs = require('fs')
const baseDir = path.resolve(__dirname, '../src/views')

const excludeDir = []
const viewArr = fs.readdirSync(baseDir).filter(dir => {
  return excludeDir.indexOf(dir) === -1 && fs.statSync(baseDir + '/' + dir).isDirectory()
})

let entriesConfig = []

viewArr.forEach(generateEntryConfig)

function generateEntryConfig (dir) {
  const enrtyFile = 'index.js'
  const filename = dir + '/index.html'
  entriesConfig.push({
    entryName: dir,
    entry: path.resolve(baseDir, dir, enrtyFile),
    filename: filename,
    template: path.resolve(__dirname, '../index.html')
  })
  const dirPath = path.resolve(baseDir, dir)
  const files = fs.readdirSync(dirPath);
}
module.exports = entriesConfig
