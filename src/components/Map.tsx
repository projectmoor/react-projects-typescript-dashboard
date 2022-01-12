import * as React from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { IndexedAccessType } from "typescript";

// Props type for Marker Component
interface MarkerProps extends google.maps.MarkerOptions {
  total: number;
  index: number;
}

// Marker component (child of Map Component)
const Marker: React.FC<MarkerProps> = ({index, total, label, ...options}) => {
  console.log('Marker Props: ', options)
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        console.log('remove marker')
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    const carIcon = {
      path: "M 624 352 h -16 V 243.9 c 0 -12.7 -5.1 -24.9 -14.1 -33.9 L 494 110.1 c -9 -9 -21.2 -14.1 -33.9 -14.1 H 416 V 48 c 0 -26.5 -21.5 -48 -48 -48 H 48 C 21.5 0 0 21.5 0 48 v 320 c 0 26.5 21.5 48 48 48 h 16 c 0 53 43 96 96 96 s 96 -43 96 -96 h 128 c 0 53 43 96 96 96 s 96 -43 96 -96 h 48 c 8.8 0 16 -7.2 16 -16 v -32 c 0 -8.8 -7.2 -16 -16 -16 Z M 160 464 c -26.5 0 -48 -21.5 -48 -48 s 21.5 -48 48 -48 s 48 21.5 48 48 s -21.5 48 -48 48 Z m 320 0 c -26.5 0 -48 -21.5 -48 -48 s 21.5 -48 48 -48 s 48 21.5 48 48 s -21.5 48 -48 48 Z m 80 -208 H 416 V 144 h 44.1 l 99.9 99.9 V 256 Z",
      fillColor: "blue",
      fillOpacity: Math.pow((index+1)/total, 2),
      strokeWeight: 0,
      rotation: 0,
      scale: 0.05,
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(312, 450)
    }
    const squareIcon = {
      path: "M0,0 50,0 50,50 0,50",
      fillColor: "blue",
      fillOpacity: Math.pow((index+1)/total, 2),
      strokeWeight: 0,
      rotation: 0,
      scale: 0.2,
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(25, 35)
    }
    if (marker) {
      if (index === total - 1) { // render the last data with label and car icon
        marker.setOptions({...options, icon: carIcon, label});
      } else if (index === 0){ // render the first data with label and square icon
        marker.setOptions({...options, icon: squareIcon, label});
      } else { // render the rest data with square icon
        marker.setOptions({...options, icon: squareIcon});
      }
    }
  }, [marker, options]);

  return null;
};

// Props type for Map Component
interface MapProps extends google.maps.MapOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

// Map Component
const Map: React.FC<MapProps> = ({children, center}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();
  const style= { flexGrow: "1", height: "100%" };

  React.useEffect(() => {
    console.log('Map useEffect ran');
    if (ref.current) {
      console.log('New Map created!')
      setMap(new window.google.maps.Map(ref.current, {
        center,
        zoom: 17
      }));
    }
  }, [ref, center]);

  // const icon = {
  //   path: "M 624 352 h -16 V 243.9 c 0 -12.7 -5.1 -24.9 -14.1 -33.9 L 494 110.1 c -9 -9 -21.2 -14.1 -33.9 -14.1 H 416 V 48 c 0 -26.5 -21.5 -48 -48 -48 H 48 C 21.5 0 0 21.5 0 48 v 320 c 0 26.5 21.5 48 48 48 h 16 c 0 53 43 96 96 96 s 96 -43 96 -96 h 128 c 0 53 43 96 96 96 s 96 -43 96 -96 h 48 c 8.8 0 16 -7.2 16 -16 v -32 c 0 -8.8 -7.2 -16 -16 -16 Z M 160 464 c -26.5 0 -48 -21.5 -48 -48 s 21.5 -48 48 -48 s 48 21.5 48 48 s -21.5 48 -48 48 Z m 320 0 c -26.5 0 -48 -21.5 -48 -48 s 21.5 -48 48 -48 s 48 21.5 48 48 s -21.5 48 -48 48 Z m 80 -208 H 416 V 144 h 44.1 l 99.9 99.9 V 256 Z",
  //   fillColor: "blue",
  //   fillOpacity: 0.6,
  //   strokeWeight: 0,
  //   rotation: 0,
  //   scale: 0.05,
  //   origin: new window.google.maps.Point(0, 0),
  //   anchor: new window.google.maps.Point(312, 450)
  // }
  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};


// Props type for MapContainer
interface MapContainerProps { 
  gps: {time: string, lat: number, lng: number}[]
}; 

// Map Container Component, wrap around Map component.
const MapContainer: React.FC<MapContainerProps> = ({gps}) => {

  const [coordinates, setCoordinates] = React.useState<google.maps.LatLngLiteral[]>([]);
  const [times, setTimes] = React.useState<string[]>([]);

  // run when gps data updates
  React.useEffect(() => {
    if(gps.length){
      console.log('MapContianer recieved updated gps data', gps)
      setCoordinates(gps.map(el => ({
        lat: el.lat,
        lng: el.lng
      })));
      setTimes(gps.map(el => el.time));
    }
  }, [gps]);

  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY as string;

  // ussed in <Wrapper>
  const render = (status: Status): React.ReactElement => {
    if(status === Status.FAILURE){
      return <h1>Failed to load google map...</h1>
    }
    return <h1>Loading google map...</h1>
  };

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <Wrapper apiKey={GOOGLE_API_KEY} render={render}> 
        <Map center={coordinates[coordinates.length -1]}>
          {times.map( (time, index) =>
            <Marker key={index} position={coordinates[index]} label={time} total={coordinates.length} index={index}/>
          )}
        </Map>
      </Wrapper>
    </div>
  );
};


export default MapContainer;
