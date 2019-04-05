// this import statement tells webpack to include styles.css in the build
import css from "./styles.css"

function init() {
  if (!window.addEventListener) return // Check for IE9+

  let options = INSTALL_OPTIONS
  let element

  const message =
    "<h1>CloudFlare Originator.</h1><p>This Cloudflare App attempts to replicates AWS CloudFront's convenient capability of mapping path of incoming requests to a different origin path.</p>"

  const location = {
    selector: "body",
    method: "prepend",
  }

  // updateElement runs every time the options are updated.
  // Most of your code will end up inside this function.
  function updateElement() {
    element = INSTALL.createElement(location, element)

    // Set the app attribute to your app's dash-delimited alias.
    element.setAttribute("app", "origin-path-customizer")
    element.innerHTML = message
  }

  // INSTALL_SCOPE is an object that is used to handle option changes without refreshing the page.
  window.INSTALL_SCOPE = {
    setOptions(nextOptions) {
      options = nextOptions
      updateElement()
    },
  }

  // This code ensures that the app doesn't run before the page is loaded.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateElement)
  } else {
    updateElement()
  }
}

init()
