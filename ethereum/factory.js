import web3 from './web3';
import CampaignFactory from './build/CampaignFactory';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x4188E39ceBf1E50348c25a30519693979A8d7E07'
);

export default instance;