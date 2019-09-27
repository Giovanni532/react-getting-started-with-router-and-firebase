import React from 'react'
import { Redirect, Route } from "react-router-dom";
import firebase from 'firebase/app'


export const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        firebase.auth().currentUser ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}