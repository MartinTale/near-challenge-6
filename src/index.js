import "regenerator-runtime/runtime";

import { initContract, login, logout } from "./utils";

import getConfig from "./config";
import Big from 'big.js';
const { networkId } = getConfig("development");

let yourStress;

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const submitButton = document.querySelector("form button");

const avatarContainer = document.getElementById("avatar-container");

let nftImageUrl = null;

document.querySelector("#sign-in-button").onclick = login;
document.querySelector("#sign-out-button").onclick = logout;

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector("#signed-out-flow").style.display = "block";
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelector("#signed-in-flow").style.display = "block";

  fetchGreeting();
}

document.getElementById('claim').onclick = async () => {
  await window.contract.storage_deposit(
    {
      account_id: window.accountId,
    },
    BOATLOAD_OF_GAS,
    Big('0.00125').times(10 ** 24).toFixed()
  );
}

document.getElementById('curse').onclick = async () => {
  await window.contract.storage_deposit(
    {
      account_id: document.getElementById('bad-person').value,
    },
    BOATLOAD_OF_GAS,
    Big('0.00125').times(10 ** 24).toFixed()
  );
}

document.getElementById('burn').onclick = async () => {
  await window.contract.ft_mint(
    {
      receiver_id: window.accountId,
      amount: Math.round(document.getElementById('stress-to-burn').value).toString(),
    },
    BOATLOAD_OF_GAS,
    Big('0.00125').times(10 ** 24).toFixed()
  );
  window.location.reload();
}

document.getElementById('send').onclick = async () => {
  await window.contract.ft_transfer(
    {
      receiver_id: document.getElementById('bad-person-2').value,
      amount: parseInt(yourStress).toString(),
    },
    BOATLOAD_OF_GAS,
    Big('0.000000000000000000000001').times(10 ** 24).toFixed()
  );
  window.location.reload();
}

// update global currentGreeting variable; update DOM with it
async function fetchGreeting() {
  const totalStress = await window.contract.ft_total_supply({});
  document.getElementById('total-stress').innerText = parseInt(totalStress).toLocaleString();
  yourStress = await window.contract.ft_balance_of({
    account_id: window.accountId,
  });
  document.getElementById('your-stress').innerText = parseInt(yourStress).toLocaleString();
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow();
    else signedOutFlow();
  })
  .catch(console.error);
