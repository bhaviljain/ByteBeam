import  { useEffect, useState } from 'react'
import { Status } from '../utils/type'
import { Activity, AlertTriangle, Truck } from 'lucide-react'

const DashBoard = ({data}:{data:any}) => {
 const [critical,setCritical] = useState([])
  const getCriticalBattery = () =>{
    const criticaldata = data?.filter((item:any)=>item?.batterStatus === Status.CRITICAL)    
    setCritical(criticaldata)
  }

  useEffect(()=>{
    getCriticalBattery()
  },[])
 
  const running = data?.filter((item:any)=>item.batterStatus !== Status.RECENT)

  return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">

      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">Total Trucks</p>
          <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
            <Truck size={21} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mt-3">
          {data?.length ?? 0}
        </h2>
      </div>

      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">Critical Trucks</p>
          <div className="bg-red-50 text-red-600 p-2 rounded-lg">
            <AlertTriangle size={21} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-red-600 mt-3">
          {critical.length}
        </h2>
        <div className="flex flex-wrap gap-2 mt-3">
          {critical.map((item: any) => (
            <span
              key={item.vehicle}
              className="text-xs font-medium bg-red-50 text-red-700 px-2.5 py-1 rounded-md"
            >
              {item.vehicle}
            </span>
          ))}
        </div>
      </div>

      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">Active Trucks</p>
          <div className="bg-green-50 text-green-600 p-2 rounded-lg">
            <Activity size={21} />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-green-600 mt-3">
          {running.length}
        </h2>
      </div>

    </div>
  )
}

export default DashBoard
