import { useContext } from 'react';
import { useHistory } from 'react-router-dom/';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { API_PLACES_BASE_URL } from '../../constants';
import { AuthContext } from '../../shared/context/auth-context';
import { ColorRing } from 'react-loader-spinner';
// import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false,
      },
      description: {
        value: '',
        isValid: false,
      },
      address: {
        value: '',
        isValid: false,
      },
      // image: {
      //   value: null,
      //   isValid: false,
      // },
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      // // THIS SHOULD BE INCLUDED WITH IMAGES
      // const formData = new FormData();
      // formData.append('title', formState.inputs.title.value);
      // formData.append('description', formState.inputs.description.value);
      // formData.append('address', formState.inputs.address.value);
      // formData.append('creator', auth.userId);
      // formData.append('image', formState.inputs.image.value);
      // await sendRequest(API_PLACES_BASE_URL, 'POST', formData);
      // history.push('/');

      await sendRequest(
        API_PLACES_BASE_URL,
        'POST',
        { 'Content-Type': 'application/json' },
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
          address: formState.inputs.address.value,
          creator: auth.userId,
        })
      );
      history.push('/');
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <ColorRing color='orange' radius={'8px'} />}
      <form className='place-form' onSubmit={placeSubmitHandler}>
        <Input
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid title.'
          onInput={inputHandler}
        />
        <Input
          id='description'
          element='textarea'
          label='Description'
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText='Please enter a valid description (at least 5 characters).'
          onInput={inputHandler}
        />
        <Input
          id='address'
          element='input'
          label='Address'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid address.'
          onInput={inputHandler}
        />
        {/* THIS SHOULD BE INCLUDED WITH IMAGES
        <ImageUpload
          id='image'
          onInput={inputHandler}
          errorText='Please provide an image.'
        /> */}
        <Button type='submit' disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </>
  );
};

export default NewPlace;
