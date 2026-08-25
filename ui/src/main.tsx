import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { applyPhoneSafeArea, showApp } from './utils/nui'

const isGame = !!(window as any).invokeNative
if (isGame) {
  applyPhoneSafeArea('3.75rem', '0.5rem')
} else {
  applyPhoneSafeArea('0px', '0px')
  showApp()
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
