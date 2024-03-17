import { useParams } from 'react-router-dom';
import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
    location: {
      lat: 40.7484445,
      lng: -73.9882393,
    },
  },
  {
    id: 'p2',
    title: 'Skatepark Of Tampa',
    description: 'One of the most famous Skatepark inf Florida',
    imageUrl:
      'https://static.wixstatic.com/media/656baf_bfdfed7d67684b4485c5182f0b3cce78~mv2.jpg/v1/fill/w_830,h_414,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/SPoT-Course-2022-00007.jpg',
    address: 'E Columbus Dr, Tampa, FL 33605',
    creator: 'u1',
    location: {
      lat: 27.9661167,
      lng: -82.4130512,
    },
  },
  {
    id: 'p3',
    title: 'Lahden mäkihyppytorni',
    description: 'Most epic Ski jump tower in Lahti',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Lahti_Ski_Jumping_Hills_2.jpg/1920px-Lahti_Ski_Jumping_Hills_2.jpg',
    address: 'Suurmäenkatu 5, 15110 Lahti',
    creator: 'u2',
    location: {
      lat: 60.9841003,
      lng: 25.6238777,
    },
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
