import React, {Component} from 'react';
import './link-button.less'

/**
 *
 */
export default class LinkButton extends Component {
    render() {
        return (
            <button className='linkButton' {...this.props}>
                {this.props.children}
            </button>
        );
    }
}