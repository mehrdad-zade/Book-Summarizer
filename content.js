const form = document.getElementById('form');
let api_key = "";

window.onload = function() {
  chrome.storage.local.get("personalApiKey", (result) => {
    if(typeof result.personalApiKey !== 'undefined') {
      api_key = result.personalApiKey;
    }
  });
};

form.addEventListener('submit', e => {

	e.preventDefault();

	const input = document.getElementById('input').value;
	const responseDiv = document.getElementById('response');

	//check to see if an API KEY was provided under option's page
	if(api_key != ""){
		responseDiv.innerHTML = 'Loading...';
		fetch('https://api.openai.com/v1/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + api_key
			},
			body: JSON.stringify({
				"model": "text-davinci-003",
				"prompt": "please summarize the main plots and themes of the book " 
				+ input
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
			responseDiv.innerHTML = data.choices[0].text;
		})
		.catch(error => {
			responseDiv.innerHTML = 'Error: ' + error;
		});
	}


	else{
		responseDiv.innerHTML = 'Update your API KEY, under Options.';
	}

});