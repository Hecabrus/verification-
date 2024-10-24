const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const userVerifications = new Map();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/track', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
    }

    userVerifications.set(userId, {
        visitTime: Date.now(),
        verified: true
    });

    res.json({ success: true });
});

app.post('/verify', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false });
    }

    const verification = userVerifications.get(userId);
    if (verification && verification.verified) {
        return res.json({ success: true });
    }

    res.json({ success: false });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
