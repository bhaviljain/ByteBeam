import {
  Chip,
  InputBase,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FleetData } from "../utils/processTelemetry";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Status } from "../utils/type";
import { User, XIcon } from "lucide-react";
import DashBoard from "./DashBoard";

const data = FleetData();

const FleetTable = () => {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState(data);
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();

  const handleTruckDetails = (truckId: string) => {
    navigate(`/trucks/${truckId}`);
  };

  const handleSearch = (value: string) => {
    setSearch(value);

    const search = data?.filter((item) =>
      item?.vehicle?.toLowerCase().includes(value.toLowerCase()),
    );
    setSearchData(search);
  };

  const handleFilter = (filter: string) => {
    if (filter === "All") {
      setSearchData(data);
      setFilter(filter);
      return;
    }
    setFilter(filter);

    const filteredData = data?.filter((item) => item?.batterStatus === filter);

    setSearchData(filteredData);
  };

  const emptySearch = () =>{
    setSearch("")
    setFilter("All")
    setSearchData(data)
  }

  return (
    <div>
      <div className="flex justify-between  gap-2 text-sm">
        <div className="flex gap-2 flex-col sm:flex-row">
          <div className="relative">
        <InputBase
          className="border sm:w-[350px] w-[200px] border-gray-400 px-3 py-0.5 rounded-md"
          value={search}
          placeholder="Search truck"
          onChange={(e: any) => handleSearch(e.target.value)}
        />
        {search?.length > 1 && <button className="absolute p-1 right-2 mt-1.5 cursor-pointer" onClick={emptySearch}>
        <XIcon className="h-4 w-4"/>
        </button>}
        </div>
        <Select
          value={filter}
          onChange={(e: any) => handleFilter(e.target.value)}
          sx={{
            "& .MuiSelect-select": {
              padding: "4px 8px",
            },
          }}
        >
          {filter}
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Critical Battery">Critical</MenuItem>
          <MenuItem value="Low Battery">Low</MenuItem>
          <MenuItem value="No Recent Data">No recent data</MenuItem>
          <MenuItem value="OK">Ok</MenuItem>
        </Select>
        </div>
        <div>
        <User />
        </div>
      </div>
            <DashBoard data={data}/>

      <TableContainer className="border border-gray-300 rounded-md mt-4 shadow-sm">
        <Table>
          <TableHead>
            <TableRow >
              <TableCell className="!font-semibold uppercase">Truck</TableCell>
              <TableCell className="!font-semibold uppercase">Latest SOC</TableCell>
              <TableCell className="!font-semibold uppercase">Last Speed</TableCell>
              <TableCell className="!font-semibold uppercase">Last Seen</TableCell>
              <TableCell className="!text-right !font-semibold uppercase">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchData?.length > 0 ? (
              <>
                {searchData?.map((data) => (
                  <TableRow
                    onClick={() => handleTruckDetails(data?.vehicle)}
                    key={data?.vehicle}
                    className="cursor-pointer hover:bg-gray-200/90"
                  >
                    <TableCell>{data?.vehicle}</TableCell>
                    <TableCell>{data?.lastSoc}</TableCell>
                    <TableCell>{data?.lastSpeed}</TableCell>
                    <TableCell>{data?.lastSeen}</TableCell>
                    <TableCell className="!text-right">
                      <Chip
                        label={data?.batterStatus}
                        color={
                          data?.batterStatus === Status.OK
                            ? "success"
                            : data?.batterStatus === Status.LOW
                              ? "warning"
                              : data?.batterStatus === Status.CRITICAL
                                ? "error"
                                : "default"
                        }
                      ></Chip>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableCell
                colSpan={5}
                align="center"
                sx={{ height: 200, verticalAlign: "middle" }}
              >
                No data found for {search}
              </TableCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FleetTable;
