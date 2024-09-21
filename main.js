import { countryList } from './code.js';

const BASE_URL = "https://v6.exchangerate-api.com/v6/3d6750264571c128779ca1fb/latest/USD";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  
  try {
    let response = await fetch(BASE_URL);
    let data = await response.json();
    
    if (!data.conversion_rates) {
      msg.innerText = "Error fetching exchange rates.";
      return;
    }

    let rate = data.conversion_rates[toCurr.value];
    if (!rate) {
      msg.innerText = `Exchange rate not found for ${toCurr.value}.`;
      return;
    }

    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching data from the API.";
    console.error(error);
  }
};

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
  
    if (!countryCode) {
      console.warn(`No country code found for ${currCode}`);
      return;
    }
  
    let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;

    let img = element.closest('.from, .to').querySelector('img');
  
    if (img) {
      img.src = newSrc;
    } else {
      console.warn("Image element not found next to the select element.");
    }
  };
  

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});