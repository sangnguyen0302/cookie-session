const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

app.set('view engine', 'ejs');


const port = 302;

app.get('/user', (req, res) => {
    const sessionId = req.cookies?.sessionId;
    if (!sessionId) res.redirect('/login');
    else {
        const userId = sessions[sessionId]?.userId;
        const user = db.users.find(item => item.id = userId);
        if (!user) res.redirect('/login');
        else {
            res.render('home/userPage', { cookie: 'sang' });
        }
    }
});

app.get('/login', (req, res) => {
    res.render('home/login');
});

app.get('/logout', (req, res) => {
    res.setHeader('Set-Cookie', 'sessionId=; max-age=0').res.redirect('home/login');
});

// Fake db 
const db = {
    users: [{
        id: 1,
        email: 'abc@gmail.com',
        password: 'abc'
    }],
}

// Mất khi reset chương trình, nên lưu ra file hay (redis, memcache => vẫn ram => sync xuống ổ cứng), database, etc.
let sessions = {};

app.post('/login', (req, res) => {
    const data = req.body;
    const check = db.users.find(item => item.email == data.email && item.password == data.password);
    let result = check ? '<h1>Log in successfully</h1>' : '<h1>Wrong username or password</h1>'
    if (check) {
        const sessionId = `${Date.now()}${Math.floor(Math.random() * (1000) + 1).toString().padStart(4, '0')}`
        sessions[sessionId] = {
            userId: check.id
        }
        res.setHeader('Set-Cookie', `sessionId=${sessionId}; max-age=3600; httpOnly`).redirect('/user');
        return;
    }
    res.send(result);
});

app.get('/', (req, res) => {
    res.render('home/main')
});

app.listen(port, () => {
    console.log('App is running');
})