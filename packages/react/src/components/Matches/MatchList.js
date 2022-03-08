import React from "react";
import axios from "axios";

import FriendMatches from "../../components/Matches/FriendMatches";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import loading from "./loading.gif";

class MatchList extends React.Component {
    constructor(props) {
        super(props);

        // needs to equal [] bc react renders twice since theres component did mount...
        // this.state = { userFriends: [] };
        // this.userToAdd = null;
        this.state = { userFriends: [], loading: true };
    }
    componentDidMount() {
        const params = {
            user: this.props._id,
        };

        this.setState({ loading: true });

        axios.post("/matches/check", { userId: this.props._id }).then((lol) => {
            axios.post("/friend/user-friends", params).then((res) => {
                if (res.status === 200) {
                    this.setState({ userFriends: res.data });
                } else {
                    this.setState({ userFriends: [] });
                }

                this.setState({ loading: false });
            });
        });

        //check for any new matches with friends here...
    }

    render() {
        if (this.state.loading) {
            return <img src={loading}></img>;
        } else {
            return (
                <div className="matchList">
                    {this.state.userFriends.map((value) => (
                        <FriendMatches friend={value} _id={this.props._id} />
                    ))}
                </div>
            );
        }
    }
}

export default MatchList;
