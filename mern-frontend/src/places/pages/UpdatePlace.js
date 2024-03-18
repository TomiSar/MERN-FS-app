import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { ThreeCircles } from 'react-loader-spinner';
import Card from '../../shared/components/UIElements/Card';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import './PlaceForm.css';

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

const UpdatePlace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const identifiedPlace = DUMMY_PLACES.find((place) => place.id === placeId);

  useEffect(() => {
    if (identifiedPlace) {
      setFormData(
        {
          title: {
            value: identifiedPlace.title,
            isValid: true,
          },
          description: {
            value: identifiedPlace.description,
            isValid: true,
          },
        },
        true
      );
    }
    setIsLoading(false);
  }, [setFormData, identifiedPlace]);

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlace) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='center'>
        <ThreeCircles color='orange' radius={'8px'} />
      </div>
    );
  }

  return (
    <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
      <Input
        id='title'
        element='input'
        type='text'
        label='Title'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid title.'
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id='description'
        element='textarea'
        label='Description'
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText='Please enter a valid description (min length 5 characters).'
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type='submit' disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
  );
};

export default UpdatePlace;
