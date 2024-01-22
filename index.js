const express = require('express');
const app = express();
const auth = require('./routes/auth');
const post = require('./routes/post');

app.use(express.json());
app.use('/auth', auth);
app.use('/posts', post);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(5000, ()=>{
    console.log('Server is running on port 5000!');
})