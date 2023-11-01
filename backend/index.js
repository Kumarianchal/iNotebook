const connectToMongodb=require('./db');
const express = require('express');
var cors = require('cors')
connectToMongodb();

const app = express();
const port = 5000
app.use(cors());


// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
//instead of placing routes directly over herewe place thgem in a separate folder

//to be able to use req.body we need a middleware
app.use(express.json());

//Available routes
app.use('/api/auth',require('./routes/auth'));           //from auth.js for the path /api/auth/ we have a particular route
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`inotebook app listening on port ${port}`)
})
