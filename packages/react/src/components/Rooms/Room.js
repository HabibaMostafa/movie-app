// used examples from https://mui.com/components/tabs/

import React from "react";
import Nominations from "./TabPanels/Nominations";
import RoomMatches from "./TabPanels/RoomMatches";
import Members from "./MembersPanel/Members";
import Details from "./TabPanels/Details";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
        tabIndex: index,
    };
}

const tabStyling = {
    color: "white",
};

class Room extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;
        this.state = {
            room: undefined,
            selectedTab: 0,
            roomId: "",
            userId: "",
            remountKey: new Date().getTime(),
        };
    }

    componentDidMount() {
        this.setState({ room: this.props.room });
        this.setState({ roomId: this.props.room._id });
        this.setState({ userId: this.props.userId });
    }

    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({ remountKey: new Date().getTime() });
        }
    }

    tabHandleChange = (e) => {
        this.setState({ selectedTab: e.target.tabIndex });
    };
    render() {
        if (
            this.props.room !== undefined &&
            this.props.room !== null &&
            Object.keys(this.props.room).length > 0
        ) {
            return (
                <div className="room-container">
                    <h1>Room: {this.props.room.roomName}</h1>
                    {/* tabs containing room matches, room details(members, etc),  */}

                    <Box sx={{ width: "100%" }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <Tabs
                                value={this.state.selectedTab}
                                onChange={this.tabHandleChange}
                                aria-label="basic tabs example"
                            >
                                <Tab
                                    label="Nominations"
                                    {...a11yProps(0)}
                                    sx={tabStyling}
                                />
                                <Tab
                                    label="Matches"
                                    {...a11yProps(1)}
                                    sx={tabStyling}
                                />
                                <Tab
                                    label="Members"
                                    {...a11yProps(2)}
                                    sx={tabStyling}
                                />
                                <Tab
                                    label="Room Details"
                                    {...a11yProps(3)}
                                    sx={tabStyling}
                                />
                            </Tabs>
                        </Box>
                        <TabPanel value={this.state.selectedTab} index={0}>
                            <Nominations
                                roomId={this.props.room._id}
                                userId={this.state.userId}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.selectedTab} index={1}>
                            <RoomMatches
                                roomId={this.props.room._id}
                                userId={this.state.userId}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.selectedTab} index={2}>
                            <Members
                                key={this.state.remountKey}
                                roomId={this.props.room._id}
                                userId={this.state.userId}
                            />
                        </TabPanel>
                        <TabPanel value={this.state.selectedTab} index={3}>
                            <Details
                                roomId={this.props.room._id}
                                userId={this.state.userId}
                            />
                        </TabPanel>
                    </Box>
                </div>
            );
        } else {
            return <div className="room-container">Please Select a Room</div>;
        }
    }
}

export default Room;
