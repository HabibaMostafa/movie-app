import React from "react";
import axios from "axios";

import FriendMatches from "../../components/Matches/FriendMatches";


import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

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
                {this.state.userFriends.map((value) => (
                    <FriendMatches friend={value} _id={this.props._id} />
                ))}


                {/* <ImageList sx={{ width: 500, height: 450 }} cols={3} rowHeight={164}>
                {this.state.userFriends.map((value) => (
                    // <ImageListItem key={item.img}>
                    // <img
                    //     src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                    //     srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    //     alt={item.title}
                    //     loading="lazy"
                    // />
                    // </ImageListItem>
                    <FriendMatches friend={value} _id={this.props._id} />
                ))}
                </ImageList> */}

            </div>
        );
    }
}

export default MatchList;
