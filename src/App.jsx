import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CoreAdvising from './pages/CoreAdvising'
import CampusServices from './pages/CampusServices'
import CareerAdvising from './pages/CareerAdvising'
import CourseScheduling from './pages/CourseScheduling'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/core-advising" element={<CoreAdvising />} />
      <Route path="/campus-services" element={<CampusServices />} />
      <Route path="/career-advising" element={<CareerAdvising />} />
      <Route path="/course-scheduling" element={<CourseScheduling />} />
    </Routes>
  )
}

export default App
