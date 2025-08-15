import React from 'react';
import {Link} from 'react-router-dom';
import '../App.css';
export default function landing(){
    return(
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>SyncMeet</h2>
                </div>
                <div className='navlist'>
                    <p>Join as Guest</p>
                    <p>Register</p>
                    <div role='button'><p>Login</p></div>
                </div>
            </nav>

            <div className='landingMainContainer'>
                <div>
                    <h1><span style={{color:"orange"}}>Connect</span> With Your Loved Once.</h1>
                    <p>Cover a Distance By <span style={{color:"orange"}}>SyncMeet</span></p>

                    <div role="button" className='startButton' >
                        <Link to={"/home"}>Get Started</Link>
                    </div>
                </div>

                <div>
                    <img src="/mobile.png" alt="Mobile Photo" />
                </div>


            </div>

            

        </div>
    )
}