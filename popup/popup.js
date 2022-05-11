var browser = browser || chrome

document.getElementById("login_button").addEventListener("click", login)
document.getElementById("logout_button").addEventListener("click", logout)
document.getElementById("search").addEventListener("keydown", search_change)
window.addEventListener("DOMContentLoaded", check_status)

function search_current(){
	browser.tabs.query({
		currentWindow: true,
		active: true
	}, function(tabs){
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
	}, function(results){
		let results_table = document.getElementById('results')
		results_table.innerHTML = ''
		for(result in results){
			let new_option = document.createElement('option')
			new_option.innerHTML = results[result].title
			new_option.value = results[result].id
			new_option.ondblclick = function(){ use(this.value) }
			//new_option.oncopy = function(event){ copy(this.value, event, this) }
			results_table.appendChild(new_option)
		}
	})
}

function use(id){
	browser.tabs.executeScript({
      file: "/agent.js"
    })
    browser.tabs.query({
      active: true,
      currentWindow: true
    }, function(tabs){
    	complete(tabs[0], id)
    })
}

/*function copy(id, event, element){
	element.style.color = "red"
	browser.runtime.sendMessage({
		action: 'get_secret',
		secret_id: id
	}, function(secret){
		event.clipboardData.setData('text/plain', secret)
		event.preventDefault()
	})
}*/

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
	}, check_status)
}

function logout(){
	browser.runtime.sendMessage({
		action: 'logout'
	}, check_status)
}

function check_status(){
	browser.runtime.sendMessage({
		action: 'is_ready'
	}, function(ready){
		document.getElementById('connect').style.display = (ready?'none':'inline')
		document.getElementById('main').style.display = (ready?'inline':'none')
		if(ready){
			search_current()
		}
	})
}