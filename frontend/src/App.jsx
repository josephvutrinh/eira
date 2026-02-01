import './App.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ChatPage from './pages/ChatPage.jsx'

function App() {
  return (
    <ErrorBoundary>
      <ChatPage />
    </ErrorBoundary>
  )
}

export default App
