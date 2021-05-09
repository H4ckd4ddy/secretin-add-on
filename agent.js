const id_keywords = ['user', 'username', 'identifiant', 'email', 'login', 'name', 'log', 'utilisateur']
const pass_keywords = ['password', 'pass', 'pwd', 'mdp']

function complete(request, sender, sendResponse) {
	var inputs = document.getElementsByTagName('input')

	for(input in inputs){
		var input_name
		if(inputs[input].name){
			input_name = inputs[input].name
		}else if(inputs[input].id){
			input_name = inputs[input].id
		}else{
			continue
		}

		// Complete all inputs matching keyword
		for(id_keyword in id_keywords){
			if(input_name.toLowerCase().includes(id_keywords[id_keyword])){
				inputs[input].value = request.username
				continue
			}
		}
		for(pass_keyword in pass_keywords){
			if(input_name.toLowerCase().includes(pass_keywords[pass_keyword])){
				inputs[input].value = request.password
				continue
			}
		}
	}
}

browser.runtime.onMessage.addListener(complete);