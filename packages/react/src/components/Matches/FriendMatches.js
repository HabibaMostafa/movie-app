import React from "react";
import axios from "axios";
import "./FriendMatches.css";


import MovieListElement from "../../components/Movie/MovieListElement";

class FriendMatches extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;

        this.state = { friendName: "", friend: [], _id: "", matches: [] };
    }
    componentDidMount() {
        // need to have this in a if statement or else it breaks,
        // whhhhhhhhhhhhhhhhhhhhhyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
        // fight me react.js
        if (this.props.friend !== undefined) {
            this.setState({ friendName: this.props.friend.name });
            this.setState({ friend: this.props.friend });
            this.setState({ _id: this.props._id });

            // populate the list of matches here
            const matchQuery = {
                user1: this.props._id,
                user2: this.props.friend.userId,
            };
            axios.post("/matches", matchQuery).then((result) => {
                if (result.status === 200 && result.data.length > 0) {
                    // console.log(result.data);
                    this.setState({ matches: result.data });
                }
            });
        }
    }

    render() {
        // just return a blank div if props is undefined...
        // theres always an extra blank call from the matchlist render
        // despite there being x elements in the friends array, there will always be
        // x + 1 calls, with the 1 being an empty object
        // this is just a band aid....

        // render nothing if there are no matches
        if (this.props.friend === undefined || this.state.matches.length === 0) {
            return <div></div>;
        }

        return (
            <div className="friendMatches">
                <h3 class="match-friend">{this.state.friendName}</h3>
                {/* <p>----------list of all movies that were matched</p> */}
                {/* <p>my id: {this.state._id}</p>
                <p>friend id: {this.state.friend.userId}</p> */}
                {this.state.matches.map((value) => (
                    // <p>{value.movieID}</p>
                    <MovieListElement movieID={value.movieID} />
                ))}
            </div>
        );
    }
}

export default FriendMatches;
