Setting up the project in GIT
-----------------------------

Create the project in GitHub
git@github.com:jffalcao/chatrooms.git

No need to add a README.md file can be aded from the local repo

Goto local repo
add a .gitignore file and add all the folders that have been created from external dependencies
in this case node_modules

git init
git add *
git commit -m "Initial Commit"
git remote add origin git@github.com:jffalcao/chatrooms.git
git push -f origin master

When you want to refresh your local repo from your remote

git pull origin master
