const multer = require("multer");
const path = require("path");
const { v4} = require("uuid");

const uploadPath = path.join(process.cwd(),"statics","uploads");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + v4()
    cb(null, file.fieldname + '-' + uniqueSuffix +path.extname(file.originalname)  )
  }
})

const upload = multer({ storage: storage })

module.exports = upload