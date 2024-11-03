const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const port = 3001;
const EP_TEST_KEY = "EZTK1bced630fc3a411a8f1b7755fcad561fzfwvUhkU4NOtLdOAgS9hDQ";
const Easypost = require('@easypost/api');
const api = new Easypost(EP_TEST_KEY);

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'POST',
};

app.use(cors(corsOptions))
app.use(express.json())
app.post('/rate', async (req, res) => {
    try {
        let shipment;
        shipment = await api.Shipment.create({
            to_address: {
                name: req.body.name,
                street1: req.body.adress,
                city: req.body.city,
                zip: req.body.zipcode,
                country: req.body.country,
                email: req.body.email,
                phone: req.body.phone
            },
            from_address: {
                street1: '417 montgomery street',
                street2: 'FL 5',
                city: 'San Francisco',
                state: 'CA',
                zip: '94104',
                country: 'US',
                company: 'Planet Express',
                phone: '415-123-4567',
            },
            parcel: {
                weight: req.body.poids
            }
        });
        return res.status(200).json(shipment);
    } catch (error) {
        res.status(403).json({ error: JSON.stringify(error) });
    }
});

app.listen(port, () => {
    console.log(`Our server is listening at http://localhost:${port}`);
});