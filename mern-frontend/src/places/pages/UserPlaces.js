import React, { useState, useEffect } from 'react';
import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useParams } from 'react-router-dom';
import { API_PLACES_BY_USERID_URL } from '../../constants';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { ColorRing } from 'react-loader-spinner';

const UserPlaces = () => {
  const [fetchedPlaces, setFetchedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${API_PLACES_BY_USERID_URL}/${userId}`
        );
        setFetchedPlaces(responseData.places);
      } catch (error) {}
    };
    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setFetchedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <ColorRing color='orange' radius={'8px'} />
        </div>
      )}
      {!isLoading && fetchedPlaces && (
        <PlaceList items={fetchedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </>
  );
};

export default UserPlaces;
