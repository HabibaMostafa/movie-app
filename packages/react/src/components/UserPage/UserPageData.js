import React from "react";
import axios from "axios";

import UserLikes from "./UserLikes";
import UserDislikes from "./UserDislikes";

//the props: accessorId={id} userId={id} username={username}

class UserPageData extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            userLikes: [],
            userData: [],
            fetchedLikes: false,
            fetchedUserData: false,
            userDislikes: [],
            fetchedDislikes: false,
        };
    }
    getDislikeList = async () => {
        await axios
            .get(`/dislikes?user=${this.props.userId}`)
            .then((result) => {
                if (result.status === 200) {
                    this.setState({ userDislikes: result.data });
                }
            })
            .then(() => this.setState({ fetchedDislikes: true }));
    };

    getLikedList = async () => {
        await axios
            .get(`/votes?user=${this.props.userId}`)
            .then((result) => {
                if (result.status === 200) {
                    this.setState({ userLikes: result.data });
                }
            })
            .then(() => this.setState({ fetchedLikes: true }));
    };

    getUserData = async () => {
        await axios
            .get(`/users/${this.props.userId}`)
            .then((result) => {
                if (result.status === 200) {
                    this.setState({ userData: result.data });
                } else {
                    this.setState({ userData: [] });
                }
            })
            .catch((e) => {
                this.setState({ userData: [] });
                this.setState({ fetchedUserData: true });
            })
            .then(() => this.setState({ fetchedUserData: true }));
    };

    componentDidMount() {
        this.getUserData();

        this.getLikedList();

        this.getDislikeList();
    }

    render() {
        return (
            <div className="user-page-data">
                <div className="vote-section">
                    {this.state.fetchedUserData ? (
                        this.state.userData.length !== 0 ? (
                            <div>
                                <h1>{this.state.userData.username}'s Page</h1>

                                {this.state.fetchedLikes ? (
                                    this.state.userLikes.length > 0 ? (
                                        <UserLikes
                                            likes={this.state.userLikes}
                                        />
                                    ) : (
                                        <div className="vote-section">
                                            <h4>User has no likes</h4>
                                        </div>
                                    )
                                ) : (
                                    <div className="vote-section">
                                        <h4>fetching likes...</h4>
                                    </div>
                                )}

                                {this.state.fetchedDislikes ? (
                                    this.state.userDislikes.length > 0 ? (
                                        <UserDislikes
                                            dislikes={this.state.userDislikes}
                                        />
                                    ) : (
                                        <div className="vote-section">
                                            <h4>User has no dislikes</h4>
                                        </div>
                                    )
                                ) : (
                                    <div className="vote-section">
                                        <h4>fetching dislikes...</h4>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="vote-section">
                                <h4>User Not Found</h4>
                            </div>
                        )
                    ) : (
                        <div className="vote-section">
                            <h4>Loading user data</h4>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default UserPageData;
