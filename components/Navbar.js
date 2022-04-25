import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

import React, {useState, useCallback} from 'react';
import {
    Typography
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
import {useNavigate} from 'react-router';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import FeedRoundedIcon from '@mui/icons-material/FeedRounded';

// Bottom navbar
export default function Navbar() {
    const { user, username } = useContext(UserContext)

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/"><div className='nav-iconDIV'>
            <HomeRoundedIcon className="nav_icon"  sx={{ fontSize: 45 }} style={{ color: "#C4C4C4" }} />
            {/*   <div className='nav_text'style={{ color: "##34CC98" }}> Home</div> */}
            </div>
          </Link>
        </li>

        <li>
          <Link href="/feed"><div className='nav-iconDIV'>
          <FeedRoundedIcon  className="nav_icon" sx={{ fontSize: 45 }} style={{ color: "#C4C4C4" }} />
           {/* <div className='nav_text'>Feed</div> */}
           </div>
          </Link>
        </li>

        <li>
        <Link href="/upload"><div className='nav-iconDIV'>
          <div className='nav_icon'>
            <img src='/bar_feedcontent.png' style={{}}/> 
          </div>
        </div>         
        </Link>
        </li>
        
        <li>
        <Link href="/store"><div className='nav-iconDIV'>
            <ShoppingCartRoundedIcon className="nav_icon"  sx={{ fontSize: 45 }} style={{ color: "#C4C4C4" }} />
            {/* <div className='nav_text'>Store</div> */}
            </div>
          </Link>
        </li>
        
        {username && (
          <li>
          <Link href={`/${username}`}><div className='nav-iconDIV'>
          <PersonRoundedIcon className="nav_icon" sx={{ fontSize: 45 }} style={{ color: "#C4C4C4" }} />
              {/* <div className='nav_text'>MyPage</div> */}
              </div>
            </Link>
          </li>
        )}


        {!username && (
          <li>
            <Link href="/enter"><div className='nav-iconDIV'>
          <PersonRoundedIcon className="nav_icon" sx={{ fontSize: 45 }} style={{ color: "#C4C4C4" }} />
              {/* <div className='nav_text'>MyPage</div> */}
              </div>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}