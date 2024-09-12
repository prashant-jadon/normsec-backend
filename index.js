const axios = require('axios');
const express = require('express');
const app = express();

app.use(express.json()); 

const wordlistFile = 'subdomains.txt'; 

// In-memory storage for subdomains
let subdomainResults = {};

async function checkSubdomain(subdomain, domain) {
    const protocols = ['http', 'https'];
    for (const protocol of protocols) {
        const url = `${protocol}://${subdomain}.${domain}`;
        
        try {
            const response = await axios.get(url, {
                timeout: 5000,
            });
            
            if (response.status === 200 || response.status === 301 || response.status === 302) {
                console.log(`Valid subdomain found: ${url}`);
                if (!subdomainResults[domain]) {
                    subdomainResults[domain] = [];
                }
                subdomainResults[domain].push(url);
                break;
            }
        } catch (error) {
            console.log(`Subdomain does not exist: ${url}`);
        }
    }
}

async function checkWordlistFromFile(domain) {
    const fs = require('fs');
    const readline = require('readline');
    const fileStream = fs.createReadStream(wordlistFile);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const name = line.trim(); 
        if (name) {
            await checkSubdomain(name, domain);
        }
    }
}

app.post('/subdomains', async (req, res) => {
    const { companyDomain } = req.body;

    if (!companyDomain) {
        return res.status(400).send('Domain is required');
    }

    // Send immediate response
    res.status(202).send(`Subdomain check started for ${companyDomain}.`);

    // Process the subdomain check in the background
    (async () => {
        try {
            await checkWordlistFromFile(companyDomain);
            console.log(`Subdomain check complete for ${companyDomain}.`);
        } catch (error) {
            console.error('Error occurred during subdomain check.', error);
        }
    })();
});

app.get('/results/:domain', (req, res) => {
    const domain = req.params.domain;
    if (subdomainResults[domain]) {
        res.json(subdomainResults[domain]);
    } else {
        res.status(404).send('No results found for the domain.');
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
