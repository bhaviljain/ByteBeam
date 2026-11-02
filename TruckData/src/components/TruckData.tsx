import { useNavigate, useParams } from "react-router";
import {
  FleetData,
  groupTruckData,
  staleData,
} from "../utils/processTelemetry";
import { useEffect, useState } from "react";
import { Chip } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Truck,
  BatteryCharging,
  Gauge,
  Clock,
  Activity,
  ChevronLeft,
  Loader2,
  TimerReset,
} from "lucide-react";

const TruckData = () => {
  const [truck, setTruck] = useState<any>(null);
  const { truckId } = useParams();

  const data = FleetData();
  const truckGraphData = groupTruckData();

  const allStaleData = {
    soc: staleData("soc"),
    speed: staleData("speed"),
    battery: staleData("battery_temp"),
  };

  const socData = allStaleData.soc.find((item) => item?.vehicle === truckId);

  const speedData = allStaleData.speed.find(
    (item) => item?.vehicle === truckId,
  );

  const batteryTempData = allStaleData.battery.find(
    (item) => item?.vehicle === truckId,
  );

  const renderTableData = () => {
    const truckData = data?.find((item) => item.vehicle === truckId);

    setTruck({
      ...truckData,
      socData,
      speedData,
      batteryTempData,
    });
  };

  useEffect(() => {
    renderTableData();
  }, [truckId]);

  const allVehicle = truckGraphData[truckId as string];

  const graphAllData = allVehicle?.filter(
    (item: any) => item?.signals?.soc != null,
  );

  const sortByAssc =
    graphAllData?.sort(
      (a: any, b: any) =>
        new Date(a.event_time).getTime() - new Date(b.event_time).getTime(),
    ) ?? [];

  const navigate = useNavigate();

  const Back = () => {
    navigate(-1);
  };

  console.log(truck);

  return (
    <div className="mt-5 space-y-5">
      {truck ? (
        <>
          <div className="flex items-center gap-3">
            <button
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
              onClick={Back}
            >
              <ChevronLeft />
            </button>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Truck size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Truck Details
              </h1>
              <p className="text-sm text-gray-500">
                Vehicle information and battery performance
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl bg-white p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Vehicle Overview
                </h2>
                <p className="text-sm text-gray-500">
                  {truck?.vehicle ?? truckId}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="flex items-center gap-3">
                <div className="bg-orange-50 text-orange-600 p-3 rounded-lg">
                  <BatteryCharging size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Battery Status</p>
                  <p className="font-semibold text-gray-900">
                    {truck?.battery ?? "Not Reported"}
                  </p>
                </div>
                  <Chip
                  label={
                    !truck?.batteryTempData
                      ? "Not Reported"
                      : truck.batteryTempData.isStale
                        ? "Stale"
                        : "Fresh"
                  }
                  color={
                    !truck?.batteryTempData
                      ? "default"
                      : truck.batteryTempData.isStale
                        ? "error"
                        : "success"
                  }
                  size="small"
                  className="!text-xs"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                  <Activity size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Latest SOC</p>
                  <p className="font-semibold text-gray-900">
                    {truck?.lastSoc != null
                      ? `${truck.lastSoc}%`
                      : "Not Reported"}
                  </p>
                </div>
                <Chip
                  label={
                    !truck?.socData
                      ? "Not Reported"
                      : truck.socData.isStale
                        ? "Stale"
                        : "Fresh"
                  }
                  color={
                    !truck?.socData
                      ? "default"
                      : truck.socData.isStale
                        ? "error"
                        : "success"
                  }
                  size="small"
                  className="!text-xs"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                  <Gauge size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Latest Speed</p>
                  <p className="font-semibold text-gray-900">
                    {truck?.lastSpeed != null
                      ? `${truck.lastSpeed} km/h`
                      : "Not Reported"}
                  </p>
                </div>
                <Chip
                  label={
                    !truck?.speedData
                      ? "Not Reported"
                      : truck.speedData.isStale
                        ? "Stale"
                        : "Fresh"
                  }
                  color={
                    !truck?.speedData
                      ? "default"
                      : truck.speedData.isStale
                        ? "error"
                        : "success"
                  }
                  size="small"
                  className="!text-xs"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Seen</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {truck?.lastSeen
                      ? new Date(truck.lastSeen).toLocaleString()
                      : "Not Reported"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-50 text-mauve-600 p-3 rounded-lg">
                  <TimerReset size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Battery Last Updated</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {truck?.timeDifference !== null
                      ? `${truck.batteryTempData?.timeDifference.toFixed(2)} minutes ago`
                      : "Not Reported"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-50 text-mauve-600 p-3 rounded-lg">
                  <TimerReset size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">SOC Last Updated</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {truck?.timeDifference !== null
                      ? `${truck.socData?.timeDifference.toFixed(2)} minutes ago`
                      : "Not Reported"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-50 text-mauve-600 p-3 rounded-lg">
                  <TimerReset size={22} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Speed Last Updated</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {truck?.timeDifference !== null
                      ? `${truck.speedData?.timeDifference.toFixed(2)} minutes ago`
                      : "Not Reported"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-xl bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Battery Performance
            </h2>
            <p className="text-sm text-gray-500 mb-5">SOC history over time</p>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sortByAssc}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="event_time"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString()
                  }
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="signals.soc"
                  stroke="#2563eb"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center w-full h-[70vh]">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
};

export default TruckData;
