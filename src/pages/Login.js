import React from 'react'
import firebase from 'firebase'
import { Redirect, Link } from 'react-router-dom'
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
        this.setState({ loader: true })
        const { email, password } = this.state
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(() => {
                this.setState({ redirect: true })
            })
            .catch(() => {
                this.setState({ loader: false, error: "email ou mot de passe incorrect" })
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
        let classNamError = ""
        if (this.state.error.length > 0) {
            classNamError = "error"
        }
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/' />;
        }
        return (
            <div className="parent-form">
                <h2 className="title">Connectez-vous !</h2>
                <form onSubmit={this.handleSubmit} className="form">
                    <label className="label">
                        email
                        </label>
                    <input className="input" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                    <label className="label">
                        mot de passe
                        </label>
                    <input className="input" type="text" name="password" value={this.state.password} onChange={this.handleChange} />
                    <input className="button" type="submit" value="Envoyer" />
                </form>
                {this.state.loader ? <LoaderCircle /> : <p className={classNamError}>{this.state.error}</p>}
                <p className="title">Tu n'as pas de compte ? <Link className="link" to="/signup">inscris toi</Link></p>
            </div>
        )
    }
}