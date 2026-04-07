import React from 'react'
import { AppProvider } from '@shopify/polaris'
import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react'
import '@shopify/polaris/build/esm/styles.css'
import enTranslations from '@shopify/polaris/locales/en.json'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Connect from './pages/Connect'
import Install from './pages/Install'

const CLIENT_ID = 'a9a5a9324f5d3a2b886c0ed6265d1ad6'

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const host = params.get('host') || ''
  const shop = params.get('shop') || ''

  const config = {
    apiKey: CLIENT_ID,
    host,
    forceRedirect: true,
  }

  return (
    <AppBridgeProvider config={config}>
      <AppProvider i18n={enTranslations}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard shop={shop} />} />
            <Route path="/connect" element={<Connect shop={shop} />} />
            <Route path="/install" element={<Install />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AppBridgeProvider>
  )
}
