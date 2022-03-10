// import React from "react";
// import axios from "axios";
// import "./Drawer.css";

// class RoomDrawer extends React.Component {
//     constructor(props) {
//         if (props === {}) {
//             return;
//         }

//         super(props);
//         this.props = props;
//     }

//     render() {
//         return (
//             <div className="drawer-container">

//             </div>
//         );
//     }
// }

// export default RoomDrawer;

import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

import Movie from "../../components/Movie/Movie";

import { styled } from "@mui/system";
import { red } from "@mui/material/colors";
import { height } from "@mui/system";
import { maxHeight } from "@mui/system";
import { sizing } from "@mui/system";
import { padding } from "@mui/system";
import { color } from "@mui/system";

const drawerWidth = 240;
const topMargin = 15;

const boxSx = {
    mt: topMargin,
    ml: `${drawerWidth}px`,
    // overflowY: "scroll",
    // overflowX: "scroll",
    // alighItems: 'center'
    width: '100%',
};

const appBarSx = {
    width: `calc(100% - ${drawerWidth}px)`,
    mt: topMargin,
};
const drawerSx = {
    width: drawerWidth,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
        width: drawerWidth,
        boxSizing: "border-box",
        mt: topMargin,
        background: "grey",
    },
};

const listSx = {};

class RoomDrawer extends React.Component {
    constructor(props) {
        if (props === {}) {
            return;
        }

        super(props);
        this.props = props;
    }

    componentDidMount() {}

    render() {
        return (
            <Box>
                <AppBar
                    // position="absolute"
                    // anchor="left"
                    sx={appBarSx}
                >
                    <Toolbar>
                        <Typography variant="h6" noWrap component="div">
                            Room Name
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer sx={drawerSx} variant="permanent" anchor="left">
                    {/* <Toolbar />
                    <Divider /> */}
                    <List sx={listSx}>
                        {["Inbox", "Starred", "Send email", "Drafts"].map(
                            (text, index) => (
                                <ListItem button key={text}>
                                    <ListItemIcon>
                                        {index % 2 === 0 ? (
                                            <InboxIcon />
                                        ) : (
                                            <MailIcon />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                </ListItem>
                            )
                        )}
                    </List>
                </Drawer>

                <Box component="main" sx={boxSx}>
                    <div class="lmaooooo">
                        <Typography paragraph>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Rhoncus dolor purus non enim
                            praesent elementum facilisis leo vel. Risus at
                            ultrices mi tempus imperdiet. Semper risus in
                            hendrerit gravida rutrum quisque non tellus.
                            Convallis convallis tellus id interdum velit laoreet
                            id donec ultrices. Odio morbi quis commodo odio
                            aenean sed adipiscing. Amet nisl suscipit adipiscing
                            bibendum est ultricies integer quis. Cursus euismod
                            quis viverra nibh cras. Metus vulputate eu
                            scelerisque felis imperdiet proin fermentum leo.
                            Mauris commodo quis imperdiet massa tincidunt. Cras
                            tincidunt lobortis feugiat vivamus at augue. At
                            augue eget arcu dictum varius duis at consectetur
                            lorem. Velit sed ullamcorper morbi tincidunt. Lorem
                            donec massa sapien faucibus et molestie ac.
                        </Typography>
                    </div>

                    {/* <Movie _id="123123" /> */}
                </Box>
            </Box>
        );
    }
}

export default RoomDrawer;
