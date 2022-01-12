import React, { useState, useEffect, useCallback } from "react";
import { DeviceData } from "../types/deviceData.type";
import { deviceDataApi } from "../utils/urlConfig";
import MapContainer from "./Map";
import {gpstestdata} from "../test-data/vehicle-gps-fix"; // Test Data

const DashboardApp: React.FC = () => {
  const acountId = "AA2E4916C77670BAA7DA84BD4";
  const deviceId = "D5061657E9A0D4B5715B018EBB6";
  const topics = '["/vehicle/gps/fix"]';
  const url = deviceDataApi(acountId, deviceId, "-1m", "now", topics);

  // set a default data in case no data is available when user request
  const [gps, setGps] = useState<{time: string, lat: number, lng: number}[]>([{
    time:'',
    lat: 37.772115,
    lng: -122.469508
  }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  //Test Data - uncomment this code block and comment out useEffect hook below to use test data
  // useEffect(() => {
  //   const gpsData = gpstestdata.map(obj => {
  //     const time = new Date(obj.utc_time * 1000);
  //     return {time: time.toTimeString(), lat: +obj.data.latitude, lng: +obj.data.longitude }
  //   })
  //   console.log('Test data prepared in DashboardApp:', gpsData)
  //   setGps(gpsData);
  // }, [])
  
  const fetchDataHandler = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const headers: HeadersInit = {
        Accept: "application/json",
        mc_token: process.env.REACT_APP_MC_TOKEN!,
        mc_secret: process.env.REACT_APP_MC_SECRET!,
      }
      const options: RequestInit = {
        method: "GET",
        headers
      };
 
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data: DeviceData[] = await response.json();
      console.log('Raw data fetched in DashboardApp: ', data);
      if (data) {
        const gpsData = data.map(obj => {
          const time = new Date(obj.utc_time * 1000);
          const timeStr = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
          return {time: timeStr, lat: +obj.data.latitude, lng: +obj.data.longitude }
        });
        setGps(gpsData);
        setIsLoading(false);
        console.log('Gps Data prepared in DashboardApp: ', gpsData);
      }
      
    } catch (error: any) {
      setError(error.message);
    }
  }, []);

  // fetch first set of data
  useEffect(() => {
    fetchDataHandler();
  }, [fetchDataHandler]);

  // fetch new data every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDataHandler()
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <MapContainer gps={gps}/>
      {
        isLoading && <div className="msg"><h4>Loading Vehicle Position Data...</h4></div>
      }
      
    </div>
  
  )
};

export default DashboardApp;