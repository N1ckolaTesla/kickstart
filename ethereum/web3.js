import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof web3 !== 'undefined') { //if we are on the browser and user uses metamask
    //window.ethereum.request({ method: "eth_requestAccounts" });
    web3 = new Web3(window.ethereum);
} else { //we are on the server or user does not use metamask
    const provider = new Web3.providers.HttpProvider('https://goerli.infura.io/v3/f0751c5393e44acca6fb8cc4aba85a7b');
    web3 = new Web3(provider);
}

export default web3;