// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Store user verification data
const userVerifications = new Map();

// Serve the landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Track initial visit
app.post('/track', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
    }

    userVerifications.set(userId, {
        visitTime: Date.now(),
        verified: true  // Set to true since we're auto-redirecting after 1 second
    });

    res.json({ success: true, message: 'Visit tracked successfully' });
});

// Verify user status
app.post('/verify', (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const verification = userVerifications.get(userId);
    if (verification && verification.verified) {
        return res.json({ success: true, message: 'Verification successful' });
    }

    res.json({ success: false, message: 'Verification failed or not found' });
});

// Clear old verifications periodically (optional)
setInterval(() => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [userId, data] of userVerifications.entries()) {
        if (data.visitTime < oneHourAgo) {
            userVerifications.delete(userId);
        }
    }
}, 60 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
