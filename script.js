const portfolioState={theme:localStorage.getItem('portfolio-theme')||'dark',words:['Java Backend Developer','Python Developer','API Builder','Software Developer']};
const root=document.documentElement;
const themeSwitch=document.getElementById('themeSwitch');
const typingTarget=document.getElementById('typingTarget');
const githubProjects=document.getElementById('githubProjects');
root.dataset.theme=portfolioState.theme;

function renderThemeIcon(){themeSwitch.innerHTML=`<i data-lucide="${portfolioState.theme==='dark'?'sun':'moon'}"></i>`;lucide.createIcons()}
function switchTheme(){portfolioState.theme=portfolioState.theme==='dark'?'light':'dark';root.dataset.theme=portfolioState.theme;localStorage.setItem('portfolio-theme',portfolioState.theme);renderThemeIcon()}

themeSwitch.addEventListener('click',switchTheme);
renderThemeIcon();

let wordIndex=0;let letterIndex=0;let deleting=false;
function runTyping(){const currentWord=portfolioState.words[wordIndex];typingTarget.textContent=currentWord.slice(0,letterIndex);if(!deleting&&letterIndex<currentWord.length){letterIndex++;setTimeout(runTyping,65);return}if(!deleting){deleting=true;setTimeout(runTyping,1400);return}if(letterIndex>0){letterIndex--;setTimeout(runTyping,32);return}deleting=false;wordIndex=(wordIndex+1)%portfolioState.words.length;setTimeout(runTyping,250)}
setTimeout(runTyping,500);

async function loadGithubData(){try{const profileResponse=await fetch('https://api.github.com/users/devmatheus32');if(!profileResponse.ok)throw new Error('profile');const profile=await profileResponse.json();document.getElementById('repoCount').textContent=profile.public_repos;document.getElementById('followerCount').textContent=profile.followers;const repositoriesResponse=await fetch('https://api.github.com/users/devmatheus32/repos?sort=updated&per_page=8');if(!repositoriesResponse.ok)throw new Error('repos');const repositories=await repositoriesResponse.json();const visibleRepositories=repositories.filter(repository=>repository.name!=='mazinn444'&&repository.name!=='devmatheus32.github.io'&&repository.name!=='MoonGUI').slice(0,4);let stars=0;repositories.forEach(repository=>stars+=repository.stargazers_count||0);document.getElementById('starCount').textContent=stars;githubProjects.innerHTML=visibleRepositories.map(repository=>`<a class="github-mini" href="${repository.html_url}" target="_blank" rel="noreferrer"><h4>${repository.name}</h4><p>${repository.description||'Projeto sem descrição.'}</p><div class="github-mini-meta"><span>${repository.language||'Código'}</span><span>★ ${repository.stargazers_count}</span><span>⑂ ${repository.forks_count}</span></div></a>`).join('');const commitCount=await countRecentCommits();document.getElementById('commitCount').textContent=commitCount}catch(error){document.getElementById('repoCount').textContent='--';document.getElementById('followerCount').textContent='--';document.getElementById('starCount').textContent='--'}}
async function countRecentCommits(){const response=await fetch('https://api.github.com/search/commits?q=author:devmatheus32');if(!response.ok)return '--';const data=await response.json();return data.total_count>999?`${Math.floor(data.total_count/1000)}k+`:data.total_count}

lucide.createIcons();
loadGithubData();
