import React from 'react'
import firebase from 'firebase'
import { Redirect, Link } from 'react-router-dom'
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
                    const uid = firebase.auth().currentUser.uid
                    if (uid) {
                        firebase.database().ref('user/' + uid).set({
                            email: this.state.email
                        })
                    }
                    this.setState({ redirect: true })
                })
                .catch(() => {
                    this.setState({ loader: false, error: "veuillez entrez votre identifiant ou votre email est deja enregistrer" })
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
                <h2 className="title">Inscrivez-vous !</h2>
                <form onSubmit={this.handleSubmit} className="form">
                    <label className="label">
                        email
                        </label>
                    <input className="input" type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                    <label className="label">
                        mot de passe
                        </label>
                    <input className="input" type="text" name="password" value={this.state.password} onChange={this.handleChange} />
                    <label className="label">
                        confirmer mot de passe
                        </label>
                    <input className="input" type="text" name="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} />
                    <input className="button" type="submit" value="Envoyer" />
                </form>
                {this.state.loader ? <LoaderCircle /> : <p className={classNamError}>{this.state.error}</p>}
                <p className="title">Tu as deja un compte ? <Link className="link" to="/login">connect toi !</Link></p>
            </div>
        )
    }
}