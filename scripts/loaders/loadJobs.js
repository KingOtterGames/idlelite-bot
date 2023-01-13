const fs = require('node:fs');
const getAllFiles = require('../helpers/getAllFiles');

module.exports = async (client) => {
    console.log("\nStarting up the jobs...")
    
    const files = await getAllFiles('jobs')
    
    // Add each command from files
    for (let i = 0; i < files.length; i++) {
        // Get file
        let file = files[i]

        // Get data from file
        const job = require(`../../${file}`)
        
        // Start the Job
        job.start()

        // Logging for devs
        console.log(`${"\x1b[32m"}${file}${"\x1b[0m"}`)
    }
}