import React from 'react'
import "../App.css"
import { Link, useNavigate } from 'react-router-dom'
export default function Landing(){
    
    const router = useNavigate();

    return(
        <div className='landingPageContainer'>
            <nav>
                <div className='navHeader'>
                    <h2>SyncMeet</h2>
                </div>
                <div className='navlist'>
                    <p onClick={() => {router("/aljk23")}}>Join as Guest</p>
                    <p onClick={() => {router("/auth")}}>Register</p>
                    <div onClick={() => {router("/auth")}} role='button'><p>Login</p></div>
                </div>
            </nav>

            <div className='landingMainContainer'>
                <div>
                    <h2><span style={{color:"orange"}}>Connect</span> With Your Loved Once.</h2>
                    <p>Cover a Distance By <span style={{color:"orange"}}>SyncMeet</span></p>

                    <div role="button" className='startButton' >
                        <Link to={"/auth"}>Get Started</Link>
                    </div>
                </div>

                <div>
                    <img src="/mobile.png" alt="Mobile Photo" />
                </div>


            </div>

            

        </div>
    )
}