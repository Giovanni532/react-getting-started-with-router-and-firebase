import React from 'react'
import firebase from 'firebase'
import { Redirect } from 'react-router-dom'

export default class UserAccount extends React.Component {
    constructor() {
        super()

        this.state = {
            redirect: false
        }
    }

    signOut = () => {
        firebase.auth().signOut()
            .then(() => {
                this.setState({ redirect: true })
            })
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/login' />;
        }
        return (
            <div>
                <p>UserAccount</p>
                <button onClick={this.signOut.bind(this)}>deconnexion</button>
            </div>
        )
    }
}