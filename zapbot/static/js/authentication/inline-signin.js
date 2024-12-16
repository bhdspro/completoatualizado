    /* 
      Toggle eye and eye-slash for to password
    */
      const togglePassword = document.querySelector("#togglePassword");
      const password = document.querySelector("#password");
  
      togglePassword.addEventListener("click", function () {
        // toggle the type attribute
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);
  
        // toggle the icon
        if (this.classList.contains('fa-eye')) {
          this.classList.remove('fa-eye');
          this.classList.add('fa-eye-slash');
        } else {
          this.classList.add('fa-eye');
          this.classList.remove('fa-eye-slash');
        }
      });
  
      /*
        Enter button
      */
      var btn_submit = "authEmailPassButton";//"{{ button1['id'] }}";
  
      var passwordEl = document.querySelector("#password");

      passwordEl.addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
          document.querySelector(`#${btn_submit}`).click();
        }
      });
  
      let params = new URLSearchParams(window.location.search);
      let email_from_home = params.get('email');
  
      if(email_from_home != "" && 
        email_from_home !== null && 
        email_from_home !== undefined  ){
        document.querySelector('#email').value = email_from_home;
        document.querySelector('#password').focus();
      }