getuser()
function getuser(){


    const urlparams = new URLSearchParams(window.location.search)
   const id = urlparams.get("userid")
   console.log(id)

   
    const baseurl = "https://tarmeezAcademy.com/api/v1/"
       // const baseurl = "https://tarmeezAcademy.com/api/v1/"
   axios.get(`${baseurl}users/${id}`)
       .then(function (response) {
        console.log(response.data)
        console.log("aya")

        const user = response.data.data;
        document.getElementById("main-info-email").innerHTML = user.email;
        document.getElementById("main-info-name").innerHTML = user.name;
        document.getElementById("main-info-username").innerHTML = user.username;
        document.getElementById("postcount").innerHTML = user.posts_count;
        document.getElementById("commentcount").innerHTML = user.comments_count;
        document.getElementById("user-profile-image").src = user.profile_image; // Updated ID
        
        document.getElementById("nameofpost").innerHTML = user.username;
        
        // <div class="mb-2"class="user-main-info" id="main-info-email">araby85832gmail.com</div>
        // <div class="mb-2" class="user-main-info" id="main-info-name">Aya Oraby</div>
        // <div class="mb-2"class="user-main-info" id="main-info-username">Philomath</div>

        


       })
       .catch(function (error) {
           // handle error
           console.log(error);
       })
   }


getposts()

function getposts() {
    const baseurl = "https://tarmeezAcademy.com/api/v1/";
    const urlparams = new URLSearchParams(window.location.search);
    const userId = urlparams.get("userid");

    axios.get(`${baseurl}users/${userId}/posts`)
        .then(function(response) {
            const posts = response.data.data;
            const user = getcurrentuser(); // Get the current logged-in user
            const userId = user ? user.id : null; // Current user ID

            document.getElementById("user-posts").innerHTML = "";

            for (const post of posts) {
                const author = post.author;
                const isAuthor = userId && post.author.id === userId; // Check if the current user is the author

                let posttitle = post.title || "";

                // Conditional buttons
                const editButton = isAuthor ? `<button id="edit-btn" class='btn btn-secondary btn-sm' onclick="editpostbtnlicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>` : '';
                const deleteButton = isAuthor ? `<button id="delete-btn" class='btn btn-danger btn-sm ms-2' onclick="deletepostbtnlicked('${encodeURIComponent(JSON.stringify(post))}')">Delete</button>` : '';

                let content = `
                <div class="card shadow">
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center">
                            <img class="rounded-circle border border-2" src="${author.profile_image}" alt="" style="width:40px; height:40px;">
                            <b class="ms-2">${author.username}</b>
                        </div>
                        <div>
                            ${editButton}
                            ${deleteButton}
                        </div>
                    </div>
                    <div class="card-body" onclick="postclicked(${post.id})" style="cursor:pointer">
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

                document.getElementById("user-posts").innerHTML += content;

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

// Function to get the current user from localStorage

function creatingpost()
{
    console.log("postcreate function called")
    let postId= document.getElementById("post-id-input")
    alert(postId)
    const title = document.getElementById("post-address").value;
    const body = document.getElementById("content-post").value;
    const image = document.getElementById("image-post").files[0];

    let formdata = new FormData();
    formdata.append("image", image);
    formdata.append("body", body);
    formdata.append("title", title);
    console.log(image, body);

    let url = `${baseurl}posts`;
    const token = localStorage.getItem("token");
    const headers = {
        "authorization": `Bearer ${token}`,
    };

    axios.post(url, formdata, { headers: headers })
        .then(function (response) {
            console.log(response.data.token);

            // Ensure that the user is registered
            localStorage.setItem("token", response.data.token);
            // localStorage.setItem("user", JSON.stringify(response.data.user));

            const modal = document.getElementById("postmodal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            getUI()


        })
        .catch(function (error) {
            const message = error.response.data.message;
            showAlert(message, 'danger'); // Assuming `showAlert` takes a message and a type
        });
}

function deletepostbtnlicked(postobjectdelete)
{
    // alert("clicked")
    
    let post =JSON.parse(decodeURIComponent(postobjectdelete))
    //  console.log("clicked")
     console.log(post)
     document.getElementById("post-id-delete").value =post.id
    //  document.getElementById("submit-post").innerHTML="Update"
    //  document.getElementById("post-title-label").innerHTML="Edit Post"
    //  document.getElementById("post-id-input").value=post.id
    //  document.getElementById("post-address").value=post.title
    //  document.getElementById("content-post").value=post.body


     let modelpost = new bootstrap.Modal(document.getElementById("deletemodal"),{})
     modelpost.toggle()
}

function deletepost()
{
     const token =localStorage.getItem("token")
    const postId= document.getElementById("post-id-delete").value
     const url = `${baseurl}posts/${postId}`
    alert("deleteclicked")
    // alert("success");
    const headers = {
        'Content-Type': 'multipart/form-data',

        "authorization": `Bearer ${token}`
    };
    axios.delete(url, 
        {headers :headers

        }
    )
        .then(function (response) {
            console.log(response.data.token);
        

            //to be insure that the user login 

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));


            const modal = document.getElementById("deletemodal")
            const modalinstance = bootstrap.Modal.getInstance(modal)
            modalinstance.hide();
            // alert("Post deleted successfully");

            showAlert("Post deleted successfully", 'success')


        })
        .catch(function (error) {
            // handle error
            showAlert(error, 'danger')
        })
       


}

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (!token) {
        showAlert('Please log in to access this page', 'warning');
       
    }
}

// Handle Error
function handleError(error) {
    if (error.response && error.response.status === 401) {
        showAlert('Session expired. Please log in again.', 'danger');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    } else {
        showAlert(error.message || 'An error occurred', 'danger');
    }
}



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
   
   function postclicked( postId)
   {
        // console.log(postId);
        alert(postId )
    
      window.location = `showpost.html?postId=${postId}`
      getUI()
   }
function editbutton()
{

}
function postfine()
{
    console.log("postcreate function called")
    let postId= document.getElementById("post-id-input").value
    let isccreate =postId ==null || postId  =="" || postId ==false
    // alert(postId)
    // return

    const title = document.getElementById("post-address").value;
    const body = document.getElementById("content-post").value;
    const image = document.getElementById("image-post").files[0];
    const token = localStorage.getItem("token");


    let formdata = new FormData();
    formdata.append("image", image);
    formdata.append("body", body);
    formdata.append("title", title);
    console.log(image, body);

    let url = ``;
    const headers = {
        "authorization": `Bearer ${token}`,
    };


    if (isccreate)
    {
         url = `${baseurl}posts`;
        axios.post(url, formdata, { headers: headers })
        .then(function (response) {
            console.log(response.data.token);

            // Ensure that the user is registered
            localStorage.setItem("token", response.data.token);
            // localStorage.setItem("user", JSON.stringify(response.data.user));

            const modal = document.getElementById("postmodal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

        })
        .catch(function (error) {
            const message = error.response.data.message;
            showAlert(message, 'danger'); // Assuming `showAlert` takes a message and a type
        });

    }
    else 
    {
        formData.append("_method","put")
         url = `${baseurl}posts/${postId}`;
        axios.post(url, formdata, { headers: headers })
        .then(function (response) {
            console.log(response.data.token);

            // Ensure that the user is registered
            localStorage.setItem("token", response.data.token);
            // localStorage.setItem("user", JSON.stringify(response.data.user));

            const modal = document.getElementById("postmodal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

        })
        .catch(function (error) {
            const message = error.response.data.message;
            showAlert(message, 'danger'); // Assuming `showAlert` takes a message and a type
        });

    }

   
}

function editpostold()
{
    console.log("postcreate function called")
    const title = document.getElementById("post-address").value;
    const body = document.getElementById("content-post").value;
    const image = document.getElementById("image-post").files[0];

    let formdata = new FormData();
    formdata.append("image", image);
    formdata.append("body", body);
    formdata.append("title", title);
    console.log(image, body);

    let url = `${baseurl}posts`;
    const token = localStorage.getItem("token");
    const headers = {
        "authorization": `Bearer ${token}`,
    };

    axios.post(url, formdata, { headers: headers })
        .then(function (response) {
            console.log(response.data.token);

            // Ensure that the user is registered
            localStorage.setItem("token", response.data.token);
            // localStorage.setItem("user", JSON.stringify(response.data.user));

            const modal = document.getElementById("postmodal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();

        })
        .catch(function (error) {
            const message = error.response.data.message;
            showAlert(message, 'danger'); // Assuming `showAlert` takes a message and a type
        });
}
function editpostbtnlicked(postobject)
{
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

function editpostbtnlicked(postobject)
{
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

function creatingpost()
{
    console.log("postcreate function called")
    let postId= document.getElementById("post-id-input")
    alert(postId)
    const title = document.getElementById("post-address").value;
    const body = document.getElementById("content-post").value;
    const image = document.getElementById("image-post").files[0];

    let formdata = new FormData();
    formdata.append("image", image);
    formdata.append("body", body);
    formdata.append("title", title);
    console.log(image, body);

    let url = `${baseurl}posts`;
    const token = localStorage.getItem("token");
    const headers = {
        "authorization": `Bearer ${token}`,
    };

    axios.post(url, formdata, { headers: headers })
        .then(function (response) {
            console.log(response.data.token);

            // Ensure that the user is registered
            localStorage.setItem("token", response.data.token);
            // localStorage.setItem("user", JSON.stringify(response.data.user));

            const modal = document.getElementById("postmodal");
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
            getUI()


        })
        .catch(function (error) {
            const message = error.response.data.message;
            showAlert(message, 'danger'); // Assuming `showAlert` takes a message and a type
        });
}

function deletepostbtnlicked(postobjectdelete)
{
    // alert("clicked")
    
    let post =JSON.parse(decodeURIComponent(postobjectdelete))
    //  console.log("clicked")
     console.log(post)
     document.getElementById("post-id-delete").value =post.id
    //  document.getElementById("submit-post").innerHTML="Update"
    //  document.getElementById("post-title-label").innerHTML="Edit Post"
    //  document.getElementById("post-id-input").value=post.id
    //  document.getElementById("post-address").value=post.title
    //  document.getElementById("content-post").value=post.body


     let modelpost = new bootstrap.Modal(document.getElementById("deletemodal"),{})
     modelpost.toggle()
}

function deletepost()
{
     const token =localStorage.getItem("token")
    const postId= document.getElementById("post-id-delete").value
     const url = `${baseurl}posts/${postId}`
    alert("deleteclicked")
    // alert("success");
    const headers = {
        'Content-Type': 'multipart/form-data',

        "authorization": `Bearer ${token}`
    };
    axios.delete(url, 
        {headers :headers

        }
    )
        .then(function (response) {
            console.log(response.data.token);
        

            //to be insure that the user login 

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));


            const modal = document.getElementById("deletemodal")
            const modalinstance = bootstrap.Modal.getInstance(modal)
            modalinstance.hide();
            // alert("Post deleted successfully");

            showAlert("Post deleted successfully", 'success')


        })
        .catch(function (error) {
            // handle error
            showAlert(error, 'danger')
        })
       


}


