let searchForm = document.getElementById('search-form');
const apiForm = document.getElementById('api-key-form');
const apiKeyInput = document.getElementById('api-key-input');
let apiKey = ""

//set api_key based on the value in options page
window.onload = function() {
	chrome.storage.local.get("personalApiKey", (result) => {
		if(typeof result.personalApiKey !== 'undefined') {
			if(apiKeyInput){
				apiKeyInput.value = result.personalApiKey;
			}
			apiKey = result.personalApiKey;
		}
	});
};

//save an api-key on the options page
//only listen when options page is loaded
if(apiForm){
	apiForm.addEventListener('submit', event => {
		event.preventDefault();
		chrome.storage.local.set({ personalApiKey: apiKeyInput.value }, () => {
			console.log('API key saved');
		});
	});
}

//submit search query to chatGPT on the popup page; if the API key is available
//only listen when popup page is loaded
if(searchForm){
	searchForm.addEventListener('submit', event => {
		event.preventDefault();

		//check to see if an API KEY was provided under option's page
		if(apiKey != ""){
			const searchQueryInput = document.getElementById('search-input');
			const responseDiv = document.getElementById('search-response');
			responseDiv.innerHTML = 'Loading...';
			fetch('https://api.openai.com/v1/completions', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + apiKey
				},
				body: JSON.stringify({
					"model": "text-davinci-003",
					"prompt": "please summarize the main plots and themes of the book " 
					+ searchQueryInput.value
					+ " in a couple of paragraphs.\n" 
					+ "include key events and characters in the summary.\n"
					+ "add a separate paragraph around the main character's plot and history.\n"
					+ "include the stories of characters sorounding the main character in a separate paragraph.\n"
					+ "include the main events in a separatee paragraph.\n"
					+ "add the memorable scenes and statements in a separate paragraph.\n"
					+ "add the most repeated statements of this book in a separate paragraph.\n"
					+ "include analysis of the writer's style and message in a few separate paragraphs.\n"
					+ "add examples from the book passages that shows the brilliance of the writer.\n"
					+ "what are the most important books of this writer? \n",
					"max_tokens": 2048,
					"temperature": 0.5
				})
			})
			.then(res => res.json())
			.then(data => {
			responseDiv.innerHTML = data.choices[0].text;//set the response box with chatGPT's response
		})
			.catch(error => {
				responseDiv.innerHTML = 'Error: ' + error;
			});
		}


		else{
			responseDiv.innerHTML = 'Update your API KEY, under Options.';
		}

	});
}