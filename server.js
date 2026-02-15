const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let licenses = {};

app.post("/create-license", (req, res) => {
    const { email, licenseKey } = req.body;

    licenses[licenseKey] = {
        email,
        expiry: Date.now() + 30 * 86400000,
        active: true
    };

    res.json({ success: true });
});

app.post("/verify-license", (req, res) => {
    const { licenseKey } = req.body;

    const license = licenses[licenseKey];

    if (!license) return res.json({ valid: false });

    if (!license.active || Date.now() > license.expiry) {
        return res.json({ valid: false });
    }

    res.json({
        valid: true,
        expiry: license.expiry
    });
});

app.post("/extend-license", (req, res) => {
    const { licenseKey } = req.body;

    if (!licenses[licenseKey]) {
        return res.json({ success: false });
    }

    licenses[licenseKey].expiry = Date.now() + 30 * 86400000;
    res.json({ success: true });
});

app.get("/", (req, res) => {
    res.send("Godspeed License Server Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});

