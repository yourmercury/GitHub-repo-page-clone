let query = `{
  viewer{
    login
    name
    avatarUrl
    twitterUsername
    location
    bio
    repositories(first:20, orderBy: {field: UPDATED_AT, direction: DESC}) {
      totalCount
      edges {
        node {
          id
          description
          updatedAt
          resourcePath
          projectsResourcePath
          name
          languages(first: 3){
            edges{
              node {
                id
                name
                color
              }
            }
          }
        }
      }
    }
  }
}`;

let token = '';

let repos = document.querySelector('.repos-preview');

let printRes = ({ data }) => {
  let { viewer } = data;
  let { repositories } = viewer;
  let preview;

  let avatar = document.querySelector(".avatar");
  let bio = document.querySelector('.bio');
  let fullName = document.querySelector('.full-name');
  let userName = document.querySelector('.login-name');
  let repoCount = document.querySelector('.repo-count');
  let smallDp = document.querySelectorAll('.small-dp img');
  let smallNavName = document.querySelector('.small-dp > span');

  repoCount.innerHTML = repositories.totalCount

  bio.innerHTML = viewer.bio
  avatar.src = viewer.avatarUrl;
  avatar.style.display = 'inline';
  fullName.innerHTML = viewer.name;
  userName.innerHTML = viewer.login;
  smallNavName.innerHTML = viewer.login;
  smallDp.forEach(dp => {
    dp.src = viewer.avatarUrl;
    dp.style.display = 'inline-block'
  })

  let j = `<p class="languages"><span class="circle"></span><span>JavaScript</span> Updated 3 days ago</p>`


  repositories.edges.forEach(repo => {
    let date = new Date(repo.node.updatedAt)
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    let lang;
    repo.node.languages.edges.forEach(({node}) => {
      if (lang) {
        lang += `<span class="circle" style="background: ${node.color}"></span><span>${node.name}</span>`
      } else {
        lang = `<span class="circle" style="background: ${node.color}"></span><span>${node.name}</span>`
      }
    })
    if (preview) {
      preview += `<li class="preview">
                        <h2><a href="https://github.com${repo.node.resourcePath}">${repo.node.name}</a></h2>
                        <p class="description">${repo.node.description}</p>
                        <p class="languages">${lang} Updated on ${date.getDate() + " " + months[date.getMonth()]}</p>
                    </li>`
    } else {
      preview = `<li class="preview">
                        <h2><a href="https://github.com${repo.node.resourcePath}">${repo.node.name}</a></h2>
                        <p class="description">${repo.node.description}</p>
                        <p class="languages">${lang} Updated on ${date.getDate() + " " + months[date.getMonth()]}</p>
                    </li>`
    }
  })


  repos.innerHTML += preview;
}

window.onload = () => {
  fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${token}` },
    body: JSON.stringify({
      query: query
    })
  }).then(res => res.json()).then(printRes)

  let mobileNav = document.querySelector('.mobile-nav');
  let ham = document.querySelector('.fa-bars');

  ham.onclick = () => {
    mobileNav.classList.toggle('block');
  }
}

window.onresize = () => {

}