import React from "react";

class UserPageData extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {userLikes: [], fetchedLikes: false};
    }

    componentDidMount() {

    }

    render() {
        return <div>{this.props.userId}</div>;
    }
}

export default UserPageData;
