/**
 * This worker script allows mapping CDN to Origin arbitrary paths
 */

/**
 * INSTALL_OPTIONS must be defined
 * For example:
 *  const INSTALL_OPTIONS = {
 *    "debug": false,
 *    "getWorkerIP": false
 *    "cdnCatchAll": true,
 *    "originUrl": "https://myorigin.com",
 *    "cdnDomain": "myzonedomain.com",
 *    "cdnSubDomain": "cdn",
 *    "pathMap": [
 *      { "script/": "static_assets/script/" },
 *      { "style/": "static/style/"}
 *    ]
 *  }
 */

/* SETUP BEGINS */

/**
 * Example 1
 * CDN Path: https://cdn.myzonedomain.com/script/main.js
 * S3 Path: https://myorigin.com/grunt_build/script/main.js
 *
 * Example 2
 * CDN Path: https://cdn.myzonedomain.com/styles/style.css
 * S3 Path: https://myorigin.com/grunt_build/styles/style.css
 */

/* SETUP ENDS */

const VERSION = "1.0.2"
const WORKER_SHORT_NAME = "originator"
const DEBUG = INSTALL_OPTIONS.debug
const GET_WORKER_IP = INSTALL_OPTIONS.getWorkerIP
const CDN_CATCH_ALL = INSTALL_OPTIONS.cdnCatchAll
const originUrl = INSTALL_OPTIONS.originUrl.trim()
const originHost = originUrl.replace(new RegExp("^https?://"), "")
// eslint-disable-next-line
const cndPath = `^https?://${INSTALL_OPTIONS.cdnSubDomain}.${INSTALL_OPTIONS.cdnDomain}/`
const cdnPathRegExp = new RegExp(cndPath)

/* eslint-disable no-param-reassign */

/**
 * used by CloudFlare App Worker
 */
const cdnPathMap = INSTALL_OPTIONS.pathMap.reduce((map, obj) => {
  map[obj.key] = obj.val
  return map
}, {})

/**
 * used by standalone worker
 */
// const cdnPathMap = INSTALL_OPTIONS.pathMap.reduce((map, obj) => {
//   var obj2 = Object.entries(obj).map(([key, value]) => ({key,value}));
//   map[obj2[0].key] = obj2[0].value
//   return map
// }, {})
/* eslint-enable no-param-reassign */

/**
 * Print debug message if DEBUG is enabled
 * @param {string} msg
 */
async function debug(msg) {
  if (DEBUG) {
    if (typeof msg === "string") {
      console.log(`${WORKER_SHORT_NAME} ${VERSION}: ${msg}`)
    } else {
      console.log(msg)
    }
  }
}

debug("== WORKER REQUEST DEBUG ENABLED ==")
debug("CDN Path Map")
debug(cdnPathMap)

/**
 * get worker IP address
 */
async function getWorkerIP() {
  if (DEBUG && GET_WORKER_IP) {
    const ipReq = new Request("http://icanhazip.com")
    const ipRes = await fetch(ipReq)
    return ipRes.text()
  }
  return "0.0.0.0"
}

/**
 * Get CDN to Origin mapped path
 * @params {string} path
 */
function getOriginPath(path) {
  /* eslint-disable no-restricted-syntax */
  for (const key of Object.keys(cdnPathMap)) {
    const cdnPR = new RegExp(`^${key}`)
    if (cdnPR.test(path)) {
      const pathRem = path.replace(cdnPR, "")
      return `${cdnPathMap[key]}${pathRem}`
    }
  }
  /* eslint-enable no-restricted-syntax */
  if (CDN_CATCH_ALL) {
    debug(
      "Cannot find specific path mapping, using " /
        " as prefix, since CDN_CATCH_ALL enabled..",
    )
    return path
  }
  debug(
    "Cannot find specific path mapping, bypassing CDN since CDN_CATCH_ALL is disabled..",
  )
  return false
}

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function fetchAndLog(request) {
  debug("Got request", request)
  const response = await fetch(request)
  debug("Got response", response)
  return response
}

/**
 * Fetch Origin asset
 * @params {string} url
 */
async function getFromOrigin(url) {
  debug(`Fetching from Origin: ${url}`)
  const urlReq = new Request(url)
  urlReq.headers.set("HOST", originHost)
  debug("Origin Request Headers")
  debug(new Map(urlReq.headers))
  const [urlRes, workerIp] = await Promise.all([fetch(urlReq), getWorkerIP()])
  debug(`Worker IP: ${workerIp}`)
  debug(`Origin Response Code: ${urlRes.status}`)
  if (urlRes.status !== 200) {
    debug("Returning 404")
    return new Response("This page is not found.", {
      status: 404,
      statusText: "NotFound",
    })
  }
  return urlRes
}

/* eslint-disable no-restricted-globals */
/**
 * Register Event Listener
 */
addEventListener("fetch", event => {
  event.passThroughOnException()
  if (cdnPathRegExp.test(event.request.url)) {
    debug("CDN request candidate found")
    const requestPath = event.request.url.replace(cdnPathRegExp, "")
    const originPath = getOriginPath(requestPath)
    debug(`CDN to Origin Mapped Path: "${requestPath}" => "${originPath}"`)
    if (originPath !== false) {
      const originResourceUrl = `${originUrl}/${originPath}`
      debug(`Origin URL: ${originResourceUrl}`)
      event.respondWith(getFromOrigin(originResourceUrl))
    }
  } else {
    debug("Default request matched")
    // event.respondWith(fetchAndLog(event.request))
  }
})
/* eslint-enable no-restricted-globals */
