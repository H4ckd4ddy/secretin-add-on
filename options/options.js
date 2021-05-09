function save_options(e) {
	e.preventDefault()
	browser.storage.sync.set({
		SECRETIN_API_URL: document.querySelector("#SECRETIN_API_URL").value
	});
}

function load_options() {
	function show_current_options(result) {
		document.querySelector("#SECRETIN_API_URL").value = result.SECRETIN_API_URL || 'https://api.secret-in.me'
	}

	var getting = browser.storage.sync.get("SECRETIN_API_URL")
	getting.then(show_current_options, console.log)
}

document.addEventListener("DOMContentLoaded", load_options)
document.querySelector("form").addEventListener("submit", save_options)