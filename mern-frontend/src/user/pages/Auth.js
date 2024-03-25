import React, { useState, useContext } from 'react';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { ColorRing } from 'react-loader-spinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { API_USER_LOGIN_URL, API_USER_SIGN_UP_URL } from '../../constants';
// import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import './Auth.css';

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          // image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
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
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();

    console.log(formState.inputs);
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          API_USER_LOGIN_URL,
          'POST',
          { 'Content-Type': 'application/json' },
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          })
        );

        auth.login(responseData.user.id);
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        // // THIS SHOULD BE INCLUDED WITH IMAGES
        // const formData = new FormData();
        // formData.append('email', formState.inputs.email.value);
        // formData.append('name', formState.inputs.name.value);
        // formData.append('password', formState.inputs.password.value);
        // formData.append('image', formState.inputs.image.value);
        // const responseData = await sendRequest(
        //   API_USER_SIGN_UP_URL,
        //   'POST',
        //   formData
        // );

        const responseData = await sendRequest(
          `${API_USER_SIGN_UP_URL}`,
          'POST',
          { 'Content-Type': 'application/json' },
          JSON.stringify({
            name: formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          })
        );

        auth.login(responseData.user.id);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className='authentication'>
        {isLoading && <ColorRing color='orange' radius={'8px'} />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element='input'
              id='name'
              type='text'
              label='Your Name'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a name.'
              onInput={inputHandler}
            />
          )}
          {/* {!isLoginMode && (
            <ImageUpload center id='image' onInput={inputHandler} errorText='Please provide an image.'/>
          )} */}
          <Input
            id='email'
            element='input'
            type='email'
            label='E-Mail'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address.'
            onInput={inputHandler}
          />
          <Input
            id='password'
            element='input'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText='Please enter a valid password (at least 6 characters).'
            onInput={inputHandler}
          />
          <Button type='submit' disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </>
  );
};

export default Auth;
