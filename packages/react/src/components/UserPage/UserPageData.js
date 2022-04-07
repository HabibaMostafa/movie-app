import React from "react";
import axios from "axios";

import UserLikes from "./UserLikes";

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
        };
    }

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
                console.log(result);
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
        // fetch the user likes.
        this.getUserData();
        this.getLikedList();
    }

    render() {
        // check if authorized to see this page,
        // check if accessor and userId are the same or
        // if accessor and userId are friends.
        console.log(this.state.userData);

        return (
            <div className="user-page-data">


                {this.state.fetchedUserData ? (
                    this.state.userData.length !== 0 ? (
                        <div>

                            <h1>{this.state.userData.username}'s Page</h1>
                            <br/>

                            {this.state.fetchedLikes ? (
                                this.state.userLikes.length > 0 ? (
                                    <UserLikes likes={this.state.userLikes} />
                                ) : (
                                    <div>User has no likes...</div>
                                )
                            ) : (
                                <div>fetching likes...</div>
                            )}

                        </div>
                    ) : (
                        <div>User Not Found</div>
                    )
                ) : (
                    // console.log(this.state)
                    <div>Loading user data</div>
                )}
            </div>
        );
    }
}

export default UserPageData;
