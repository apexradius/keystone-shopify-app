import axios from 'axios'

const KEYSTONE_BASE = 'https://keystone.apexradius.ai'

let _jwt = null

/**
 * In App Bridge v4, the session token is obtained via the app instance's
 * idToken() method (available after the app is initialized).
 * The app instance is obtained via useAppBridge() in components.
 */
export async function getKeystoneToken(app) {
  if (_jwt) return _jwt

  // App Bridge v4: get session token via app.idToken() or the window.shopify API
  let sessionToken
  try {
    if (app && typeof app.idToken === 'function') {
      sessionToken = await app.idToken()
    } else if (window.shopify && typeof window.shopify.idToken === 'function') {
      sessionToken = await window.shopify.idToken()
    } else {
      throw new Error('App Bridge session token not available')
    }
  } catch (err) {
    throw new Error(`Failed to get session token: ${err.message}`)
  }

  const res = await axios.post(`${KEYSTONE_BASE}/api/v1/platform/shopify/app-bridge-token`, {
    session_token: sessionToken,
  })
  _jwt = res.data.access_token
  return _jwt
}

export function clearKeystoneToken() {
  _jwt = null
}

export const keystoneApi = axios.create({ baseURL: KEYSTONE_BASE })
