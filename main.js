
function registerfunc() {

    const username = document.getElementById("username-register").value;
    const password = document.getElementById("pass-register").value;
    const name = document.getElementById("name-register").value;
    const image = document.getElementById("image-register").files[0];
    
    // Create FormData object
    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("image", image);
    
    let url = `${baseurl}register`;
 
    // Use axios to post formData
    axios.post(url, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(function (response) {
        console.log(response.data.token);
 
        // Ensure that the user is registered
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
 
        const modal = document.getElementById("registermodal");
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        getUI();
        showAlert('User registered successfully!', 'success');
    })
    .catch(function (error) {
        showAlert(error.message || 'An error occurred', 'danger');
    });
 }
 
 
   
   function loginfunc() {
//     let user = getcurrentuser()
//     // let user =null
//     const storageuser = localStorage.getItem("user");
// console.log(storageuser)

       name = document.getElementById("name-id").value
       password = document.getElementById("pass-id").value
       console.log(name, password)
       // alert("success");


       const param = {
           "username": name,
           "password": password
       }

       let url = `${baseurl}login`


       axios.post(url, param)
           .then(function (response) {
               console.log(response.data.token);



               //to be insure that the user login 

               localStorage.setItem("token", response.data.token);
               localStorage.setItem("user", JSON.stringify(response.data.user));


               const modal = document.getElementById("loginmodal")
               const modalinstance = bootstrap.Modal.getInstance(modal)
               modalinstance.hide();
            //    alert("user login in successfully");

               getUI();
               showAlert('User logged in successfully!', 'success');


           })


   }
   function getcurrentuser() {
    const storageUser = localStorage.getItem("user");

    return storageUser ? JSON.parse(storageUser) : null;
}
   function getUI() {
    const token1 = localStorage.getItem("token");
    const login = document.getElementById("login-btn");
    const register = document.getElementById("register-btn");
    const logout = document.getElementById("logoutdiv");
    const addposter = document.getElementById("addbutton");
 
    if (token1 == null) {
        login.style.visibility = "visible";
        register.style.visibility = "visible";
        addposter.style.setProperty("display", "none", "important");
        logout.style.setProperty("display", "none", "important");
    } else {
        login.style.visibility = "hidden";
        register.style.visibility = "hidden";
        addposter.style.setProperty("display", "flex", "important");
        logout.style.setProperty("display", "flex", "important");
 
        const user1 = getcurrentuser();
        if (user1) {
            document.getElementById("usernameuser").innerHTML = user1.username;
            document.getElementById("imageuser").src = user1.profile_image || ''; // Ensure a valid image URL or set a default
        } else {
            console.error("User data not found.");
        }
    }
 }

 
 function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert('User logged out successfully!', 'success');
    getUI();



}


function profclicked()
{ 
    const user =getcurrentuser()
    const userId = user.id
    
    window.location =`Profile.html?userid=${userId}`
}


function homeclicked()
{ 
    const user =getcurrentuser()
    const userId = user.id
    
    window.location =`Home.html?userid=${userId}`



}

	


