import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

import React, {useState, useCallback} from 'react';
import {
    Typography
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
// import {useNavigate} from 'react-router';

// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
// import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
// import FeedRoundedIcon from '@mui/icons-material/FeedRounded';

// Bottom navbar
export default function TopNavbar() {
    const { user, username } = useContext(UserContext)


  return (
    <nav className="topnavbar">
      <ul>
        {/* user is signed-in and has username */}
        {username && (
          <>
            <li className="push-left">
              <Link href="/admin">
                <button className="btn-blue">Write Posts</button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}

        {/* user is not signed OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}