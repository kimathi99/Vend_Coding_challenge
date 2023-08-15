import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { UserAuth } from '../auth/auth';
import { AuthContext } from '../auth/auth';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  main: {
    backgroundColor: 'rgb(47, 226, 80)',
    padding: '16px 32px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menu: {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  menuIcon: {
    display: 'none', // Hide the menu icon by default
    fontSize: 20,
    cursor: 'pointer',
  },
  // Additional styles...
}));

export const Navbar = () => {
  const auth = UserAuth();
  const { logoutUser } = useContext(AuthContext);
  const classes = useStyles();

  const NavLinkStyles = ({ isActive }) => ({
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none',
  });

  return (
    <nav className={classes.main}>
      <div className={classes.menuIcon}>&#9776;</div>
      <ul className={classes.menu}>
        <li>
          <NavLink style={NavLinkStyles} to="/">
            Home
          </NavLink>
        </li>
        <li>
          <NavLink style={NavLinkStyles} to="/changepassword">
            Changepassword
          </NavLink>
        </li>
        {!auth.user && (
          <>
            <li>
              <NavLink style={NavLinkStyles} to="/register">
                Register
              </NavLink>
            </li>
          </>
        )}
        
        {!auth.user && (
          <>
            <li>
              <NavLink style={NavLinkStyles} to="/login">
                Login
              </NavLink>
            </li>
          </>
        )}
        {auth.user && (
          <li>
            <NavLink
              style={NavLinkStyles}
              onClick={logoutUser}
              // to="/logout"
            >
              Logout
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};
