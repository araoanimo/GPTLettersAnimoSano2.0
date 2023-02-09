
require('dotenv').config();
let {Document} = require('docxyz');
const {readFile} = require('fs');
const fs = require('fs');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limit: { fileSize: 10 * 1024 * 1024 } });




let animoTemplate = 'Letter_Template_Animo_Sano.docx';
let chosenTemplate = 'Letter_Template_Choice.docx';
let copyFile = 'Letter_Template_Copy.docx';
let fileName = animoTemplate;
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





app.post('/postFile', upload.single('uploadedFile'), (req, res) => {
    // do something with the file, e.g. save it to a database or disk
    fs.writeFile(chosenTemplate, req.file.buffer, err => {
        if (err) {
          console.error(err);
          res.status(500).send('Error saving file to disk.');
          return;
        }
        fileName = chosenTemplate;
        res.send('File received and saved to disk.');
      });
  });


app.post('/', async (req, res) => {
  fs.writeFileSync('Letter_Template_Copy.docx', '', err => {
    if(err) throw err;
    console.log('file was cleared');
  });
    const { message } = req.body;
    
    let promptHere = `${message} `;
    console.log(promptHere);
    
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `${promptHere}`,
        max_tokens: 491,
        temperature: 0,
      });
    const ressy = (response && response.data && response.data.choices[0].text);
    
    let doc = new Document(fileName);
    doc.add_paragraph(ressy);
    doc.save(copyFile);

    fs.readFile(copyFile, (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

if (process.env.NODE_ENV === 'production'){
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>{
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 3001;
console.log(port);
console.log(process.env.NODE_ENV);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}/`);
    }
);
