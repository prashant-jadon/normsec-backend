const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const express = require('express');
const app = express();

app.use(express.json()); 

const wordlistFile = 'subdomains.txt'; 

async function checkSubdomain(subdomain, domain, outputFile) {
    const protocols = ['http', 'https'];
    for (const protocol of protocols) {
        const url = `${protocol}://${subdomain}.${domain}`;
        
        try {
            const response = await axios.get(url, {
                timeout: 5000,
            });
            
            if (response.status === 200 || response.status === 301 || response.status === 302) {
                console.log(`Valid subdomain found: ${url}`);
                fs.appendFileSync(outputFile, url + '\n');
                break;
            }
        } catch (error) {
            console.log(`Subdomain does not exist: ${url}`);
        }
    }
}

async function checkWordlistFromFile(domain) {
    const fileStream = fs.createReadStream(wordlistFile);
    const outputFile = `${domain}.txt`; 

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        const name = line.trim(); 
        if (name) {
            await checkSubdomain(name, domain, outputFile);
        }
    }
}

app.post('/subdomains', async (req, res) => {
    const { companyDomain } = req.body;

    if (!companyDomain) {
        return res.status(400).send('Domain is required');
    }

    // Send immediate response
    res.status(202).send(`Subdomain check started for ${companyDomain}. Results will be saved in ${companyDomain}.txt`);

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

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
