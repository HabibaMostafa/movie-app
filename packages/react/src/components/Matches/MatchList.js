import React from "react";
import axios from "axios";

import FriendMatches from "../../components/Matches/FriendMatches";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import "./MatchList.css";
import loading from "./loading.gif";
import PropTypes from 'prop-types';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
  
  LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };

  
class MatchList extends React.Component {
    constructor(props) {
        super(props);

        // needs to equal [] bc react renders twice since theres component did mount...
        // this.state = { userFriends: [] };
        // this.userToAdd = null;
        this.state = { userFriends: [], loading: true };
        
    }

    _renderCounter = () => () => {
        const [progress, setProgress] = React.useState(10);

        React.useEffect(() => {
          const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
          }, 800);
          return () => {
            clearInterval(timer);
          };
        }, []);
      
        return (
          <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={progress} color="inherit" />
          </Box>
        );
      }


    componentDidMount() {
        const params = {
            user: this.props._id,
        };

        this.setState({ loading: true });

        axios.post("/matches/check", { userId: this.props._id }).then((lol) => {
            axios.post("/friend/user-friends", params).then((res) => {
                if (res.status === 200) {
                    this.setState({ userFriends: res.data });
                } else {
                    this.setState({ userFriends: [] });
                }

                this.setState({ loading: false });
            });
        });

        //check for any new matches with friends here...
    }

    render() {

        const MyInlineHook = this._renderCounter();

        if (this.state.loading) {
           return <div><MyInlineHook /></div>;
        } else {
            return (
                <div className="matchList">
                    {this.state.userFriends.map((value) => (
                        <FriendMatches friend={value} _id={this.props._id} />
                    ))}
                </div>
            );
        }
    }
}

export default MatchList;
