const card = (post) => {
    return `
                <div class="card z-depth-4">
                    <div class="card-content">
                        <span class="card-title">${post.title}</span>
                        <p style="white-space: pre-line">${post.text}</p>
                        <small>${new Date(post.date).toLocaleDateString()}</small>
                    </div>
                    <div class="card-action">
                        <button class="modal-trigger btn-small red js-remove" data-target="removePost" data-id="${post._id}">
                            <i class="material icons js-remove" data-id="${post._id}">Delete</i>
                        </button>
                    </div>
                </div>
    `
};

const BASE_URL = "/api/post";
let posts = [];

class PostApi {
    static getAllData() {
        return fetch(BASE_URL, {method: "get"}).then(response => response.json());
    }

    static create(post) {
        return fetch(BASE_URL, {
            method: "post",
            body: JSON.stringify(post),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
    }

    static remove(id) {
        return fetch(`${BASE_URL}/${id}`, {method: "delete"}).then(response => response.json());
    }

}

document.addEventListener("DOMContentLoaded", () => {
    PostApi.getAllData().then(backendPosts => {
        posts = backendPosts.concat();
        renderPosts(posts);
    });
    var elems = document.querySelectorAll('.modal');
    modals = M.Modal.init(elems);
    console.log(modals);
    document.querySelector('#createPost').addEventListener("click", onCreatePost);
    document.querySelector('#posts').addEventListener("click", onDeletePosts);
});

function renderPosts(arr = []) {
    const el = document.querySelector("#posts");
    if (arr.length > 0) {
        el.innerHTML = posts.map(post => card(post)).join(" ");
    }
    else {
        el.innerHTML = `<div class="center">No results</div>`
    }
}

function onCreatePost() {
    const elTitle = document.querySelector('#title');
    const elText = document.querySelector('#text');
    if (elTitle.value && elText.value) {
        const newPost = {
            title: elTitle.value,
            text: elText.value
        };
        PostApi.create(newPost).then(post => {
            posts.push(post);
            renderPosts(posts);
        });
        modals[0].close();
        elTitle.value = "";
        elText.value = "";
        M.updateTextFields();
    }
}

function onDeletePosts(event) {
    if (event.target.classList.contains("js-remove")) {

        document.querySelector("#confDelete").addEventListener("click", () => {
            const id = event.target.getAttribute("data-id");
            PostApi.remove(id).then(() => {
                const postIndex = posts.findIndex(post => post._id == id);
                posts.splice(postIndex, 1);
                modals[1].close();
                renderPosts(posts);
            });
        });
        document.querySelector("#rejDelete").addEventListener("click", () => modals[1].close());
        /*const decision = confirm("Are you sure to delete?");
        if (decision) {
            const id = event.target.getAttribute("data-id");
            PostApi.remove(id).then(() => {
                const postIndex = posts.findIndex(post => post._id == id);
                posts.splice(postIndex, 1);
                //alert("Post deleted");
                renderPosts(posts);
            });
        }*/
    }
}