
    

    import {getUser} from '/js/saveUser.js';
    import { getAuth , RecaptchaVerifier , signInWithPhoneNumber} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js'
    import app from '/js/config.js';

    const auth = getAuth(app);

    const buttonLogin = document.getElementById("login")
    var error = document.getElementById("error");
    const message = document.getElementById("message");
    var checkSendCode = true;
    var verifyCode;
    var user;
    // window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);



    buttonLogin.addEventListener("click",async function(){
        if(checkSendCode){
            console.log("chua sendCode")
            const idCard = document.getElementById("idCard").value;
            console.log(idCard)
            message.remove()
            error.style.color = "green";
            error.style.display = "block"
            error.style.textAlign = "center"
            error.innerHTML = "Đang kiểm tra";
            user = await getUser(idCard);
            if(user.length > 0){
                console.log(user[0].numberPhone)
                var input = document.createElement('INPUT')
                var span = document.createElement('span')
                input.type = "text";
                input.id = "otp"
                input.placeholder = "ENTER CODE"
                input.className = "input100"
                span.className = "focus-input100"
                document.getElementById("code").appendChild(input);
                document.getElementById("code").appendChild(span)

                console.log("LOGIN SUCCESS")
                checkSendCode = false;
                console.log("SDT: "+user[0].numberPhone)
                error.innerHTML = "Đang gửi tin nhắn";
                signInWithPhoneNumber(auth, user[0].numberPhone, window.recaptchaVerifier)
                    .then((confirmationResult) => {
                        // SMS sent. Prompt user to type the code from the message, then sign the
                        // user in with confirmationResult.confirm(code).
                        error.innerHTML = "Đã gửi tin nhắn";
                        window.confirmationResult = confirmationResult;
                        verifyCode = confirmationResult;

                    // ...
                    }).catch((error) => {
                        console.log("Error Send SMS")
                        console.log(`ERROR : ${error}`)
                        var error = document.getElementById("error");
                        error.style.color = "red"
                        error.innerHTML = "Hệ thống đang quá tải";
                        // Error; SMS not sent
                        // ...
                        });

            }else{
                error.style.color = "red"
                error.innerHTML = "Chưa có người dùng này, Vui lòng đăng ký";
            }

        }else{
            console.log("Da sendCode")
            const code = document.getElementById("otp").value;
            console.log("CODE: "+code)
            console.log("VERIFY: "+verifyCode)
            verifyCode.confirm(code).then((result) => {
                console.log("Login SUCCESS YESSSSSSSS")
                document.getElementById("fullname").value = user[0].fullname;
                document.getElementById("role").value = user[0].role;
                
                document.getElementById("confirmLoginForm").submit();
                // User signed in successfully.
                const user = result.user;
             // ...
            }).catch((error) => {
                console.log("Code Wrong")
                console.log("ERROR: "+error)
                document.getElementById("confirmLoginForm").submit();
            // User couldn't sign in (bad verification code?)
            // ...
            });
        }
            
    })

    // signInWithPhoneNumber(auth, checkLogin[0].numberPhone, window.recaptchaVerifier)
    //                 .then((confirmationResult) => {
    //                     // SMS sent. Prompt user to type the code from the message, then sign the
    //                     // user in with confirmationResult.confirm(code).
    //                     console.log("Da vao day")
    //                     window.confirmationResult = confirmationResult;
    //                     verifyCode = confirmationResult;
    //                     document.getElementById("confirmLoginForm").submit();
                        
    //                     // return confirmationResult;
    //                 // console.log(confirmationResult);
    //                 // ...
    //                 }).catch((error) => {
    //                     console.log("Error Send SMS")
    //                     console.log(`ERROR : ${error}`)
    //                     // Error; SMS not sent
    //                     // ...
    //                 });


    // async function submitLogin ()  {
    //     const checkLogin = await getUser();
    //     if(checkLogin.length > 0){
    //         console.log(checkLogin[0].numberPhone)
    //             signInWithPhoneNumber(auth, checkLogin[0].numberPhone, window.recaptchaVerifier)
    //                 .then((confirmationResult) => {
    //                     // SMS sent. Prompt user to type the code from the message, then sign the
    //                     // user in with confirmationResult.confirm(code).
    //                     console.log("Da vao day")
    //                     window.confirmationResult = confirmationResult;
    //                     // verifyCode = confirmationResult;
    //                     document.getElementById("confirmLoginForm").submit();
    //                     document.getElementById("confirmOTP").addEventListener("click",function(){
    //                     var code = document.getElementById("code").value;
    //                     confirmationResult.confirm(code).then((result) => {
    //                             // User signed in successfully.
    //                             const user = result.user;
    //                             // ...
    //                             }).catch((error) => {
    //                             // User couldn't sign in (bad verification code?)
    //                             // ...
    //                             });
    //                     })
    //                     // return confirmationResult;
    //                 // console.log(confirmationResult);
    //                 // ...
    //                 }).catch((error) => {
    //                     console.log("Error Send SMS")
    //                     console.log(`ERROR : ${error}`)
    //                     // Error; SMS not sent
    //                     // ...
    //                 });
    //         // document.getElementById("confirmLoginForm").submit();
    //         console.log("LOGIN SUCCESS")
    //     }else{
    //         console.log("LOGIN FAILED")
    //     }
    // }

    // const loginButton = document.getElementById("login");
    // window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);


    // function Manager(){
    //     var verifyCode;
    //     return {
    //         submitLogin(){
    //         console.log("Login");
    //         signInWithPhoneNumber(auth, "+84795418148", window.recaptchaVerifier)
    //                 .then((confirmationResult) => {
    //                     // SMS sent. Prompt user to type the code from the message, then sign the
    //                     // user in with confirmationResult.confirm(code).
    //                     console.log("Da vao day")
    //                     window.confirmationResult = confirmationResult;
    //                     document.getElementById("confirmLoginForm").submit();
    //                     verifyCode = confirmationResult;
    //                     // return confirmationResult;
    //                 // console.log(confirmationResult);
    //                 // ...
    //                 }).catch((error) => {
    //                     console.log("Error Send SMS")
    //                     console.log(`ERROR : ${error}`)
    //                     // Error; SMS not sent
    //                     // ...
    //                 });

    //             getUser();
    //             console.log("OK")
    //         // loginButton.addEventListener("click", function(){
                
    //         // })

    //          },

    //         confirmLogin(){
    //             const code = document.getElementById("code").value;        
    //             console.log("Code : "+code)
    //             console.log(verifyCode)
    //             verifyCode.confirm(code).then((result) => {
    //                 // User signed in successfully.
    //                     console.log("Register successfully")
    //                     const user = result.user;
    //                     console.log(`User : ${user}`)
    //                 // ...
    //                 }).catch((error) => {
    //                     console.log("Register failed")
    //                 // User couldn't sign in (bad verification code?)
    //                 // ...
    //             });
    //         }

    //     }
    // }

    // function submitLogin(){
    //     window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    //     console.log("Login");
    //     signInWithPhoneNumber(auth, "+84795418148", window.recaptchaVerifier)
    //             .then((confirmationResult) => {
    //                 // SMS sent. Prompt user to type the code from the message, then sign the
    //                 // user in with confirmationResult.confirm(code).
    //                 console.log("Da vao day")
    //                 window.confirmationResult = confirmationResult;
    //                 // document.getElementById("confirmLoginForm").submit();
    //                 verifyCode = confirmationResult;
    //                 console.log("verifyCode: "+verifyCode)
    //                 // return confirmationResult;
    //             // console.log(confirmationResult);
    //             // ...
    //             }).catch((error) => {
    //                 console.log("Error Send SMS")
    //                 console.log(`ERROR : ${error}`)
    //                 // Error; SMS not sent
    //                 // ...
    //             });

    //         getUser();
    //         console.log("OK")
    //     // loginButton.addEventListener("click", function(){
            
    //     // })

    // }

    // function confirmLogin(){
    //     const code = document.getElementById("code").value;        
    //     console.log("Code : "+code)
    //     console.log(verifyCode)
    //     // verifyCode.confirm(code).then((result) => {
    //     //     // User signed in successfully.
    //     //         console.log("Register successfully")
    //     //         const user = result.user;
    //     //         console.log(`User : ${user}`)
    //     //     // ...
    //     //     }).catch((error) => {
    //     //         console.log("Register failed")
    //     //     // User couldn't sign in (bad verification code?)
    //     //     // ...
    //     // });
    // }

   
    // document.getElementById("registerForm").submit();


    function checkLogin(){
        return false;
    }

    window.checkLogin = checkLogin;
    // window.submitLogin = submitLogin;
    // window.confirmLogin = Manager().confirmLogin;
