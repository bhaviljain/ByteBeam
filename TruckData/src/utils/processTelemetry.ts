import telemetryData from "../JsonData/telemetry.json";

export const TruckData = () => {
  //removing packet_id duplicates
  const uniqueTruckData: any = [];

  let set = new Set();
  for (let data of telemetryData) {
    if (!set.has(data?.packet_id)) {
      set.add(data?.packet_id);
      uniqueTruckData.push(data);
    }
  }
  return uniqueTruckData;
};

export const groupTruckData = () => {
  // grouping the trucks here
  let groupTruck: any = {};
  let uniqueTruckData = TruckData();
  for (let data of uniqueTruckData) {
    if (!groupTruck[data?.vehicle_id]) {
      groupTruck[data?.vehicle_id] = [];
    }
    groupTruck[data.vehicle_id].push(data);
  }
  return groupTruck;
};

export const latestData = () => {
  // we get the most recent event time from all the 50 trucks
  const stale = TruckData();
  const staleData = stale?.reduce((latest: any, current: any) =>
    new Date(latest?.event_time) > new Date(current?.event_time)
      ? latest
      : current,
  );
  return staleData;
};

export const staleData = (signal: string) => {
  //passiing soc,speed, and battery temp as arg
  const data = latestData();

  const latestDataTime = data?.event_time;
  const groupedData = groupTruckData();
  const truckIds = Object.keys(groupedData);

  const res = truckIds?.map((vehicle) => {
    const allVehicle = groupedData[vehicle];

    const soc = allVehicle?.filter(
      (data: any) => data?.signals?.[signal] != null,
    );

    if (soc.length === 0) return null;

    let result = soc?.reduce(
      (
        latest: any,
        current: any, // From here we ill get the latest eventtime for soc/speed/battery_temp
      ) =>
        new Date(latest?.event_time) > new Date(current?.event_time)
          ? latest
          : current,
    );

    const timeDifference =
      (new Date(latestDataTime).getTime() -
        new Date(result.event_time).getTime()) /
      (1000 * 60);

    const isStale = timeDifference > 10;

    return {
      vehicle,
      value: result?.signals?.[signal],
      eventTime: result?.event_time,
      isStale,
      timeDifference,
    };
  });
  return res;
};

export const lastestSoc = (seenData: any) => {
  const soc = seenData?.filter((data: any) => data?.signals?.soc != null);

  if (soc?.length === 0) {
    return "Not Reported";
  }

  let data = soc?.reduce((latest: any, current: any) =>
    new Date(latest?.event_time) > new Date(current?.event_time)
      ? latest
      : current,
  );
  return data?.signals?.soc;
};

export const lastestSppeed = (seenData: any) => {
  const soc = seenData?.filter((data: any) => data?.signals?.speed != null);

  if (soc?.length === 0) {
    return "Not Reported";
  }

  let data = soc?.reduce((latest: any, current: any) =>
    new Date(latest?.event_time) > new Date(current?.event_time)
      ? latest
      : current,
  );
  return data?.signals?.speed;
};

export const LatestSeenData = (seenData: any) => {
  let data = seenData?.reduce((latest: any, current: any) =>
    new Date(latest?.event_time) > new Date(current?.event_time)
      ? latest
      : current,
  );
  return new Date(data.event_time).toLocaleString();
};

export const FleetData = () => {
  const groupedData = groupTruckData(); //we get the groups here eg:{t1:[packet1,packet2],t2:[packet1]}
  const truckIds = Object.keys(groupedData); //storings truck id here

  const battery = getBatterStatus();

  const result = truckIds?.map((vehicle) => {
    const allVehicle = groupedData[vehicle]; // groupedData[t01],groupedData[t02]...

    const batterStatus = battery.find((v) => v?.vehicle === vehicle);

    return {
      vehicle, //vehicle_id
      lastSeen: LatestSeenData(allVehicle), //last_seen
      lastSoc: lastestSoc(allVehicle), //last_soc
      lastSpeed: lastestSppeed(allVehicle), //last_speed
      batterStatus: batterStatus?.status,
      battery: batterStatus?.batteryData?.value,
    };
  });
  return result;
};

export const getBatterStatus = () => {
  const soc = staleData("soc");
  const speed = staleData("speed");
  const battery = staleData("battery_temp");

  const truckId = Object.keys(groupTruckData());

  const result = truckId?.map((vehicle) => {
    const socData = soc?.find((item) => item?.vehicle === vehicle);
    const speedData = speed?.find((item) => item?.vehicle === vehicle);
    const batteryData = battery?.find((item) => item?.vehicle === vehicle);

    let status = "OK"; //if all 3 are not stale and soc is above 20

    if (socData?.isStale && speedData?.isStale && batteryData?.isStale) {
      status = "No Recent Data";
    } else if (socData?.value < 10) {
      status = "Critical Battery";
    } else if (socData?.value < 20) {
      status = "Low Battery";
    }

    return { vehicle, status, batteryData };
  });
  return result;
};
