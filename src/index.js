import "regenerator-runtime/runtime";

import { initContract, login, logout } from "./utils";
import axios from 'axios';

import { v4 } from 'uuid';

import getConfig from "./config";
import Big from 'big.js';
const { networkId } = getConfig("development");

// global variable used throughout
let currentGreeting;

const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const submitButton = document.querySelector("form button");

const avatarContainer = document.getElementById("avatar-container");
let currentAvatar = Date.now();

let currentColor = '#1e1e1e';

let nftImageUrl = null;

document.getElementById("refresh-avatar").onclick = (e) => {
  e.preventDefault();
  setAvatar(Date.now());
};

document.getElementById('download').onclick = async () => {
  if (nftImageUrl) {
    const image = await fetch(nftImageUrl)
    const imageBlog = await image.blob()
    const imageURL = URL.createObjectURL(imageBlog)
    
    const link = document.createElement('a')
    link.href = imageURL
    link.download = 'Your NFT Robo Avatar.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

document.querySelector("form").onsubmit = async (event) => {
  event.preventDefault();

  // get elements from the form using their id attribute
  const { fieldset, greeting } = event.target.elements;

  // disable the form while the value gets updated on-chain
  fieldset.disabled = true;

  const username = document.getElementById("name").value;

  try {
    const payload = { html: `<div class="box">
    <img src="https://avatars.dicebear.com/api/bottts/${document.getElementById("greeting").value}.svg">
    <strong>${username}</strong>
    <small>${window.accountId}</small>
  </div>`,
    css: `.box {
      width: 512px;
      height: 512px;
        display: flex;
      justify-content: center;
      align-items:center;
      flex-direction: column;
      background: ${currentColor};
      overflow: hidden;
    }
    
    img {
      width: 300px;
      height: 300px;
    }
    
    strong {
      font-size: 3rem;
      font-family: "Comic Sans MS", "Comic Sans", cursive;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 0 2px #000, 0 0 4px #000, 0 0 6px #000, 0 0 8px #000, 0 0 10px #000, 0 0 12px #000;
    }
    
    small {
      font-size: 1.25rem;
      font-family: "Comic Sans MS", "Comic Sans", cursive;
      color: #ddd;
      text-shadow: 0 0 2px #000, 0 0 4px #000, 0 0 6px #000, 0 0 8px #000;
    }` };

    let headers = { auth: {
      username: '728516a6-19a9-4b15-9b64-12d8e98e8394',
      password: '333e8066-8986-420f-8bb8-bae069a19e9c'
    },
    headers: {
      'Content-Type': 'application/json'
    }
    }


    try {
      const response = await axios.post('https://hcti.io/v1/image', JSON.stringify(payload), headers);

      const imgurl = response.data.url;
      const token = v4();

      localStorage.setItem('near-martin-5.' + window.accountId, imgurl);
      nftImageUrl = imgurl;
      
      // make an update call to the smart contract
      await window.contract.nft_mint(
        {
          // pass the value that the user entered in the greeting field
          token_id: v4(),
          receiver_id: window.accountId,
          metadata: { 
            "title": username + "'s Robo Avatar", 
            "description": "Minted using https://martintale.github.io/near-challenge-5/", 
            "media": imgurl, 
            "copies": 1
          }
        },
        BOATLOAD_OF_GAS,
        Big('1').times(10 ** 24).toFixed()
      );
    } catch (error) {
      console.error(error);
    }
  } catch (e) {
    console.log(e);
    alert(
      "Something went wrong! " +
        "Maybe you need to sign out and back in? " +
        "Check your browser console for more info."
    );
    throw e;
  } finally {
    // re-enable the form, whether the call succeeded or failed
    fieldset.disabled = false;
  }

  // update the greeting in the UI
  await fetchGreeting();

  // show notification
  document.querySelector("[data-behavior=notification]").style.display =
    "block";

  // remove notification again after css animation completes
  // this allows it to be shown again next time the form is submitted
  setTimeout(() => {
    document.querySelector("[data-behavior=notification]").style.display =
      "none";
  }, 11000);
};

document.querySelector("#sign-in-button").onclick = login;
document.querySelector("#sign-out-button").onclick = logout;

// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector("#signed-out-flow").style.display = "block";
}

// Displaying the signed in flow container and fill in account-specific data
function signedInFlow() {
  document.querySelector("#signed-in-flow").style.display = "block";

  // document.querySelectorAll("[data-behavior=account-id]").forEach((el) => {
  //   el.innerText = window.accountId;
  // });

  // populate links in the notification box
  const accountLink = document.querySelector(
    "[data-behavior=notification] a:nth-of-type(1)"
  );
  accountLink.href = accountLink.href + window.accountId;
  accountLink.innerText = "@" + window.accountId;
  const contractLink = document.querySelector(
    "[data-behavior=notification] a:nth-of-type(2)"
  );
  contractLink.href = contractLink.href + window.contract.contractId;
  contractLink.innerText = "@" + window.contract.contractId;

  // update with selected networkId
  accountLink.href = accountLink.href.replace("testnet", networkId);
  contractLink.href = contractLink.href.replace("testnet", networkId);

  fetchGreeting();

  document.querySelectorAll('.bg-color').forEach(color => {
    color.onclick = (event) => {
      const target = event.target.closest('.bg-color');
      const color = target.getAttribute("data-color");
      currentColor = color;
      document.body.style.background = color;
    }
  });
}

function setAvatar(avatar) {
  currentAvatar = avatar;
  avatarContainer.src =
    "https://avatars.dicebear.com/api/bottts/" + currentAvatar + ".svg";
  document.getElementById("greeting").value = currentAvatar;
}

// update global currentGreeting variable; update DOM with it
async function fetchGreeting() {
  const userMadeNFT = localStorage.getItem('near-martin-5.' + window.accountId);

  if (userMadeNFT == null) {
    setAvatar(Date.now());
    if (document.getElementById('your-avatar')) {
      document.getElementById('your-avatar').style.display = 'none';
    }
  } else {
    nftImageUrl = userMadeNFT;
    if (document.getElementById('new-user')) {
      document.getElementById('new-user').remove();
    }
    if (document.getElementById('your-avatar')) {
      document.getElementById('your-avatar').style.display = 'flex';
    }

    if (document.getElementById('nft-image')) {
      document.getElementById('nft-image').src = userMadeNFT;
      document.getElementById('nft-image').classList.toggle('hidden', false);
    }
  }
}

// `nearInitPromise` gets called on page load
window.nearInitPromise = initContract()
  .then(() => {
    if (window.walletConnection.isSignedIn()) signedInFlow();
    else signedOutFlow();
  })
  .catch(console.error);
