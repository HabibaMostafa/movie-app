import React from "react";
import axios from "axios";

import FriendMatches from "../../components/Matches/FriendMatches";

class MatchList extends React.Component {
    constructor(props) {
        super(props);

        // needs to equal [] bc react renders twice since theres component did mount...
        // this.state = { userFriends: [] };
        // this.userToAdd = null;
        this.state = { userFriends: [] };
    }
    componentDidMount() {
        const params = {
            user: this.props._id,
        };

        axios.post("/friend/user-friends", params).then((res) => {
            if (res.status === 200) {
                this.setState({ userFriends: res.data });
            } else {
                this.setState({ userFriends: [] });
            }
        });
    }

    render() {
        return (
            <div className="matchList">
                <FriendMatches />
                {this.state.userFriends.map((value) => (
                    <FriendMatches friend={value} _id={this.props._id} />
                ))}

            </div>
        );
    }
}

export default MatchList;
