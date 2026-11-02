import './App.css'
import { Route, Routes } from 'react-router'
import FleetTable from './components/FleetTable'
import TruckData from './components/TruckData'
import { NotFound } from './NotFound'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<FleetTable />}/>
      <Route path="/trucks/:truckId" element={<TruckData />}/>
       <Route path="*" element={<NotFound />} />
     </Routes>
    </>
  )
}

export default App
