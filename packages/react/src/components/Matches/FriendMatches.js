import React from "react";
import axios from "axios";

class FriendMatches extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;

        this.state = { friendName: [], friend: [] };
    }
    componentDidMount() {
        // need to have this in a if statement or else it breaks,
        // whhhhhhhhhhhhhhhhhhhhhyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
        // fight me react.js
        if (this.props.friend !== undefined) {
            this.setState({ friendName: this.props.friend.name });
            this.setState({ friend: this.props.friend });
        }
    }

    render() {
        // just return a blank div if props is undefined...
        // theres always an extra blank call from the matchlist render
        // despite there being x elements in the friends array, there will always be
        // x + 1 calls, with the 1 being an empty object
        // this is just a band aid....
        if (this.props.friend === undefined) {
            return(<div></div>);
        }

        return (
            <div className="friendMatches">
                <h3 class="match-friend">{this.state.friendName}</h3>
                <p>----------list of all movies that were matched</p>
            </div>
        );

    }
}

export default FriendMatches;
