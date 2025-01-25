
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Recorder from './components/Recorder'
import Navbar from './components/Navbar'

function App() {
 

  return (
    <>
  

    <BrowserRouter>
    <Navbar />
    <Routes>

      
     
      <Route path="/" element={<Recorder />} />
    
     </Routes>    
    </BrowserRouter>
    
    </>
  )
}

export default App