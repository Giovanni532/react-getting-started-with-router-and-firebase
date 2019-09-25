import React from 'react'
import firebase from 'firebase'
import { Redirect } from 'react-router-dom'
import LoaderCircle from '../loaders/LoaderCircle'

export default class Signup extends React.Component {
    constructor() {
        super()

        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            redirect: false,
            error: "",
            loader: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    signupOnPress = () => {
        this.setState({ loader: true })
        const { email, password, confirmPassword } = this.state
        if (password === confirmPassword) {
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    this.setState({ redirect: true })
                })
                .catch(() => {
                    this.setState({ loader: false, error: "l'email est deja dans la base de donnees"})
                })
        } else {
            this.setState({ loader: false, error: "vos mot de passe ne correspondent pas" })
        }
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
        this.signupOnPress()
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
                    <label>
                        confirmer mot de passe:
                        <input type="text" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Envoyer" />
                </form>
                {this.state.loader ? <LoaderCircle/> : <p>{this.state.error}</p>}
            </div>
        )
    }
}