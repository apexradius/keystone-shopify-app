import React from 'react'
import { AppProvider } from '@shopify/polaris'
import '@shopify/polaris/build/esm/styles.css'
import enTranslations from '@shopify/polaris/locales/en.json'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Connect from './pages/Connect'
import Install from './pages/Install'

export default function App() {
  const params = new URLSearchParams(window.location.search)
  const shop = params.get('shop') || ''

  return (
    <AppProvider i18n={enTranslations}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard shop={shop} />} />
          <Route path="/connect" element={<Connect shop={shop} />} />
          <Route path="/install" element={<Install />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
