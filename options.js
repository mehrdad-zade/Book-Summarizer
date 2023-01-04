const form = document.getElementById('api-key-form');
const input = document.getElementById('api-key-input');

window.onload = function() {
  chrome.storage.local.get("personalApiKey", (result) => {
    if(typeof result.personalApiKey !== 'undefined') {
      input.value = result.personalApiKey;
    }
  });
};

//option to save an api-key
form.addEventListener('submit', event => {
  event.preventDefault();
  const apiKey = document.getElementById('api-key-input').value;
  chrome.storage.local.set({ personalApiKey: apiKey }, () => {
  console.log('API key saved');
});

});