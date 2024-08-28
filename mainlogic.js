const baseurl = "https://tarmeezAcademy.com/api/v1/"
let currentpage = 1;
let lastpage = 1

window.addEventListener("scroll", function()
{
// //     const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
// //     if (endOfPage && currentpage < lastpage)
// // {
// //     // getposts(false,currentpage+1);
// //     currentpage = currentpage + 1  
// //     getposts(false,currentpage)
// }
}
); 
   getUI();
    

   getposts();
   
   
   // insurelogin();
   function getposts(reload = true, page = 1) {
    const baseurl = "https://tarmeezAcademy.com/api/v1/";
    const user = getcurrentuser(); // Get the currently logged-in user

    axios.get(`${baseurl}posts?limit=10&page=${page}`)
        .then(function(response) {
            const posts = response.data.data;
            const lastpage = response.data.meta.last_page;

            if (reload) {
                document.getElementById("posts").innerHTML = "";
            }

            for (const post of posts) {
                const author = post.author;
                const isAuthor = user && post.author.id === user.id; // Check if the current user is the author
                let posttitle = post.title || "";

                // Conditional buttons
                const editButton = isAuthor ? `<button id="edit-btn" class='btn btn-secondary btn-sm' onclick="editpostbtnlicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>` : '';
                const deleteButton = isAuthor ? `<button id="delete-btn" class='btn btn-danger btn-sm ms-2' onclick="deletepostbtnlicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>` : '';

                let content = `
                <div class="card shadow">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <div class="card-name d-inline-flex align-items-center" onclick="userclicked(${author.id})" style="cursor: pointer;">
                            <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width:40px; height:40px;">
                            <b class="ms-2">${author.username}</b>
                        </div>
                        <div>
                            ${editButton}
                            ${deleteButton}
                        </div>
                    </div>
                    <div class="card-body" onclick="postclicked(${post.id})" style="cursor: pointer;">
                        <img class="w-100 mb-3" src="${post.image}" alt="Post image">
                        <h6 class="text-muted">${post.created_at}</h6>
                        <h5 class="card-title">${posttitle}</h5>
                        <p class="card-text">${post.body}</p>
                        <hr>
                        <div class="d-flex align-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-pen me-2" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                            <span>(${post.comments_count}) Comments</span>
                            <span id="post-tags-${post.id}" class="ms-2"></span>
                        </div>
                    </div>
                </div>
                `;

                document.getElementById("posts").innerHTML += content;

                const currentposttagID = `post-tags-${post.id}`;
                document.getElementById(currentposttagID).innerHTML = "";

                for (const tag of post.tags) {
                    let contenttags = `  <button class="btn btn-sm rounded-5" style="color: white; background-color: grey"> ${tag.name} </button>`;
                    document.getElementById(currentposttagID).innerHTML += contenttags;
                }
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}


 
logout();


   function showAlert(message, type) {
       const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
       const wrapper = document.createElement('div');
       wrapper.classList.add('custom-alert'); // Add custom class for positioning
       wrapper.innerHTML = [
           `<div class="alert alert-${type} alert-dismissible" role="alert">`,
           `   <div>${message}</div>`,
           '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
           '</div>'
       ].join('');

       alertPlaceholder.append(wrapper);

       // Remove the alert after 2 seconds
       setTimeout(() => {
           wrapper.remove();
       }, 2000);
   }
   
   function postclicked(postId) {
    // alert(postId)
    
    const currentuser =  getcurrentuser()
    console.log(currentuser)
    if(currentuser)
    {
        getUI()
        console.log(getUI())
        console.log("called sucessfully ")
    }

    // const ui = getUI()
    // console.log(ui)

    // Retrieve the token directly from localStorage
    const tokennn = localStorage.getItem('token');
    const user = localStorage.getItem("user")

    if (!tokennn) {
        console.error("Token not found in localStorage.");
        alert("You need to log in first.");
        return; // Exit the function if the token is not found
    }
    if (!user) {
        console.error("Token not found in localStorage.");
        alert("You need to log in first.");
        return; // Exit the function if the token is not found
    }
    console.log("Token on page load:", tokennn);
    // alert(tokennn);

    // Call getUI and log a message to verify it's being called
    console.log("Calling getUI...");
    // getUI(); // This should call the getUI function

    // Additional debugging information
    console.log("Post ID:", postId);

    // Redirect to showpost.html with the postId
    window.location.href = `showpost.html?postId=${postId}`;

}


   // Example of how to use appendAlert
   // const alertTrigger = document.getElementById('liveAlertBtn');
   // if (alertTrigger) {
   //   alertTrigger.addEventListener('click', () => {
   //     appendAlert('Nice, you triggered this alert message!', 'success');
   //   });
   // }

  


function postfine() {
    console.log("postfine function called");

    const postId = document.getElementById("post-id-input").value;
    const isCreate = !postId; // Check if postId is null, empty, or false

    const title = document.getElementById("post-address").value;
    const body = document.getElementById("content-post").value;
    const image = document.getElementById("image-post").files[0];
    const token = localStorage.getItem("token");

    let formdata = new FormData();
    formdata.append("image", image);
    formdata.append("body", body);
    formdata.append("title", title);
    console.log(image, body);

    let url = "";
    const headers = {
        "Authorization": `Bearer ${token}`,
    };

    if (isCreate) {
        url = `${baseurl}posts`;
        axios.post(url, formdata, { headers: headers })
            .then(function (response) {
                console.log("Post created successfully:", response.data);

                localStorage.setItem("token", response.data.token);

                const modal = document.getElementById("postmodal");
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
            })
            .catch(function (error) {
                const message = error.response?.data?.message || 'An error occurred';
                showAlert(message, 'danger');
            });
    } else {
        url = `${baseurl}posts/${postId}`;
        axios.put(url, formdata, { headers: headers })
            .then(function (response) {
                console.log("Post updated successfully:", response.data);

                localStorage.setItem("token", response.data.token);

                const modal = document.getElementById("postmodal");
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
            })
            .catch(function (error) {
                const message = error.response?.data?.message || 'An error occurred';
                showAlert(message, 'danger');
            });
    }
}


function addbtnclicked()
{
    
     document.getElementById("submit-post").innerHTML="Create"
     document.getElementById("post-title-label").innerHTML="Create A New Post"
     document.getElementById("post-id-input").value=""
     document.getElementById("post-address").value=""
     document.getElementById("content-post").value=""




     let modelpost = new bootstrap.Modal(document.getElementById("postmodal"),{})
     modelpost.toggle()
}

function editpostbtnlicked(postobject)
{
   
    const postIdInput = document.getElementById("post-id-input");

    const postId = postIdInput ? postIdInput.value.trim() : '';
   
  
    let post =JSON.parse(decodeURIComponent(postobject))
     console.log("clicked")
     console.log(post)
     
     document.getElementById("submit-post").innerHTML="Update"
     document.getElementById("post-title-label").innerHTML="Edit Post"
     document.getElementById("post-id-input").value=post.id
     document.getElementById("post-address").value=post.title
     document.getElementById("content-post").value=post.body




     let modelpost = new bootstrap.Modal(document.getElementById("postmodal"),{})
     modelpost.toggle()
}

function creatingpost() {
    const baseurl = "https://tarmeezAcademy.com/api/v1"; // Ensure there's no trailing slash

    const postIdInput = document.getElementById("post-id-input");
    const postId = postIdInput ? postIdInput.value.trim() : '';
    const isCreate = !postId; // Determine if creating a new post

    const title = document.getElementById("post-address").value;
    const body = document.getElementById("content-post").value;
    const image = document.getElementById("image-post").files[0];
    const token = localStorage.getItem("token");

    let formData = new FormData();
    formData.append("body", body);
    formData.append("title", title);
    formData.append("image", image);

    const headers = {
        "Authorization": `Bearer ${token}`
    };

    if (isCreate) {
        let url = `${baseurl}/posts`; // Default URL
        // Creating a new post
        axios.post(url, formData, { headers: headers })
            .then((response) => {
                console.log("Post created successfully:", response.data); // Log response data
                const modal = document.getElementById("postmodal");
                const modalInstance = bootstrap.Modal.getInstance(modal);
                modalInstance.hide();
                showAlert("New Post Has Been Created", "success");
                getposts();
            })
            .catch((error) => {
                const message = error.response?.data?.message || 'An error occurred';
                showAlert(message, "danger");
            });
    } else {


            formData.append("_method", "put")
            url = `${baseurl}/posts/${postId}`
        
        axios.post(url, formData, {
            headers: headers
        })
        .then((response)=>{
            const modal = document.getElementById("postmodal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            showAlert("New Post Has Been Created", "success")
            getposts()
    
        })
        .catch((error) => {
            const message = error.response.data.message
            showAlert(message, "danger")
        })
       
    }
}

function deletepostbtnlicked(postobjectdelete) {
    let post = JSON.parse(decodeURIComponent(postobjectdelete));
    console.log(post);
    document.getElementById("post-id-delete").value = post.id;

    let modelpost = new bootstrap.Modal(document.getElementById("deletemodal"), {});
    modelpost.toggle();
}

function deletepost() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Token not found. User might not be logged in.");
        showAlert("You're not authorized to delete this post. Please log in.", 'danger');
        return;
    }

    const postId = document.getElementById("post-id-delete").value;
    const url = `${baseurl}posts/${postId}`;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    axios.delete(url, { headers: headers })
        .then(function (response) {
            console.log(response.data);

            const modal = document.getElementById("deletemodal");
            const modalinstance = bootstrap.Modal.getInstance(modal);
            modalinstance.hide();

            showAlert("Post deleted successfully", 'success');

            getposts(); // Refresh the posts after deletion
        })
        .catch(function (error) {
            console.error("Error deleting post:", error);
            if (error.response && error.response.status === 401) {
                showAlert("You're not authorized to delete this post. Please log in.", 'danger');
            } else {
                showAlert("Failed to delete the post", 'danger');
            }
        });
}


function userclicked(userID)
{
    // alert(userID)
    // let x = getUI()
    // console.log("get ui si")
    // console.log(x)

   window.location = `Profile.html?userid=${userID}`

}
function profileclicked()

{ 
    getUI()

    const user = getcurrentuser()
    // alert(user.id)
    const userID = user.id
    const currentuser =  getcurrentuser()
    console.log(currentuser)
    if(currentuser)
    {
        getUI()
        console.log(getUI())
        console.log("called sucessfully ")
    }

    // const ui = getUI()
    // console.log(ui)

    // Retrieve the token directly from localStorage
    const tokennn = localStorage.getItem('token');
    // const user = localStorage.getItem("user")

    if (!tokennn) {
        console.error("Token not found in localStorage.");
        alert("You need to log in first.");
        return; // Exit the function if the token is not found
    }
    if (!user) {
        console.error("Token not found in localStorage.");
        alert("You need to log in first.");
        return; // Exit the function if the token is not found
    }
    console.log("Token on page load:", tokennn);
    // alert(tokennn);

    // Call getUI and log a message to verify it's being called
    console.log("Calling getUI...");
    // getUI(); // This should call the getUI function

    // Additional debugging information
    console.log("Post ID:", postId);

    // Redirect to showpost.html with the postId
    window.location.href = `showpost.html?postId=${postId}`;



    window.location = `showpost.html?userid=${userID}`

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
 
        // const user1 = getcurrentuser();
        const user1 = getcurrentuser();
        if (user1) {
            document.getElementById("usernameuser").innerHTML = user1.username;
            document.getElementById("imageuser").src = user1.profile_image || ''; // Ensure a valid image URL or set a default
        } else {
            console.error("User data not found.");
        }
    
    }
 }





	