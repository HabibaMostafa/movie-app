import React, { useEffect } from "react";
import "./Navbar.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../../logo-black.svg";
import PersonIcon from '@mui/icons-material/Person';
import useToken from "../App/useToken";
import DeleteIcon from '@mui/icons-material/Delete';
import Icon from '@mui/material/Icon';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

const Navbar = () => {
    const [click, setClick] = React.useState(false);

    const handleClick = () => setClick(!click);
    const Close = () => setClick(false);

    const { removeToken, getTokenObj } = useToken();

    const navigate = useNavigate();
    const tokenObj = getTokenObj();
    const location = useLocation();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClickEvent = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
        <div>
            <div
                className={click ? "main-container" : ""}
                onClick={() => Close()}
            />

            <nav className="navbar" onClick={(e) => e.stopPropagation()}>
                <div className="nav-container">
                    <NavLink exact to="/" className="nav-logo">
                        CINEMASWIPE
                        <i className="fa fa-code"></i>
                    </NavLink>
                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/"
                                activeClassName="active"
                                className="nav-links"
                                onClick={click ? handleClick : null}
                            >
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/movies"
                                activeClassName="active"
                                className="nav-links"
                                onClick={click ? handleClick : null}
                            >
                                Movies
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/friends"
                                activeClassName="active"
                                className="nav-links"
                                onClick={click ? handleClick : null}
                            >
                                Friends
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/matches"
                                activeClassName="active"
                                className="nav-links"
                                onClick={click ? handleClick : null}
                            >
                                Matches
                            </NavLink>
                        </li>
                        <li className="nav-item-menu">
                        <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', backgroundColor: 'black'}}>
                            <Tooltip title="Account settings">
                              <IconButton
                                onClick={handleClickEvent}
                                size="small"
                                sx={{ ml: 2 }}
                                aria-controls={open ? 'account-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                              >
                                <Avatar sx={{ width: 32, height: 32, backgroundColor: "#f5b921"}}>{tokenObj.username.toUpperCase().charAt(0)} </Avatar>
                              </IconButton>
                            </Tooltip>
                          </Box>
                          <Menu
                            anchorEl={anchorEl}
                            id="account-menu"
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            PaperProps={{
                              elevation: 0,
                              sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                  width: 32,
                                  height: 32,
                                  ml: -0.5,
                                  mr: 1,
                                },
                                '&:before': {
                                  content: '""',
                                  display: 'block',
                                  position: 'absolute',
                                  top: 0,
                                  right: 14,
                                  width: 10,
                                  height: 10,
                                  bgcolor: 'black',
                                  transform: 'translateY(-50%) rotate(45deg)',
                                  zIndex: 0,
                                },
                              },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                          >
                            <MenuItem className="labels">
                              <Avatar /> {tokenObj.username}
                            </MenuItem>
                            <Divider />
                            <MenuItem className="labels">
                              {/* <ListItemIcon>
                                <Logout fontSize="small" />
                              </ListItemIcon> */}
                              <NavLink
                                exact
                                to="/"
                                activeClassName="active"
                                className="nav-links"
                                onClick={() => {
                                    removeToken();

                                    if (location.pathname === "/") {
                                        window.location.reload(true);
                                    } else {
                                        navigate("/");
                                    }
                                }}
                              >
                               Logout
                              </NavLink>
                            </MenuItem>
                          </Menu>
                        </li>
                    </ul>
                    <div className="nav-icon" onClick={handleClick}>
                        <i className={click ? "fa fa-times" : "fa fa-bars"}></i>
                    </div>
                </div>
            </nav>
        </div>
    );
};
export default Navbar;
