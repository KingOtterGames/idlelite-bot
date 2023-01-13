const fs = require("fs")
const path = require("path")

const getAllFiles = async (dirPath, arrayOfFiles) => {
    files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []
  
    files.forEach(async (file) => {
      if (fs.statSync(dirPath + "/" + file).isDirectory()) {
        arrayOfFiles = await getAllFiles(dirPath + "/" + file, arrayOfFiles)
      } else {
        //arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
        arrayOfFiles.push(path.join(dirPath, "/", file))
      }
    })
  
    return arrayOfFiles 
}

module.exports = getAllFiles