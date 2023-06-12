import Register from './components/RegisterUser'
import UserLogin from './components/UserLogin'
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
      <Routes>
        <Route path="/login" element={<UserLogin />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<h1>Hello Home</h1>} />
      </Routes>
  )
}

export default App
