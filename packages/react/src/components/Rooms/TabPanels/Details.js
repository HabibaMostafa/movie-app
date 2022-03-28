import React from "react";
import Button from "@mui/material/Button";
import axios from "axios";

class Details extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }
        super(props);
        this.props = props;
    }

    leaveRoomHandler = async () => {
        const roomId = this.props.roomId;
        const userId = this.props.userId;

        if (roomId === undefined || userId === undefined) {
            return;
        }

        const params = {
            roomId,
            userId,
        };

        await axios
            .delete("/member", { data: params })
            .then((response) => {
                if (response.status === 200) {
                    window.location.reload(true);
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    render() {
        if (true) {
            return (
                <div>
                    <p>Room Details</p>

                    <p>roomId: {this.props.roomId}</p>
                    <p>user: Id {this.props.userId}</p>

                    <Button
                        variant="contained"
                        id="friend-request-btn"
                        onClick={this.leaveRoomHandler}
                    >
                        Leave Room
                    </Button>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}
export default Details;
