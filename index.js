// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area="

function clearError(errorEl) {
	errorEl.textContent = ""
	errorEl.classList.add("hidden")
}

function showError(errorEl, message) {
	errorEl.textContent = message
	errorEl.classList.remove("hidden")
}

function displayAlerts(alertsEl, data) {
	const features = Array.isArray(data.features) ? data.features : []
	const title = data.title || "Current watches, warnings, and advisories"

	alertsEl.innerHTML = ""

	const summary = document.createElement("p")
	summary.textContent = `${title}: ${features.length}`
	alertsEl.appendChild(summary)

	const list = document.createElement("ul")
	features.forEach((feature) => {
		const item = document.createElement("li")
		item.textContent = feature?.properties?.headline || "No headline available"
		list.appendChild(item)
	})
	alertsEl.appendChild(list)
}

function fetchWeatherAlerts(state, alertsEl, errorEl) {
	return fetch(`${weatherApi}${state}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`Request failed with status ${response.status}`)
			}
			return response.json()
		})
		.then((data) => {
			clearError(errorEl)
			displayAlerts(alertsEl, data)
			return data
		})
		.catch((errorObject) => {
			showError(errorEl, errorObject.message)
			throw errorObject
		})
}

document.addEventListener("DOMContentLoaded", () => {
	const input = document.getElementById("state-input")
	const button = document.getElementById("fetch-alerts")
	const alertsDisplay = document.getElementById("alerts-display")
	const errorMessage = document.getElementById("error-message")

	clearError(errorMessage)

	button.addEventListener("click", () => {
		const state = input.value.trim().toUpperCase()
		alertsDisplay.innerHTML = ""
		input.value = ""

		if (!state) {
			showError(errorMessage, "Please enter a state abbreviation.")
			return
		}

		fetchWeatherAlerts(state, alertsDisplay, errorMessage).catch(() => {})
	})
})

if (typeof module !== "undefined") {
	module.exports = {
		fetchWeatherAlerts,
		displayAlerts,
		clearError,
		showError,
	}
}