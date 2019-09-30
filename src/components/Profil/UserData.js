/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import firebase from 'firebase/app'
import { Redirect } from 'react-router-dom'
import LoaderCircle from '../../loaders/LoaderCircle'
import FileUploader from 'react-firebase-file-uploader'
import image from '../../assets/userprofile.png'
import ProgressBar from '../../helpers/progressBar'

export default class UserData extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            email: firebase.auth().currentUser.email,
            firstName: "",
            lastName: "",
            edited: true,
            redirect: false,
            loaded: false,
            image: "",
            imageUrl: image,
            progress: 0,
            uid: firebase.auth().currentUser.uid
        }

        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }


    fetchUserData = async () => {
        firebase.storage().ref('avatars/' + this.state.uid).list().then(filename => {
            if (filename.items.length !== 0) {
                this.setState({ image: filename.items[0].name })
                firebase.storage().ref('avatars/' + this.state.uid + '/' + this.state.image).getDownloadURL()
                    .then(url => {
                        this.setState({ imageUrl: url })
                    })
            }
        })

        firebase.database().ref('user/' + this.state.uid).on('value', (snapshot) => {
            let user = snapshot.val()
            this.setState({
                firstName: user['firstName'],
                lastName: user['lastName']
            })
        })
    }

    UNSAFE_componentWillMount() {
        this.fetchUserData()
    }

    signOut = () => {
        firebase.auth().signOut()
            .then(() => {
                this.setState({ redirect: true })
            })
    }

    updateData = () => {
        this.setState({ loaded: true })
        firebase.database().ref('user/' + this.state.uid).update({
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


    handleUploadStart = () => {
        this.setState({ progress: 0 })
    }

    fileOnProgress = progress => {
        this.setState({progress: progress})
    }

    handleUploadSucces = filename => {
        let deleteImage = this.state.image
        if (this.state.image !== filename) {
            this.setState({
                image: filename,
                progress: 100
            })
            firebase.storage().ref('avatars/' + this.state.uid).child(deleteImage).delete()
        }

        firebase.storage().ref('avatars/' + this.state.uid).child(filename).getDownloadURL()
            .then(url => this.setState({
                imageUrl: url
            }))
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
            <div>
                <div className="parent-form">
                    <div className="form">
                        <p style={{ marginTop: 10 }}>Information sur le compte</p>
                        <img className="image-profil" src={this.state.imageUrl} />
                        <p>votre email : {this.state.email}</p>
                        <p>votre prenom : {this.state.firstName}</p>
                        <p>votre nom : {this.state.lastName}</p>
                        <button className="button-logout" onClick={() => this.setState({ edited: false })}>Editez</button>
                        <button style={{ marginBottom: 10 }} className="button-logout" onClick={this.signOut.bind(this)}>deconnexion</button>
                    </div>
                </div>
            </div>
                :
                <div className="parent-form">
                    <h2 className="title">Votre compte</h2>
                    <form onSubmit={this.handleSubmit} className="form">
                        <FileUploader
                            accept="image/*"
                            name="image"
                            onUploadStart={this.handleUploadStart}
                            storageRef={firebase.storage().ref('avatars/' + this.state.uid)}
                            onUploadSuccess={this.handleUploadSucces}
                            onProgress={this.fileOnProgress}
                        />
                        {this.state.progress === 0 ? null : <ProgressBar progress={this.state.progress}/>}
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