const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const crypto = require('crypto')


const corsOptions = {
    origin: 'http://localhost:3000'
};

const baseUrl = 'https://api.betaseries.com/';
const APIKey = 'a41e82cd8fbe';

app.use(cors(corsOptions))
app.use(express.json())

function hashPassword(password) {
    const hash = crypto.createHash('md5');

    hash.update(password);

    return hash.digest('hex');
}

app.post('/auth', async (req, res) => {
    const data = {
        login: req.body.login,
        password: hashPassword(req.body.password)
    };
    const options = {
        method: 'POST',
        headers: {
            "X-BetaSeries-Key": APIKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    try {
        const response = await fetch(baseUrl + "members/auth", options).then(res => res.json());
        if (response.errors.length !== 0) {
            return res.status(403).json({ error: response.errors });
        } else {
            return res.status(202).json(response);
        }
    } catch (err) {
        return res.status(403).json({
            message: "une erreur est survenue"
        });
    }
});

app.get('/home', async (req, res) => {
    const options = {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.query.token
        }
    }
    try {
        const reponse = await fetch(baseUrl + "shows/list?order=popularity", options).then(res => res.json()).then(data => data.shows).catch(err => console.log(err));
        return res.status(200).json(reponse)
    } catch (err) {
        return res.status(405).send(err);
    }
})

app.get('/serie/:id', async (req, res) => {
    const options = {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.query.token
        }
    }
    try {
        const reponse = await fetch(baseUrl + "shows/display?id=" + req.params.id, options).then(res => res.json()).then(data => data).catch(err => console.log(err));
        return res.status(200).json(reponse)
    } catch (err) {
        return res.status(401).send(err);
    }
})

app.post('/searchbar', async (req, res) => {
    const options = {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.body.token
        }
    }
    try {
        const reponse = await fetch(baseUrl + "shows/search?title=" + req.body.search, options).then(res => res.json()).then(data => data).catch(err => console.log(err));
        return res.status(200).json(reponse)
    } catch (err) {
        return res.status(401).send(err);
    }

})

app.post('/archive', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.body.token
        },
        body: {
            id: req.body.id
        }
    }
    try {
        const reponse = await fetch(baseUrl + "shows/archive?id=" + req.body.id, options).then(res => res.json()).then(data => data)
        return res.status(200).json(reponse);
    } catch (error) {
        return res.status(400).json(error)
    }
})


app.get('/profile', async (req, res) => {
    const options = {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.query.token
        }
    }
    try {
        const reponse = await fetch(baseUrl + "shows/member", options).then(res => res.json()).then(data => data.shows).catch(err => console.log(err));
        return res.status(200).json(reponse)
    } catch (err) {
        return res.status(405).send(err);
    }
})

app.post('/episode/seen', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.body.token
        }
    }
    try {
        const reponse = await fetch(baseUrl + "episodes/watched?id=" + req.body.id + "&bulk=" + req.body.bulk, options).then(res => res.json()).then(data => data).catch(err => console.log(err));
        const picResponse = await fetch('https://api.betaseries.com/pictures/episodes?id=' + req.body.id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-BetaSeries-Key": APIKey,
            }
        }).then(res => res).then(data => data.url);
        reponse.episode.image = picResponse;
        return res.status(200).json(reponse)
    } catch (err) {
        return res.status(405).send(err);
    }
})


app.post('/comments/:id', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.body.token
        },
        body: JSON.stringify({
            text: req.body.text
        })
    }
    try {
        const reponse = await fetch(baseUrl + "comments/comment?id=" + req.body.id + "&type=" + req.body.type, options).then(res => res.json()).then(data => data).catch(err => console.log(err));
        return res.status(200).json(reponse)
    } catch (err) {
        return res.status(405).send(err);
    }
})

app.post('/episode/unSeen', async (req, res) => {
    const options = {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.body.token
        }
    }
    try {
        const reponse = await fetch(baseUrl + "episodes/watched?id=" + req.body.id, options).then(res => res.json()).then(data => data).catch(err => console.log(err));
        const picResponse = await fetch('https://api.betaseries.com/pictures/episodes?id=' + req.body.id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-BetaSeries-Key": APIKey,
            }
        }).then(res => res).then(data => data.url);
        reponse.episode.image = picResponse;
        return res.status(200).json(reponse)
    } catch (err) {
        return res.status(405).send(err);
    }
})

app.post('/newShow', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.body.token
        },
        body: {
            id: req.body.id
        }
    }
    try {
        const reponse = await fetch(baseUrl + "shows/show?id=" + req.body.id, options).then(res => res.json()).then(data => data)
        return res.status(200).json(reponse);
    } catch (error) {
        return res.status(400).json(error)
    }
})

app.delete('/archive', async (req, res) => {
    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.body.token
        },
        body: {
            id: req.body.id
        }
    }
    try {
        const reponse = await fetch(baseUrl + "shows/archive?id=" + req.body.id, options).then(res => res.json()).then(data => data)
        return res.status(200).json(reponse);
    } catch (error) {
        return res.status(400).json(error)
    }
})

const fetchPictures = async (array) => {
    let results = await Promise.all(array.map(async (element) => {
        const picResponse = await fetch('https://api.betaseries.com/pictures/episodes?id=' + element.id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-BetaSeries-Key": APIKey,
            }
        }).then(res => res).then(data => data);
        return picResponse.url;
    }));
    return results;
}

app.get("/episode/:id", async (req, res) => {
    const options = {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.query.token
        }
    }
    try {
        let reponse = await fetch(baseUrl + "episodes/display?id=" + req.params.id, options).then(res => res.json()).then(data => data);
        const picResponse = await fetch('https://api.betaseries.com/pictures/episodes?id=' + req.params.id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "X-BetaSeries-Key": APIKey,
            }
        }).then(res => res).then(data => data.url);
        reponse.episode.image = picResponse;
        return res.status(200).json(reponse)
    } catch (err) {
        return res.status(200).json(err)
    }
})

app.get("/comments/:id", async (req, res) => {
    const options = {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.query.token
        }
    }
    try {
        let reponse = await fetch(baseUrl + "comments/comments?type=episode&id=" + req.params.id, options).then(res => res.json()).then(data => data.comments);
        return res.status(200).json(reponse)
    } catch (err) {
        return res.status(200).json(err)
    }
})

app.get('/saison/:id', async (req, res) => {
    const options = {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "X-BetaSeries-Key": APIKey,
            Authorization: "Bearer " + req.query.token
        }
    }
    try {
        let reponse = await fetch(baseUrl + "shows/episodes?id=" + req.query.id + "&season=" + req.params.id + "&token=" + req.query.token, options).then(res => res.json()).then(data => data.episodes).catch(err => console.log(err));
        let pictures = await fetchPictures(reponse);
        reponse.forEach((element, key) => {
            reponse[key].image = pictures[key];
        });
        return res.status(200).json(reponse)
    } catch (err) {
        return res.status(405).send(err);
    }
})

app.listen(port, () => {
    console.log(`Our server is listening at http://localhost:${port}`);
});

