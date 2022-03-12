import React from "react";
import axios from "axios";

class AddMember extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;
        // this.state = {nonmembers: []}
    }

    componentDidMount() {}
    render() {
        if (true) {
            return <div className="add-member-container">Add members here</div>;
        }
    }
}

export default AddMember;
