var secretin = null
var secrets = {}
var is_loading = false

function store_secrets_index(results){
	for(secret in results.metadatas){
		if(Object.keys(results.metadatas[secret].users[secretin.username].folders).length > 0){
			secrets[secret] = {
				'title': results.metadatas[secret].title,
				'path': results.metadatas[secret].title,
				'parent': Object.keys(results.metadatas[secret].users[secretin.username].folders)[0],
				'type': results.metadatas[secret].type
			}
		}
	}
	for(secret in secrets){
		var parent = secrets[secret].parent
		while(parent != 'ROOT'){
			secrets[secret].path = secrets[parent].title + ' > ' + secrets[secret].path
			parent = secrets[parent].parent
		}
	}
	is_loading = false
}

function handleMessage(request, sender, sendResponse) {
	switch(request.action){
		case 'login':
			is_loading = true
			browser.storage.sync.get("SECRETIN_API_URL").then(result => {
				let api_url = result.SECRETIN_API_URL || 'https://api.secret-in.me'
				secretin = new Secretin(SecretinBrowserAdapter, Secretin.API.Server, api_url)
				secretin.username = request.username
				if(request.totp){
					secretin.loginUser(request.username, request.password, request.totp).then(store_secrets_index)
				}else{
					secretin.loginUser(request.username, request.password).then(store_secrets_index)
				}
			})
			break;

		case 'logout':
			secretin = null
			secrets = {}
			break

		case 'search':
			let results, results_count
			let keywords = request.keyword.split('.')
			/*
			Search best match from fqdn to service name
			Reduce keyword if no match
			Ex:
			- my.space.exemple.com
			- space.exemple.com
			- exemple.com
			- exemple
			*/
			do {
				results = []
				results_count = 0
				for(secret in secrets){
					if(secrets[secret].type == 'secret' && secrets[secret].title.toLowerCase().includes(keywords.join('.'))){
						results_count++
						results.push({'id':secret, 'title': secrets[secret].path})
					}
				}
				if(keywords.length > 2){
					keywords.shift()
				}else{
					keywords.pop()
				}
			} while(results_count == 0 && keywords.length > 0)
			sendResponse(results)
			break

		case 'complete':
			secretin.getSecret(request.secret_id).then(result => {
				let username = result.fields[0].content
				let password = result.fields[1].content
				browser.tabs.sendMessage(request.tab_id, {
					username: username,
					password: password
				});
			})
			break

		case 'is_ready':
			sendResponse(Object.keys(secrets).length > 0)
			break

		case 'is_loading':
			sendResponse(is_loading)
			break
	}
}

browser.runtime.onMessage.addListener(handleMessage)