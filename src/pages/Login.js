import React from 'react'
import firebase from 'firebase'
import { Redirect } from 'react-router-dom'
import LoaderCircle from '../loaders/LoaderCircle'

export default class Login extends React.Component {
    constructor() {
        super()

        this.state = {
            email: "",
            password: "",
            error: "",
            loader: false,
            redirect: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    loginOnPress = () => {
        this.setState({loader: true})
        const { email, password } = this.state
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ redirect: true })
            })
            .catch(() => {
                this.setState({loader: false, error: "email ou mot de passe incorrect"})
            })
    }

    handleChange(event) {
        const value = event.target.value
        const name = event.target.name

        this.setState({
            [name]: value
        })
    }

    handleSubmit(event) {
        event.preventDefault()
        this.loginOnPress()
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/' />;
        }
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        email:
                        <input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                    </label>
                    <label>
                        mot de passe:
                        <input type="text" name="password" value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Envoyer" />
                </form>
                {this.state.loader ? <LoaderCircle/> : <p>{this.state.error}</p>}
            </div>
        )
    }
}