import React from 'react';
import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chuck_Norris%2C_The_Delta_Force_1986.jpg/800px-Chuck_Norris%2C_The_Delta_Force_1986.jpg',
      name: 'Chuck Norris',
      places: 5,
    },
    {
      id: 'u2',
      image:
        'https://aller.fi/wp-content/uploads/2023/06/Matti-Elama-on-laiffii-scaled.jpg',
      name: 'Matti Nykänen',
      places: 2,
    },
  ];

  return <UsersList items={USERS} />;
};

export default Users;
