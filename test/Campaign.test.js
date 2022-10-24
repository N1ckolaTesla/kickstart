const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory; //deployed instance 
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({data: compiledFactory.bytecode })
    .send({from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaign', () => {
    it('Deploys a Campaign and a Factory', () => {
        assert.ok(campaign.options.address);
        assert.ok(factory.options.address);
    });

    it('A caller is the actual manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('Contributers can contribute some money and mark as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '1000',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert.ok(isContributor); 
    });

    it('Requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('Allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest('Buy something', 100, accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal(request.description, 'Buy something');
    });

    it('processes request', async () => {
        await campaign.methods.contribute().send({
            value: web3.utils.toWei('10', 'ether'),
            from: accounts[0]
        });
        
        await campaign.methods.createRequest('Give me money', web3.utils.toWei('5', 'ether'), accounts[1]).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]); //now the balance variable is a string that represents amount of money that accounts[0] has in wei
        balance = web3.utils.fromWei(balance, 'ether'); //now the balance is a string that represents some amount of ether
        balance = parseFloat(balance); //parseFloat takes a string and terns it to a decimal number, so now we can compare 
        console.log(balance);
        assert(balance > 104);
    });
});