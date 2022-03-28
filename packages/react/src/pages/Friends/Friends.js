import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import useToken from "../../components/App/useToken";
import AddFriend from "../../components/Friends/AddFriend";
import FriendsList from "../../components/Friends/FriendsList";
import RequestsFromUser from "../../components/Friends/RequestsFromUser";
import RequestsToUser from "../../components/Friends/RequestsToUser";
import "./Friends.css";
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 4 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }
  
const Friends = () => {
    const { token, setToken, getTokenObj } = useToken();
    const tokenObj = getTokenObj();
    const userID = tokenObj._id;

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const handleChangeIndex = (index) => {
        setValue(index);
      };

    return (
        <div className="friendsContainer">
            <Navbar />
            <div className="friends-wrapper">
            <Box sx={{ width: '100%', bgcolor: 'black' }}>
                <Tabs value={value} onChange={handleChange} centered TabIndicatorProps={{ style: { background: "#daa520" }}} >
                    <Tab label="My Friends"  sx={{ color: "white" }}/>
                    <Tab label="Requests" sx={{ color: "white" }}/>
                </Tabs>
            </Box>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: '10vh' }}
              >
                <Grid item xs={8}>
                    <TabPanel value={value} index={0} >
                      <AddFriend _id={userID} />
                      <FriendsList _id={userID} />
                    </TabPanel>
                </Grid>
                <Grid item xs={8}>
                    <TabPanel value={value} index={1}>
                      <RequestsToUser _id={userID} />
                      <RequestsFromUser _id={userID} />
                    </TabPanel>
                </Grid>
            </Grid>
            
            
           
            </div>
        </div>
    );
};
export default Friends;

