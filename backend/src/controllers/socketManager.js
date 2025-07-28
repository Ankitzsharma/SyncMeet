import {Server, Socket} from 'socket.io';

let connections={};
let messages={};
let timeOnline={};


const connectToSocket = (server)=>{
    const io=new Server(server,{
        origin: "*",
        methods:['GET','POST'],
        allowedHeaders:['*'],
        credentials:true
    });
    

    io.on('connection', (Socket)=>{

        Socket.on('join-call', (path)=>{

            if(!connections[path]===undefined){
                connections[path]=[];
            }
            connections[path].push(Socket.id);

            timeOnline[Socket.id]=new Date().getTime();



            for(let a=0; a<connections[path].length; a++){
                io.to(connections[path][a]).emit('user-joined', Socket.id, connections[path])
            }

            if(messages[path]===undefined){
                for(let a=0;a<message[path].length; ++a){
                    io.to(Socket.id).emit('chat-message', messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }
            // Socket.join(path);
            // console.log(`User ${Socket.id} joined room ${path}`);
        })

        Socket.on('signal',(toID, message)=>{
            io.to(toID).emit('signal', Socket.id, message);
        })

        Socket.on('chat-message',(data, sender)=>{

            const [matchingRoom, found] = Object.entries(connections).reduce(([matchingRoom, isFound], [roomKey, roomValue]) =>{
                if(!isFound && roomValue.includes(Socket.id)){
                    return[roomKey,true];
                }
                return [roomKey, isFound];
            }, ['', false]);

            if(found===true){
                if(messages[matchingRoom]===undefined){
                    messages[matchingRoom]=[];
                }

                messages[matchingRoom].push({
                    data: data,
                    sender: sender,
                    'socket-id-sender': Socket.id
                });
                console.log('messages', Key, ":", sender, data);

                connections[matchingRoom].forEach((elem)=>{
                    io.to(elem).emit('chat-message', data, sender, Socket.id);    
                
                })
            }
        })

        Socket.on('disconnect',()=>{

            var diffTime=Math.abs(timeOnline[Socket.id]-new Date())

            var key;

            for(const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))){

                for(let a=0; a<v.length; ++a){
                    if(v[a]===Socket.id){
                        key=k;

                        for(let a=0;a<connections[Key].length; ++a){

                            io.to(connections[key][a]).emit('user-left', Socket.id);
                        }

                        var index= connections[key].indexOf(Socket.id);
                        connections[key].splice(index,1);

                        if(connections[key].length===0){
                            delete connections[key];
                        }
                    }
                }
            }

        })
    })


    return io;
}


export default connectToSocket;