let getCurrentUrl = window.location.href;
let checkSessionID = getCurrentUrl.includes('session_id');
//let showChatBtn = document.querySelector('#for_chat');
let bodyWrapper = document.querySelector('#wrapper');

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
                        if(json['role'] === 'Proj_Lead'){
                                //showChatBtn.display = 'block';
                                bodyWrapper.display = 'block';
                        }
                    })   }
        else {
            let pls_login = document.querySelector('#pls-login');
            //pls_login.textContent = "You're Now Being Redirected to the Login Page";
            console.log("Session ID object missing: page redirection in progress");

            setTimeout('redirectPage()', 1000);
            console.log('Page successfully redirected!');
        }    };


frontEndLoginFunction()
/*
window.onload = () => {
        $.getJSON('http://100069.pythonanywhere.com/chat/get-rooms/', function (data){
                console.log(data);
            })

};  
*/

/*
window.onload = () => {
        fetch('https://100069.pythonanywhere.com/chat/get-rooms/', 
                             {method:'GET',
                              headers: {
                             'Access-Control-Allow-Origin': '*',
                              
                              'content-type':'application/json'}, 
                              mode:'no-cors'
                             })
    .then(res => res.json())
    .then(data =>{console.log(data)})
    .catch(error => {console.log(error)})};

*/
