import './App.css'
import { Route, Routes } from 'react-router'
import FleetTable from './components/FleetTable'
import TruckData from './components/TruckData'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<FleetTable />}/>
      <Route path="/trucks/:truckId" element={<TruckData />}/>
     </Routes>
    </>
  )
}

export default App
