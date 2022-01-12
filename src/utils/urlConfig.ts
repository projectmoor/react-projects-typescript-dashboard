//export const api = `https://api.freedomrobotics.ai/accounts/AA2E4916C77670BAA7DA84BD4/devices/D5061657E9A0D4B5715B018EBB6/data?utc_start=-1m&utc_end=now&topics=["/vehicle/gps/fix"]`;

export const deviceDataApi = (acountId: string, deviceId: string, start: string, end: string, topics?: string): string => {
    let baseurl = `https://api.freedomrobotics.ai/accounts/${acountId}/devices/${deviceId}/data?utc_start=${start}&utc_end=${end}`;
    if(topics){
        baseurl = baseurl + `&topics=${topics}`;
    }
    return baseurl;
}