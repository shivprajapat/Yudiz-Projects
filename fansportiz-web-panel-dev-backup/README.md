Setup the repo

- Repo: https://gitlab.com/fantasy-wl/fantasy_app.git

git clone https://gitlab.com/fantasy-wl/fantasy_app.git

- That's first command run on your terminal and get the project on specific path
- After the successfully project set go to that specific project and run command ( npm i )
- npm i for install all the packages of project 
- after all package download redirect to the cd ./common/web for web Application 
- inside a web folder run the command ( yarn install ) for all packages inside a web folder.
- After All Packages download into your path its done with basic setup 

Yarn start 
- This command pass for run the our project.

npm run build
- Create a new build for that project.

Coding Guidelines
-----------------

- in the routes file i declare all the routes of a web pages.
- Inside common folder all the HOC files and Redux concepts are there.
- Common folder is for calling apis from app/web. here we are using a mono repo means inside a web/app both calling a apis from common function.
- Redux folder is create for all the apis related work and state manage.
- encryption.js folder create for a encrypt the password where same key set inside a backend side.
- helper is using a all common functions.
- inside a intl > messages.js file for all messages with different languages. and the language is set from setting.js file inside reducer folder.
- where we set the language for a whole the application.

Eslint Setup
-----------

- If you have not install eslint as a globally so that command is for add globally eslint
npm install -g eslint

- also required to add ESLint extension in visual studio code.
ESLint (Dirk Baeumer)
<!-- Install Eslint
--------------

- You can install ESLint using yarn:
yarn add eslint --dev

- You should then set up a configuration file, and the easiest way to do that is to use the --init flag:
yarn run eslint --init

Questions 

1. How would you like to use ESLint? - To check syntax and find problems
2. What type of modules does your project use? - JavaScript modules (import/export)
3. Which framework does your project use? - React
4. Does your project use TypeScript? - No
5. Where does your code run?  - Browser
6. What format do you want your config file to be in?  - javascript
7. The config that you've selected requires the following dependencies: 
    eslint-plugin-react@latest  ? Would you like to install them now with npm?  - Yes

- After that one file created as .eslintrc.js.  -->
