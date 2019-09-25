import React from 'react';
import { Link } from "react-router-dom";
import firebase from 'firebase'

export default class NavbarLogin extends React.Component {
    constructor() {
        super()

        this.state = {
            logged: false
        }
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
            user ? this.setState({ logged: true }) : this.setState({ logged: false })
        })
    }

    render() {
        return (
            this.state.logged ?
                <div>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/user">user</Link>
                        </li>
                    </ul>
                </div>
                :
                <div>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                    </ul>
                    <li>
                        <Link to="/login">Login</Link>
                    </li>
                    <li>
                        <Link to="/signup">Signup</Link>
                    </li>
                </div>
        )
    }
}