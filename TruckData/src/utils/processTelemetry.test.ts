import { describe, expect, it } from "vitest";
import { groupTruckData, lastestSoc, lastestSppeed, TruckData } from "./processTelemetry";

describe("TruckData",()=>{ //removing duplicates
    it("should remove the duplicate IDS",()=>{
        const result = TruckData()

        const packetIds = result.map((item:any) => item.packet_id);

         expect(new Set(packetIds).size).toBe(packetIds.length);
    })
})

describe("GroupData", () => {//grouping of trucks
  it("should group all trucks according to their ID", () => {
    const result = groupTruckData();

    expect(Object.keys(result).length).toBe(50);

    Object.keys(result).forEach((vehicle) => {
      result[vehicle].forEach((packet: any) => {
        expect(packet.vehicle_id).toBe(vehicle);
      });
    });
  });
});

describe("Latest SOC", () => {// latest soc
  it("should return SOC from the latest event_time", () => {
    const data = [
      {
        packet_id: "t01-001",
        event_time: "2026-10-29T07:30:00Z",
        signals: { soc: 60 },   
      },
      {
        packet_id: "t01-002",
        event_time: "2026-10-29T07:15:00Z",
        signals: { soc: 80 },
      },
    ];

    const result = lastestSoc(data);

    expect(result).toBe(60);
  });
});


it("should return latest speed based on event_time", () => {// get the latest speed
  const data = [
    {
      event_time: "2026-10-29T07:40:00Z",
      signals: { speed: 40 },
    },
    {
      event_time: "2026-10-29T08:00:00Z",
      signals: { speed: 70 },
    },
  ];

  expect(lastestSppeed(data)).toBe(70);
});


it("should return Not Reported when SOC is missing", () => {
  const data = [
    {
      event_time: "2026-10-29T07:40:00Z",
      signals: { speed: 60 },
    },
  ];

  expect(lastestSoc(data)).toBe("Not Reported");
});

it("should return Not Reported when spped is missing", () => {
  const data = [
    {
      event_time: "2026-10-29T07:40:00Z",
      signals: { soc: 60 },
    },
  ];

  expect(lastestSppeed(data)).toBe("Not Reported");
});