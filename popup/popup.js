
document.getElementById("login_button").addEventListener("click", login);
document.getElementById("logout_button").addEventListener("click", logout);
document.getElementById("search").addEventListener("keydown", search_change);
window.addEventListener("DOMContentLoaded", check_status);

function search_current(){
	browser.tabs.query({
		currentWindow: true,
		active: true
	}).then(tabs => {
		let url_parts = tabs[0].url.split('://')[1]
		let fqdn = url_parts.split('/')[0]
		document.getElementById("search").value = fqdn
		search_change()
	})
}

function search_change(){
	search(document.getElementById("search").value)
}

function search(keyword){
	browser.runtime.sendMessage({
		action: 'search',
		keyword: keyword
	}).then(results => {
		let results_table = document.getElementById('results')
		results_table.innerHTML = ''
		for(result in results){
			let new_option = document.createElement('option')
			new_option.innerHTML = results[result].title
			new_option.value = results[result].id
			new_option.ondblclick = function(){ use(this.value) }
			results_table.appendChild(new_option)
		}
	})
}

function use(id){
	browser.tabs.executeScript({
      file: "/agent.js"
    });
    var querying = browser.tabs.query({
      active: true,
      currentWindow: true
    });
    querying.then(tabs => {
    	complete(tabs[0], id)
    });
}

function complete(tab, secret_id){
	browser.runtime.sendMessage({
		action: 'complete',
		secret_id: secret_id,
		tab_id: tab.id
	})
}

function login(){
	let username = document.getElementById('username').value
	let password = document.getElementById('password').value
	let totp = document.getElementById('totp').value

	browser.runtime.sendMessage({
		action: 'login',
		username: username,
		password: password,
		totp: totp
	}).then(check_status)
}

function logout(){
	browser.runtime.sendMessage({
		action: 'logout'
	}).then(check_status)
}

function check_status(){
	browser.runtime.sendMessage({
		action: 'is_ready'
	}).then(ready => {
		document.getElementById('connect').style.display = (ready?'none':'inline')
		document.getElementById('main').style.display = (ready?'inline':'none')
		if(ready){
			search_current()
		}
	})
}