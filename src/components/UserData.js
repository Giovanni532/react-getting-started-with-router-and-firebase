import React from 'react'
import firebase from 'firebase'
import { Redirect } from 'react-router-dom'
import LoaderCircle from '../loaders/LoaderCircle'

export default class UserData extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: "",
            firstName: "",
            lastName: "",
            notifications: "",
            edited: true,
            redirect: false,
            loaded: false
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    componentWillMount() {
        const uid = firebase.auth().currentUser.uid
        firebase.database().ref('user/' + uid).on('value', (snapshot) => {
            let user = snapshot.val()
            this.setState({
                email: firebase.auth().currentUser.email,
                firstName: user['firstName'],
                lastName: user['lastName']
            })
            if (this.state.firstName.length === 0 && this.state.lastName.length === 0) {
                this.setState({
                    notifications: "Veuillez ajoutez votre nom et prenom"
                })
            } else if (this.state.firstName.length === 0) {
                this.setState({
                    notifications: "Veuillez ajoutez votre prenom"
                })
            } else if (this.state.lastName.length === 0) {
                this.setState({
                    notifications: "Veuillez ajoutez votre nom"
                })
            } else {
                this.setState({
                    notifications: ""
                })
            }
        })
    }

    signOut = () => {
        firebase.auth().signOut()
            .then(() => {
                this.setState({ redirect: true })
            })
    }

    updateData = () => {
        this.setState({ loaded: true })
        const uid = firebase.auth().currentUser.uid
        firebase.database().ref('user/' + uid).update({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
        })
        this.setState({
            edited: true, loaded: false
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
        this.updateData()
    }

    render() {
        const { redirect } = this.state;

        if (redirect) {
            return <Redirect to='/' />;
        }
        return (
            this.state.edited ?
                <div className="parent-form">
                    <div className="form">
                        <p style={{ marginTop: 10 }}>Information sur le compte</p>
                        <p>{this.state.notifications}</p>
                        <p>votre email : {this.state.email}</p>
                        <p>votre prenom : {this.state.firstName}</p>
                        <p>votre nom : {this.state.lastName}</p>
                        <button className="button-logout" onClick={() => this.setState({ edited: false })}>Editez</button>
                        <button style={{ marginBottom: 10 }} className="button-logout" onClick={this.signOut.bind(this)}>deconnexion</button>
                    </div>
                </div>
                :
                <div className="parent-form">
                    <h2 className="title">Votre compte</h2>
                    <form onSubmit={this.handleSubmit} className="form">
                        <label className="label">
                            prenom
                    </label>
                        <input className="input" type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
                        <label className="label">
                            nom
                    </label>
                        <input className="input" type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
                        <input style={{ marginBottom: 10 }} className="button" type="submit" value="Modifier" />
                    </form>
                    {this.state.loaded ? <LoaderCircle /> : null}
                </div>
        )
    }
}