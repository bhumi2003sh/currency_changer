import countryList from "./country.js";/// Ensure the correct path is used

  const BASE_URL ="https://v6.exchangerate-api.com/v6/4a388b4ffd83cfc4b5eeb90c/latest";
  
  const fromSelect = document.getElementById("fromCurrency");
  const toSelect = document.getElementById("toCurrency");
  
  // Populate the dropdowns
  for (let currCode in countryList) {
      let optionElementFrom = document.createElement("option");
      optionElementFrom.innerText = currCode;
      optionElementFrom.value = currCode;
      fromSelect.appendChild(optionElementFrom);
  
      let optionElementTo = document.createElement("option");
      optionElementTo.innerText = currCode;
      optionElementTo.value = currCode;
      toSelect.appendChild(optionElementTo);
  }

  fromSelect.addEventListener("change", (evt) => {
    updateFlag(evt.target);
});

toSelect.addEventListener("change", (evt) => {
    updateFlag(evt.target);
});

const updateFlag = (element) => {
    const currCode = element.value;
    const countryCode = countryList[currCode];
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    const img = element.parentElement.querySelector("img");
    img.src = newSrc;
};

// Initial flag update when the page loads
updateFlag(fromSelect);
updateFlag(toSelect);

document.querySelector('form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const amount = parseFloat(document.querySelector('.amount input').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    try {
        const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);

        if (exchangeRate) {
            const convertedAmount = (amount * exchangeRate).toFixed(2);
            document.querySelector('.msg').textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
        } else {
            alert('Exchange rate not found.');
        }
    } catch (error) {
        alert('Failed to fetch exchange rate.');
        console.error('Error:', error);
    }
});

async function getExchangeRate(fromCurrency, toCurrency) {
    const response = await fetch(`${BASE_URL}/${fromCurrency}`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
    }

    const data = await response.json();
    return data.conversion_rates[toCurrency];
}