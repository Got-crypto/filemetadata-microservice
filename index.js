var express = require('express');
var cors = require('cors');
const multer = require('multer')
const bodyParser = require('body-parser')
require('dotenv').config()

var app = express();
const { diskStorage } = multer

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({extended:!1}))

const fileStorage = diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}` )
  }
})

const fileUpload = multer({
  storage: fileStorage,
  limits: {
    fieldSize: 1000000 * 50
  },
})

app.use('/api/fileanalyse', fileUpload.any())

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



app.post('/api/fileanalyse', (req, res) => {
  const { originalname: name, mimetype: type, size } = req.files?.[0]

  return res.json({name, type, size})
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
