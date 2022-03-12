import React from "react";
class RoomMatches extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }
        super(props);
        this.props = props;
    }

    render() {
        if (true) {
            return (
                <div>
                    <p>Room Matches</p>

                    <p>roomId: {this.props.roomId}</p>
                    <p>user: Id {this.props.userId}</p>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}
export default RoomMatches;
