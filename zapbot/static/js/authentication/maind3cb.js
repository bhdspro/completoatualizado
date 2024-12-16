function create(htmlStr) {
  var frag = document.createDocumentFragment(),
      temp = document.createElement('div');
  temp.innerHTML = htmlStr;
  while (temp.firstChild) {
      frag.appendChild(temp.firstChild);
  }
  return frag;
}

function blockUI(content){
  var _div = '<div style="display: grid; align-items: center; justify-items: center; height: 100vh;">';
  document.getElementById('message').innerHTML = '';
  var content = ( !content ) ? `${_div}<h3>Carregando...</h3></div>` : content;
  var fragment = create(`<div id="mask">${content}</div>`);
  document.body.insertBefore(fragment, document.body.childNodes[0]);
}

function unblockUI(){
  document.getElementById('mask').remove();
}

function callbackMSG(_type, _message){
  let _msg_alert = document.getElementById('message');
  
  _msg_alert.classList.remove( (_type == 'error') ?  'success' : 'danger' );
  _msg_alert.classList.add( (_type == 'success') ? 'success' : 'danger' );
  _msg_alert.innerHTML = _message;
}

authEmailPassButton = document.getElementById('authEmailPassButton');
createUserButton = document.getElementById('createUserButton');
resetUserButton = document.getElementById('resetUserButton');

/*function create_contact_ac(email){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/create_contact_ac");

  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        console.log(xhr.responseText);
      }
  };

  xhr.send(JSON.stringify({ email: email }));

}*/

function goLogin(_email, _pass, to){ 
  firebase
    .auth()
    .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function() {
      // Execute o signInWithEmailAndPassword aqui
      firebase
        .auth()
        .signInWithEmailAndPassword(_email, _pass)
        .then(function(result) { 
          let uid = result.user.uid;
          let default_redirect = `${to}/${uid}`;
          
          // Primeiro login detectado
          if (!localStorage.getItem(`firstLogin_${uid}`)) {
            localStorage.setItem(`firstLogin_${uid}`, true);

            default_redirect = `instances/${uid}`;
          }
          
          // Armazenar o UID no localStorage e redirecionar
          localStorage.uid = uid;
          window.location = default_redirect
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          setTimeout(unblockUI, 500);
          callbackMSG('error', `${errorCode}: ${errorMessage}`);
        });  
    })
    .catch(function(error) {
      // Trate os erros aqui
    });
}

function signInSocial(provider, to){
  blockUI(); // loading screen

  firebase
  .auth()
  .signInWithPopup(provider)
  .then(function(result){
    var user = result.user;

    localStorage.uid = user['uid'];
    //create_contact_ac(user['email'])

    window.location = to;
  })
  .catch(function(error){
    var errorCode = error.code;
    var errorMessage = error.message;
    setTimeout(unblockUI, 500);
    callbackMSG('error', `${errorCode}: ${errorMessage}`);
  });

}
// LOGIN
if( authEmailPassButton ){
  authEmailPassButton.addEventListener('click',function(){
    blockUI();
    goLogin(document.getElementById('email').value, document.getElementById('password').value, 'dashboard');
  });
}
// Facebook
/*authFacebookButton.addEventListener('click',function(){
  var provider = new firebase.auth.FacebookAuthProvider();
  signInSocial(provider);
});*/

/*if( authGoogleButton ){
  authGoogleButton.addEventListener('click',function(){  
    var provider = new firebase.auth.GoogleAuthProvider();
    signInSocial(provider, 'dashboard');
  });
}*/

//SIGN UP
if( createUserButton ){
  var _div = '<div style="display: grid; align-items: center; justify-items: center; height: 100vh;">';

  createUserButton.addEventListener('click',function(){
    blockUI(`${_div}<h2>🤖 Criando conta...</h2></div>`);
    
    firebase
      .auth()
      .createUserWithEmailAndPassword(document.getElementById('email').value, 
      document.getElementById('password').value)
      .then(function(result) {
        
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;
        //console.log(result);
        //callbackMSG('success', 'Usuário criado, tente logar agora!');
        
        // Add new lead on the Active Campaign
        //create_contact_ac(email)      

        // Set cookie to Active Campaign
        // https://help.activecampaign.com/hc/en-us/articles/360000872064-Monitoramento-de-sites-e-o-LGPD#how-to-update-site-tracking-for-the-gdpr

        // Insert tracking snippet here
        /*if( vgo ){
          
          if (document.cookie.indexOf('accept_cookies') !== -1) {
              vgo('process', 'allowTracking');
          }

          var expiration = new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 30);
          vgo('process', 'allowTracking');
          document.cookie = 'accept_cookies=1; expires=' + expiration + '; path=/';
        }*/
        // ---    

        unblockUI();

        blockUI('<div style="display: grid; align-items: center; justify-items: center; height: 100vh;"><h2>⚡️ Preparando seu dashboard...</h2></div>');                  
        
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/payed/trial");
      
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-Type", "application/json");
      
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {   
            unblockUI();

            blockUI(`${_div}<h2>🎉 Hora de automatizar...</h2></div>`); 
            
            localStorage.setItem('is_trial', true);

            goLogin(email, password, 'dashboard');
            // console.log(xhr.responseText);
            // dialog.alert({
            //   message: "Criamos seu usuário, vamos lá?",
            //   callback: ()=>{
            //   }
            // });
      
          }
        };
        let _data = JSON.stringify({"email": email,"full_name": " - ","password": password });
        xhr.send(_data);

        // $.post('/payed/trial',_data,(ret)=>{
        //   console.log(ret);
        // });
 
      })
      .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        
        setTimeout(unblockUI, 500);
        callbackMSG('error', `${errorCode}: ${errorMessage}`);
        // ...
      })
  });
}
//FORGOT PASSWORD
resetUserButton.addEventListener('click',function(){

  blockUI();

  firebase
    .auth()
    .sendPasswordResetEmail(document.getElementById('email').value)        
    .then(function(result) {
      setTimeout(unblockUI, 500);
      callbackMSG('success', 'Você receberá um email em breve!');
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;

      setTimeout(unblockUI, 500); 
      callbackMSG('error', `${errorCode}: ${errorMessage}`);

      // ...
    })
});
