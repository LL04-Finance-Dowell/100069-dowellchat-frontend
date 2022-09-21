let getCurrentUrl = window.location.href;
let checkSessionID = getCurrentUrl.includes('session_id');
let showChatBtn = document.querySelector('#for_chat');
let showRooms = document.querySelector('#showRooms');

function redirectPage(){        
        window.location = 'https://100014.pythonanywhere.com/';  
    };

function frontEndLoginFunction() {
        if(checkSessionID === true){
            // Making getSessionId a global variable with 'window'
            window.getSessionId = getCurrentUrl.split('session_id=')[1];
            let dict_SessionID = {'key': getSessionId};
            console.log(getSessionId)

            fetch('https://100014.pythonanywhere.com/api/profile/', {
              method: 'POST',
              headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'content-type':'application/json'
                    },          
              body: JSON.stringify(dict_SessionID) })    
              .then(response => response.json())
              .then(json => {
                  console.log(json); 
                  console.log(`${json['username']}'s Role is ${json['role']}`);
                    //Check User's role
                        if(json['role'] === 'teamlead'){
                                showChatBtn.display = 'block';
                        }
                    })   }
        else {
            let pls_login = document.querySelector('#pls-login');
            pls_login.textContent = "You're Now Being Redirected to the Login Page";
            console.log("Session ID object missing: page redirection in progress");

            setTimeout('redirectPage()', 2000);
            console.log('Page successfully redirected!');
        }    };


frontEndLoginFunction()

function listRooms(){
    fetch('https://100069.pythonanywhere.com/chat/get-chat/', 
                {
                    method: 'GET',
                    headers: {'Content-Type':'application/json'},
                    mode: 'no-cors'
                }           
         )
        .then(res => res.json())
        .then(res =>{console.log(res.map((usr)=>usr.data)).catch(error=>console.log(error));
        /*
        .then(res =>{
            let htmlString = '';            
            res.data.rooms.name.map((usr)=>
                htmlString += `<p><a href='#'> ${usr}</a></p>`)
                showRooms.innerHTML = htmlString; */
    });
            
};

listRooms();
                    