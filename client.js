const socket = io("http://localhost:3000");

        // Get DOM elements in respective js variables

        const form = document.getElementById("send-container");
        const messageInput = document.getElementById("messageInp");
        const messageContainer = document.querySelector(".container");

        //audio that will play on recieving messages
        let audio=new Audio('ting.mp3');
        
        // function which will append event info to the container
        const append=(message,position)=>{
            const messageElement=document.createElement('div')
            messageElement.innerText=message
            messageElement.classList.add('message')
            messageElement.classList.add(position)
            messageContainer.append(messageElement)
            
            if(position=='left'){
                audio.play()

            }
        
        }

        // Ask new user for his/her name and let the server know
        const name = prompt("Enter your name to join");
        socket.emit('new-user-joined' ,name);


        //if new user joins,recieve his name from the server  
        socket.on('user-joined',name=>{
            append(`${name} joined the chat`,'right')

        })

        //if server sends a message , receive it
        
        socket.on('receive',data=>{
            append(`${data.name}: ${data.message}`,'left')
            
        })
    

        
        // if someone left the chat let them know
        socket.on('left',name=>{
            append(`${name} left the chat`,'right')
        })

        
        // if the form get submitted send server the message
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const message = messageInput.value.trim(); 
            if (message !== "") {
                append(`You: ${message}`, 'right');
                socket.emit('send', message);
                messageInput.value = "";
            }
        });