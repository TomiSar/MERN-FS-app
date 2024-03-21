import React, { useState, useEffect } from 'react';
import UsersList from '../components/UsersList';
import { API_GET_USERS_URL } from '../../constants';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { ColorRing } from 'react-loader-spinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const [fetchedUsers, setFetchedUsers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(API_GET_USERS_URL);
        setFetchedUsers(responseData.users);
      } catch (err) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <ColorRing color='orange' radius={'8px'} />
        </div>
      )}
      {!isLoading && fetchedUsers && <UsersList items={fetchedUsers} />}
    </>
  );
};

export default Users;
