const APIURL = "https://api.github.com/users/";
const main = document.querySelector("#main");
const searchBox = document.querySelector("#search");
const userCard = document.querySelector("#user-card");
const reposContainer = document.querySelector("#repos");
const paginationContainer = document.querySelector("#pagination");

let currentUser = "";
let reposPerPage = 10;
let currentPage = 1;
let totalPages = 1;

const loader = document.getElementById('loader');

const showLoader = () => {
    loader.style.display = 'block';
};

const hideLoader = () => {
    loader.style.display = 'none';
};

const getUser = async (username, page = 1) => {
    try {
        showLoader(); 
        const userResponse = await fetch(`${APIURL}${username}`);
        const userData = await userResponse.json();

        currentUser = username;

        renderUserCard(userData);
        getRepos(username, page);
    } catch (error) {
        console.error('Error fetching user data:', error);
    } finally {
        hideLoader(); 
    }
    renderPagination(currentUser, totalRepos);
};

const getRepos = async (username, page) => {
    try {
        const response = await fetch(`${APIURL}${username}/repos`);
        const data = await response.json();

        const startIndex = (page - 1) * reposPerPage;
        const endIndex = startIndex + reposPerPage;
        const slicedRepos = data.slice(startIndex, endIndex);

        renderRepos(slicedRepos);

        const totalRepos = data.length;
        totalPages = Math.ceil(totalRepos / reposPerPage);

        renderPagination(username, totalRepos);
    } catch (error) {
        console.error('Error fetching repos:', error);
    }
};

const renderUserCard = (data) => {
    userCard.innerHTML = `
        <div>
            <img class="avatar" src="${data.avatar_url}" alt="${data.name || 'User'}">
        </div>
        <div class="user-info">
            <h2>${data.name}</h2>
            <p>${data.bio || 'No bio available'}</p>

            <ul class="info">
                <li>${data.followers}<strong>Followers</strong></li>
                <li>${data.following}<strong>Following</strong></li>
                <li>${data.public_repos}<strong>Repos</strong></li>
            </ul>

            ${data.location ? `
                <p>
                    <svg class="octicon octicon-location" viewBox="0 0 16 15" version="1.1" width="16" height="16" aria-hidden="true">
                        <path d="m12.596 11.596-3.535 3.536a1.5 1.5 0 0 1-2.122 0l-3.535-3.536a6.5 6.5 0 1 1 9.192-9.193 6.5 6.5 0 0 1 0 9.193Zm-1.06-8.132v-.001a5 5 0 1 0-7.072 7.072L8 14.07l3.536-3.534a5 5 0 0 0 0-7.072ZM8 9a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 9Z" fill="white"></path>
                    </svg>
                    ${data.location}
                </p>
            ` : ''}

            ${data.blog ? `
                <p>
                <svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true">
                    <path fill-rule="evenodd" d="M11.75 1a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM1.75 4.25a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0zM4.5 14a1.75 1.75 0 0 1 0-3.5 1.75 1.75 0 0 1 0 3.5zM14 11.75a1.75 1.75 0 1 1-3.5 0 1.75 1.75 0 0 1 3.5 0zM11.47 3.22a3 3 0 0 1 0 4.24l-7.78 7.78a3 3 0 0 1-4.24 0 3 3 0 0 1 0-4.24l7.78-7.78a3 3 0 0 1 4.24 0z" style="fill: white;"></path>
                </svg>
                    <a href="${data.blog}" target="_blank" style="color: white; text-decoration: none;">${data.blog}</a>
                </p>
            ` : ''}

            <!-- Add social links here -->
            ${data.twitter ? `<a href="https://twitter.com/${data.twitter}" target="_blank" style="color: white; text-decoration: none;"><img class="social-icon" src="twitter-icon.svg" alt="Twitter" style="fill: white;"></a>` : ''}
            ${data.facebook ? `<a href="https://facebook.com/${data.facebook}" target="_blank" style="color: white; text-decoration: none;"><img class="social-icon" src="facebook-icon.svg" alt="Facebook" style="fill: white;"></a>` : ''}
            ${data.instagram ? `<a href="https://instagram.com/${data.instagram}" target="_blank" style="color: white; text-decoration: none;"><img class="social-icon" src="instagram-icon.svg" alt="Instagram" style="fill: white;"></a>` : ''}

            <!-- Add GitHub homepage link -->
            <p>
                <svg class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" style="fill: white;">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38C13.71 14.53 16 11.54 16 8c0-4.42-3.58-8-8-8Z"></path>
                </svg>
                <a href="${data.html_url}" target="_blank" style="color: white; text-decoration: none;">GitHub</a>
            </p>
        </div>
    `;
};



const renderRepos = async (repos) => {
    reposContainer.innerHTML = "";

    for (const item of repos) {
        const repoCard = document.createElement("div");
        repoCard.classList.add("repo-card");

        const repoName = document.createElement("h3");
        repoName.innerText = item.name;

        const repoDescription = document.createElement("p");
        repoDescription.innerText = item.description || "No description available";

        const repoSkills = document.createElement("div");
        repoSkills.classList.add("repo-skills");

        const languagesUrl = `https://api.github.com/repos/${item.owner.login}/${item.name}/languages`;
        const languagesResponse = await fetch(languagesUrl);

        if (languagesResponse.ok) {
            const languagesData = await languagesResponse.json();
            const repoLanguages = Object.keys(languagesData);

            repoLanguages.forEach((language) => {
                const skillButton = document.createElement("button");
                skillButton.classList.add("skill-button");
                skillButton.innerText = language;

                repoSkills.appendChild(skillButton);
            });
        } else {
            repoSkills.innerText = "Unable to fetch languages";
        }

        const repoLink = document.createElement("a");
        repoLink.classList.add("repo-link", "view-repo"); 
        repoLink.href = item.html_url;
        repoLink.innerText = "View Repo";
        repoLink.target = "_blank";

        repoCard.appendChild(repoName);
        repoCard.appendChild(repoDescription);
        repoCard.appendChild(repoSkills);
        repoCard.appendChild(repoLink);

        reposContainer.appendChild(repoCard);
    }
};



let reposPerPageSelect = document.querySelector("#reposPerPage");

const changeReposPerPage = () => {
    reposPerPage = parseInt(reposPerPageSelect.value);
    currentPage = 1;
    getUser(currentUser, currentPage);
};

const renderPagination = (username, totalRepos) => {
    paginationContainer.innerHTML = "";

    const maxDisplayedPages = 7;
    const totalPages = Math.ceil(totalRepos / reposPerPage);

    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

    if (totalPages <= maxDisplayedPages) {
        endPage = totalPages;
    } else if (currentPage <= Math.floor(maxDisplayedPages / 2)) {
        endPage = maxDisplayedPages;
    } else if (currentPage + Math.floor(maxDisplayedPages / 2) >= totalPages) {
        startPage = totalPages - maxDisplayedPages + 1;
    }

    const prevButton = document.createElement("button");
    prevButton.innerHTML = "&#8249;";
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            getRepos(username, currentPage);
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.innerText = i;
        button.addEventListener("click", () => {
            currentPage = i;
            getRepos(username, currentPage);
        });

        if (i === currentPage) {
            button.classList.add('active');
        }

        paginationContainer.appendChild(button);
    }

    const nextButton = document.createElement("button");
    nextButton.innerHTML = "&#8250;";
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            getRepos(username, currentPage);
        }
    });
    paginationContainer.appendChild(nextButton);
};

const formSubmit = () => {
    const username = searchBox.value.trim();

    const defaultUsername = "566u43";
    const finalUsername = username || defaultUsername;

    getUser(finalUsername, currentPage);
    searchBox.value = "";
    return false;
};

getUser("566u43", currentPage);

// searchBox.addEventListener("focusout", formSubmit);
