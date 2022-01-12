export interface DeviceData {
  topic: string;
  platform: string;
  type: string;
  utc_time: number;
  data: {latitude: number, longitude: number};
  account: string;
  device: string;
  utc_time_api_received: number;
  id: string;
}
