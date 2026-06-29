import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import FeatureReleasePage from './pages/FeatureReleasePage'
import SprintMetricsPage from './pages/SprintMetricsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FeatureReleasePage />} />
          <Route path="sprints" element={<SprintMetricsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
