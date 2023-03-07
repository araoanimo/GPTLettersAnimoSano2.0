
require('dotenv').config();
let {Document} = require('docxyz');
const {readFile} = require('fs');
const fs = require('fs');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limit: { fileSize: 10 * 1024 * 1024 } });
const authMiddleware = require("./auth-middleware");



let animoTemplate = 'Letter_Template_Animo_Sano.docx';
let copyFile = 'Letter_Template_Copy.docx';
fs.writeFileSync('Letter_Template_Copy.docx', '', err => {
  if(err) throw err;
  console.log('file was cleared');
});



const { OpenAIApi, Configuration } = require("openai");
const configuration = new Configuration({
    organization: process.env.ORG,
    apiKey: process.env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);



const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use("/", authMiddleware);






app.post('/postFile', upload.single('uploadedFile'), (req, res) => {
    // do something with the file, e.g. save it to a database or disk
    const fileNameTemp = req.file.originalname;
    console.log(fileNameTemp);
    fs.writeFile(fileNameTemp, req.file.buffer, err => {
        if (err) {
          console.error(err);
          res.status(500).send('Error saving file to disk.');
          return;
        }
        console.log(fileNameTemp);
        res.send('File received and saved to disk.');
        console.log('file was saved as next template');
      });
  });


app.post('/', async (req, res) => {
  
  console.log(req.body);
    const { message } = req.body;
    const { fileNameUploaded } = req.body;
    let promptHere = `${message} `;
    console.log(promptHere);
    console.log(fileNameUploaded);
    const fileName = fileNameUploaded || animoTemplate;
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${promptHere}`,
        max_tokens: 491,
        temperature: 0.5,
      });
    const ressy = (response && response.data && response.data.choices[0].text);
    
    console.log('fileName: ' + fileName);
    try{
      let doc = new Document(fileName);
      doc.add_paragraph(ressy);
      doc.save(copyFile);
    }
    catch(err){
      console.log('file was not found');
    }
    
    
    
    fs.readFile(copyFile, (err, data) => {
        if (err) throw err;
        console.log(data);
        res.send(data);
    });

      if(fileNameUploaded){
        fs.unlink(fileNameUploaded, err => {
          if(err) console.log(err);
          console.log('file was deleted');
        })
      }
});

if (process.env.NODE_ENV === 'production'){
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>{
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/`);
    }
);
