const getCurrentUrl = window.location.href;
const checkSessionID = getCurrentUrl.includes('session_id');

function login_function(){
    if (checkSessionID === true) {
        // Making getSessionId a global variable with 'window'
        window.getSessionId = getCurrentUrl.split('session_id=')[1];
        fetch_profile_data(getSessionId);
    }
    else {
        console.log("Session ID object missing: page redirection in progress");
        //setTimeout('redirectPage()', 1000);
        console.log('Page successfully redirected!');
    }
}

function fetch_profile_data(getSessionId){
    $.ajax({
        url: 'https://100014.pythonanywhere.com/api/profile/',
        type: 'POST',
        data: {
            'key': getSessionId
        },
        success: function (data) {
            console.log(data);
            const current_user_name = data['username'];
            console.log("Current user :", current_user_name);
            const current_user_role = data['role'];
            console.log("Current user role :", current_user_role);
            if (data['role'] === 'Proj_Lead'){
                chat_api_teamlead(current_user_name);
            }
            if (data['role'] === 'User'){
                chat_api_user(current_user_name, getSessionId);
            }
        },
        error: function (data) {
            console.log(data);
        }
    })
}

function chat_api_teamlead(username){
    //call the api for get rooms
    const room_name_head = document.querySelector('#room_name_head');
    room_name_head.innerHTML = username + "'s Room";
    
    $.ajax({
        //url: 'http://127.0.0.1:8000/chat/get-rooms/',
        url :'https://100069.pythonanywhere.com/chat/get-rooms/',
        type: 'GET',
        success: function (data) {
            console.log(data);
            const roomList = document.querySelector('#room_list');
            // const input_user_name = document.querySelector('#user_name');
            // input_user_name.value = user_name;
            //console.log(roomList)
            for (let i = 0; i < data.length; i++) {
                let roomLink = document.createElement('a');
                let roomItem = document.createElement('li');
                roomLink.setAttribute('href', '');
                
                roomLink.setAttribute('data-room-link', data[i]['room_link']);
                roomLink.setAttribute('data-user-name', username);
                
                roomLink.setAttribute('id', 'a_room_link');

                //add event listener to the button
                roomLink.addEventListener('click',get_messages)

                roomItem.innerHTML = data[i].room_name;
                roomLink.appendChild(roomItem);
                roomList.appendChild(roomLink);
            }
        },
        error: function (data) {
            console.log(data);
            
        }
    })
}

function chat_api_user(user_name,getSessionId){
    const room_name_head = document.querySelector('#room_name_head');
    room_name_head.innerHTML = user_name + "'s Room";
    //call the api to create room for the user with the team lead
    $.ajax({
        url: 'https://100069.pythonanywhere.com/chat/create-room/',
        type: 'POST',
        data: {
            'user_name': user_name,
            'sessionId': getSessionId
        },
        success: function (data) {
            console.log(data);

            const roomList = document.querySelector('#room_list');
            // const input_user_name = document.querySelector('#user_name');
            // input_user_name.value = user_name;
            //console.log(roomList)
                let roomLink = document.createElement('a');
                let roomItem = document.createElement('li');
                roomLink.setAttribute('href', '');
                //add data attribute to the button
                roomLink.setAttribute('data-room-link', data.room_link);
                roomLink.setAttribute('data-user-name', user_name);

                roomLink.setAttribute('id', 'a_room_link');

                //add event listener to the button
                roomLink.addEventListener('click',get_messages)

                roomItem.innerHTML = data.room_name;
                roomLink.appendChild(roomItem);
                roomList.appendChild(roomLink);

        },
        error: function (data) {}
    })
}

function get_messages(){
    event.preventDefault();
    //get room link from attr
    const room_link = this.getAttribute('data-room-link');
    const current_user_name = this.getAttribute('data-user-name');
    $("#card-body").animate({ scrollTop: 20000000 }, "slow")
    $.ajax({
        url: 'https://100069.pythonanywhere.com/chat/get-messages/',
        type: 'POST',
        data: {
            'room_link': room_link
        },
        success: function (data) {
            console.log(data);
            const messagesList = document.querySelector('#messages-list');
            const user_name_hidden = document.querySelector('#user_name_hidden');
            user_name_hidden.value = current_user_name;
            const room_link_hidden = document.querySelector('#room_link_hidden');
            room_link_hidden.value = room_link;
            console.log(user_name_hidden.value,room_link_hidden.value);
            if (data['Messages'].length > 0){
                document.querySelector('#room_name').innerHTML = data['room_name'];
                messagesList.innerHTML = '';
            for (let i = 0; i < data['Messages'].length; i++) {
               
                let messageItem = document.createElement('li');
                let messageItemDiv = document.createElement('div');
                let messageUser = document.createElement('span');

                messageItem.innerHTML = data['Messages'][i].message;
                if (data['Messages'][i].user === current_user_name){
                   
                    messageItem.setAttribute('class','list-group-item');
                    messageItemDiv.setAttribute('class','right');
                    messageUser.innerHTML = data['Messages'][i].user;
                    messageItemDiv.appendChild(messageUser);

                }
                else{
                    messageItem.setAttribute('class','list-group-item');
                    messageItemDiv.setAttribute('class','left');
                     messageUser.innerHTML = data['Messages'][i].user;
                    messageItemDiv.appendChild(messageUser);
                }
            
                messageItemDiv.appendChild(messageItem);
               
                messagesList.appendChild(messageItemDiv);


            }
        }
        else{
            document.querySelector('#room_name').innerHTML = data['room_name'];
            messagesList.innerHTML = '';
        }
        },
        error: function (data) {
            console.log(data);
        }
    })
}

// function get_message(room_link){
//     event.preventDefault();
//     //get room link from attr
//     //const room_link = this.getAttribute('data-room-link');
    
//     $.ajax({
//         url: 'http://127.0.0.1:8000/chat/get-messages/',
//         type: 'POST',
//         data: {
//             'room_link': room_link
//         },
//         success: function (data) {
//             console.log(data);
//             const messagesList = document.querySelector('#messages-list');
//             console.log(messagesList)
//             const input_user_name = document.querySelector('#user_name');
//             const input_room_link = document.querySelector('#room_link');
//             console.log(input_user_name)
//             console.log(input_room_link)
//             input_user_name.value = 'Team_lead';
//             input_room_link.value = room_link;
//             messagesList.innerHTML = '';
//             for (let i = 0; i < data['Messages'].length; i++) {
//                 document.querySelector('#room_name').innerHTML = data['Messages'][i]['room'];
//                 let messageItem = document.createElement('li');
//                 let messageItemDiv = document.createElement('div');
//                 messageItem.innerHTML = data['Messages'][i].message;
//                 if (data['Messages'][i].user === 'Team_lead'){
//                     messageItem.setAttribute('class','list-group-item');
//                     messageItemDiv.setAttribute('class','right');
//                 }
//                 else{
//                     messageItem.setAttribute('class','list-group-item');
//                     messageItemDiv.setAttribute('class','left');
//                 }
//                 messageItemDiv.appendChild(messageItem);
//                 messagesList.appendChild(messageItemDiv);

               
//             }
//         },
//         error: function (data) {
//             console.log(data);
//         }
//     })
// }

function send_message(){
    event.preventDefault();
    const formData = new FormData(document.getElementById('sendMessage'));
    console.log(formData);
    //convert to json
    const data = Object.fromEntries(formData.entries());
    console.log(data);

    const user_name = data['user_name_hidden'];
    const room_link = data['room_link_hidden'];
    const message = data['message'];

    //dont send empty messages
    if (message === ''){
        return false;
    }

    $.ajax({
        url:'https://100069.pythonanywhere.com/chat/send-message/',
        type:'POST',
        data:{
            'user_name':user_name,
            'room_link':room_link,
            'message': message
        },
        
        success: function (data) {
            console.log(data);
            //clear the input 
            document.querySelector('#message').value = '';
            
            //click on the id a_room_link to get the messages
            // const a = document.querySelector('#a_room_link')
            //     a.value = room_link;
            //     a.click();
            
            //get_messages();
            //get_message(room_link);
        },
        error: function (data) {
            console.log(data);
        }
    })

}


login_function();

// //scroll down card-body auto on windows load
// window.onload = function() {
//     const cardBody = document.querySelector('.card-body');
//     cardBody.scrollBottom = cardBody.scrollHeight;
// }   


const btnSend = document.querySelector('#btn-send');
btnSend.addEventListener('click',send_message)