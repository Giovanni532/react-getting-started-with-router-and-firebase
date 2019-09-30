import React from 'react'

export default class ProgressBar extends React.Component {
    render() {
        return (
            <div class="progress">
                <div class="progress-bar" role="progressbar" style={{width: this.props.progress}} aria-valuenow={0} aria-valuemin={0} aria-valuemax={100}>{this.props.progress}%</div>
            </div>
        )
    }
}