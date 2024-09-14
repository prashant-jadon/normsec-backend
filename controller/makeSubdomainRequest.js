const wordlistFile = 'subdomains.txt';
const {Subdomains} = require('../models/saveSubdomains')
// In-memory storage for subdomains
let subdomainResults = {};
let subdomainResults403 = {};

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
                await Subdomains.create({
                    domain,
                    subdomainResults
                })
                break;
            }else if(response.status == 403){
                console.log(`Valid subdomain found: ${url}`);
                if (!subdomainResults403[domain]) {
                    subdomainResults403[domain] = [];
                }
                subdomainResults403[domain].push(url);
                await Subdomains.create({
                    domain,
                    subdomainResults403
                })
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


async function handleSubdRequest(req,res) {
   try {
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
   } catch (error) {
    console.log(error);
   }
}


async function handleGetSubdomains(req,res) {
    try {
        const domain = req.params.domain;
        if (subdomainResults[domain]) {
            res.json(subdomainResults[domain]);
        } else {
            res.status(404).send('No results found for the domain.');
        }
    } catch (error) {
        console.log(error)
    }
}

async function handleGetSubdomains403(req,res) {
    try {
        const domain = req.params.domain;
        if (subdomainResults403[domain]) {
            res.json(subdomainResults403[domain]);
        } else {
            res.status(404).send('No results found for the domain.');
        }
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    handleSubdRequest,
    handleGetSubdomains,
    handleGetSubdomains403
}