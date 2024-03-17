import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import './PlaceList.css';

const PlaceList = (items) => {
  if (items.length === 0) {
    return (
      <div className='place-list center'>
        <Card>
          <h2>No Places found. Maybe create on?</h2>
          <button>Share Place</button>
        </Card>
      </div>
    );
  }

  return (
    <ul className='place-list'>
      {items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.imageUrl}
          title={place.title}
          description={place.description}
          address={place.address}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
