import React from 'react';

import "../styles/videoComponents.css";
import { useState, useRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
// import mongoose from 'mongoose';
// import { isObjectIdOrHexString } from 'mongoose';

const server_url = 'http://localhost:8000';

var connections={};
const peerConfigConnections ={
    "iceServers":[
        {
            "urls":"stun:stun.l.google.com:19302"
        }
    ]
}

export default function VideoMeet(){
    
    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoRef = useRef();
    let [videoAvailable, setVideoAvailable ] = useState(true);
    let[audioAvailable, setAudioAvailable] = useState(true);
    let[video, setVideo] = useState();
    let[audio, setAudio] = useState();
    let[screen, setScreen] =useState();
    let[showModel, setShowModel] = useState(false);
    let[screenAvailable, setScreenAvailable] = useState();
    let[messages, setMessages]= useState([]);
    let[message, setMessage] = useState("");
    let[newMessages, setNewMessages] = useState(0);
    let[askForUsername, setAskForUsername] =useState(true);
    let[username, setUsername] = useState("");
    
    const videoRef = useRef([])

    let[videos, setVideos] = useState([])

    //todo...
    // if(isChrome()=== false){

    // }

    const getPermissions = async ()=>{
        try{
            const videoPermission = await navigator.mediaDevices.getUserMedia({video: true});
            if(videoPermission){
                setVideoAvailable(true);
            }else{
                setVideoAvailable(false);
            }
            const audioPermission = await navigator.mediaDevices.getUserMedia({audio: true});
            if(audioPermission){
                setAudioAvailable(true);

            }else{
                setAudioAvailable(false);
            }

            if(navigator.mediaDevices.getDisplayMedia){
                setScreenAvailable(true);
            }else{
                setScreenAvailable(false);
            }

            if(videoAvailable && audioAvailable){
                const userMediaStream = await navigator.mediaDevices.getUserMedia({video: videoAvailable, audio: audioAvailable});

                if(userMediaStream){
                    window.localStream = userMediaStream;
                    if(localVideoRef.current){
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }


        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        getPermissions();
    }, [])



    let getUserMediaSuccess = (stream)=>{
        // if(localVideoRef.current){
        //     localVideoRef.current.srcObject = stream;
        // }
    }


    let getUserMedia = () =>{
        if((video && videoAvailable) || (audio && audioAvailable)){
            navigator.mediaDevices.getUserMedia({video: video, audio: audio})
            .then(getUserMediaSuccess)  //TODO : getUserMediaSuccess
            .then((stream)=>{})
            .catch((e)=> console.log(e))
        } else{
            try{
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            }catch(e){

            }
        }
    }

    useEffect(()=>{
        if(video !== undefined && audio !== undefined){
            getUserMedia();
        }
    }, [audio, video])


    //Todo
    let gotMessageFromServer = (fromId, message) =>{

    }
    //Todo: Add Message to the messages array
    let addMessage=()=>{

    }

    let connectToSocketServer = () =>{
        socketRef.current = isObjectIdOrHexString.connect(server_url, {secure: false})
        socketRef.current.on('signal', gotMessageFromServer)
        socketRef.current.on('connect',()=>{
            socketRef.current.emit("join-call", window.location.href)
            socketIdRef.current = socketRef.current.id;
            socketRef.current.on("chat-message", addMessage)
            socketRef.current.on("user-left", (id)=>{
                setVideo((videos)=>videos.filter((video)=>video.socketIdRef!==id))
            })
            socketRef.current.on("user-joined", (id, clients)=>{
                clients.forEach((socketListId)=>{
                    if(socketListId !== socketIdRef.current){
                        connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                        connections[socketListId].onicecandidate =(event)=>{
                            if(event.candidate !== null){
                                socketRef.current.emit("signal", socketListId, JSON.stringify({ 'ice':event.candidate}))
                            }
                        }
                        connections[socketListId].onaddstream = (event)=>{
                            let videoExists = videoRef.current.find(video => video.socketId === socketListId);
                            if(videoExists){
                                setVideo(videos =>{
                                    const updatedVideos = videos.map(video =>{
                                        if(video.socketId === socketListId){
                                            return {...video, stream: event.stream}
                                        }
                                        return video;
                                    });
                                    videoRef.current = updatedVideos;
                                    return updatedVideos;
                                })
                            } else{
                                let newVideo = {
                                    socketId: socketListId,
                                    stream: event.stream,
                                    autoplay: true,
                                    playsInline: true,
                                }
                                setVideos(videos =>{
                                    const updatedVideos = [...videos, newVideo];
                                    videoRef.current = updatedVideos;
                                    return updatedVideos;
                                });
                                
                            }

                            // setVideos((videos)=>[...videos, {socketIdRef: socketListId, stream: event.stream}])
                        }
                    };
                    if(window.localStream !== undefined && window.localStream !== null){
                        connections[socketListId].addStream(window.localStream);
                    }else{
                        //Todo: BlackSilence
                        // let blackSlienceStream = new MediaStream();
                        // connections[socketListId].addStream(blackSlienceStream);
                    }
                })
                if(id ===socketIdRef.current){
                    for(let id2 in connections){
                        continue;
                    }
                    try{
                        connections[id2].addStream(window.localStream)

                    }catch(e){
                        console.log(e);
                    }
                    connections[id2].createOffer().then((discription)=>{
                        connections[id2].setLocalDescription(discription)
                        .then(()=>{
                            socketRef.current.emit("signal", id2, JSON.stringify({"sdp":connections[id2].localDescription}));
                        })
                        .catch((e)=>{
                            console.log(e);
                        })
                    })
                }
            })
        })
    }

    let getMedia = ()=>{
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        
        // connectToSocketServer();

    }

    let connect =()=>{
        setAskForUsername(false);
        getMedia();
    }
    
    return (
        <div>

            {askForUsername === true ?
                <div>
                    <h2>Enter your Lobby</h2>
                    <TextField id='outlined-basic' label='Username' value={username} onChange={(e)=>setUsername(e.target.value)}></TextField>
                    <Button variant='contained'onClick={connect}>Connect</Button>

                    <div>
                        <video ref={localVideoRef} autoPlay muted></video>
                    </div>

                </div> : <></>


            }
        
        </div>


    )
}