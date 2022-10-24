//require modules
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//create build path, or remove it if it is already exists
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

//create campaign path
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

//read Campaign.sol file and save it to the source variable
const source = fs.readFileSync(campaignPath, 'utf8');

//compile each contract inside Campaign.sol
const output = solc.compile(source, 1).contracts;

//ensure if build folder exist. If does not, then create it 
fs.ensureDirSync(buildPath);

//loop over the 'output', take each contract that exists inside there and write it to separate files inside 'build' directory
for (let contract in output) {
    fs.outputJsonSync(  //this function creates a json file in the appropriate directory 
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract] //this secord argument is the actual content that we want to write out to this json file
    );
}

