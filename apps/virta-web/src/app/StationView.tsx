import { useMemo, useState } from 'react';
import { useQuery, gql } from 'urql';

import debounce from 'lodash-es/debounce';

import L from 'leaflet';
import iconImage from 'leaflet/dist/images/marker-icon.png';

import 'leaflet/dist/leaflet.css';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
  useMapEvents,
} from 'react-leaflet';
import { Container, Flex, Select } from '@mantine/core';

const icon = L.icon({
  iconUrl: iconImage,
  iconSize: [25, 41],
  iconAnchor: [12, 10],
});

const CompaniesQuery = gql(`
  query {
    Companies {
      id
      name
    }
  }
`);

const StationQuery = gql(`
  query ($coords: CoordinatesInput!, $distanceInKm: Float!, $companyId: Int!) {
    findAllChildStations(
      coords: $coords
      distanceInKm: $distanceInKm
      companyId: $companyId
    ) {
      coordinates ){
        x
        y
      }
      stations {
        id
        name
        address
      }
    }
  }
`);

type Coordinates = {
  x: number;
  y: number;
};

interface IMapEventsComponentProps {
  setCoords: React.Dispatch<React.SetStateAction<Coordinates>>;
  setDistanceInKm: React.Dispatch<React.SetStateAction<number>>;
}

const MapEventsComponent: React.FC<IMapEventsComponentProps> = ({
  setCoords,
  setDistanceInKm,
}) => {
  const map = useMapEvents({
    moveend: debounce(() => {
      const center = map.getCenter();
      const bounds = map.getBounds();
      setCoords({
        x: center.lat,
        y: center.lng,
      });
      const distance =
        bounds.getNorthWest().distanceTo(bounds.getSouthEast()) / 1000;

      // float to int

      setDistanceInKm(distance);
    }, 1000),
  });

  return null;
};

export const StationsView: React.FC = () => {
  const [coords, setCoords] = useState<Coordinates>({
    // random coords in Helsinki
    x: 60.1699,
    y: 24.9384,
  });
  const [distanceInKm, setDistanceInKm] = useState<number>(5);
  const [companyId, setCompanyId] = useState<number>(1);

  const [stations] = useQuery({
    query: StationQuery,
    variables: {
      coords: coords,
      distanceInKm: distanceInKm,
      companyId: companyId,
    },
  });

  const [companies] = useQuery({
    query: CompaniesQuery,
  });

  const companySelectData = useMemo(
    () =>
      (companies.data?.Companies || []).map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    [companies]
  );

  return (
    <Container h={'1024px'}>
      <Flex>
        <Select
          label={'Select company'}
          data={companySelectData}
          placeholder={'Select company'}
          style={{
            zIndex: 1000,
          }}
          onChange={(value: string) => {
            setCompanyId(parseInt(value));
          }}
        />
      </Flex>
      <MapContainer
        center={[coords.x, coords.y]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '100%', height: 'calc(1024px - 4rem)' }}
      >
        <MapEventsComponent
          setCoords={setCoords}
          setDistanceInKm={setDistanceInKm}
        />
        <ScaleControl position="topleft" />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {stations.data?.findAllChildStations?.map((stationGroup: any) => (
          <Marker
            key={stationGroup.id}
            position={[stationGroup.coordinates.x, stationGroup.coordinates.y]}
            icon={icon}
          >
            {stationGroup.stations.map((station: any) => (
              <Popup key={station.id}>
                {station.name} {station.address}
              </Popup>
            ))}
          </Marker>
        ))}
      </MapContainer>
    </Container>
  );
};
