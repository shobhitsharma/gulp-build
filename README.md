# gulp-build

Customized frontend application builder.
 - **Watch**: watches your project directory for changes and acts accordingly depending on what you've changed.
 - **LiveReload**: if you add, delete or make a change in any file the  browser will be automatically refreshed.
 - **Auto-inject changed CSS in the browser**: If you make a change in a ```.css, .scss, .sass``` file it will automatically inject the changes in the browser so you don't even have to do a full page reload. If you're viewing your application on multiple browsers you will see the changes reflect immediately.
This may especially come in handy when you're writing/debugging css for a part of your application that isn't visible or reachable at a first glance. For example if you're debugging a dialog that can only be shown with doing few clicks, or a section that's far down your page. 
A full page refresh will throw you off track every time you make a change, but when your css is auto-injected you will see the changes instantly no matter which part of your site your editing.
 - **Compile SASS**: Compiles sass/scss, suports **sass globbing** so you can import whole folders (not a default feature of sass) so for example you can write ```@import "sections/*";``` and have your whole folder imported.
 - **Compile Jade/Coffeescript**: Compiles jade files to html and coffeescript files to .js
 - **Autoprefix CSS**: It makes your CSS development a little bit easier so you don't have to put all the browser prefixes by yourself. They'll be automatically added so when you write ``` display:flex ``` it will add the ```-webkit and -ms-``` prefixes automatically.
 - **Image Minification**: Your png and jpg images are going to get optimizied and minified by imagemin automatically.
 - **Convert ES6, concatenate, minify & annotate**: Your .js files will be concatenated in one ``` app.js ``` file. If you're using angular your code will be automatically annotated so you don't [have to write your dependencies as strings](https://docs.angularjs.org/tutorial/step_05). ES6 syntax will be converted to ES5 with babel. If you're building the app in production mode the code will be uglified (minified). 
 - **Notifications on compliation errors**. If you have an error in a sass/jade/coffeescript file you don't have to open the terminal everytime to check what the error was. You will get a native Linux/Windows/OS X notification with the error so you can start fixing it immediately.
 - **Include bower dependencies**: If you have some bower dependencies installed it will find their main files and include them in their final build, no matter if they're css or js. So for example if in your project directory you run ```bower install angular jquery --save ``` the angular and jquery main files would end up in your lib.js library. And if you ``` bower install normalize.css --save ``` the normalize.css will end up in your lib.css file. 
 - **Include library fonts**: Let's say you have **bootstrap** or **fontawesome** installed as a bower dependencies. builder will take the fonts out of the library and copy them in your build folder and it will also modify their css files to link to the fonts properly. So you don't need to bother to manually copy or include the fonts from popular libraries.
 - **Run a server**: Your app will be served by default on ```http://localhost:9000```
 This has few benefits. The first one is that you can open the url on multiple devices on your network and debug the changes on a pc, laptop, tablet and phone simultaneously.
 The second benefit is that you can use configure the router of your app to use HTML5 mode (urls without hashbangs #) without a problem. 
 
## Storage
 - ```/home/YourUsername/projects.json``` (Linux)
 - ```/Users/YourUsername/projects.json``` (OS X)
 - ```C:\Users\YourUsername\projects.json``` (Windows)
 
## Files that builder adds to your project

 - **builder-project-config.json** This file contains the directory configuration of your project. You can specify the names of your js, css, fonts, template, bower and other folders so builder can know where to look for them. This file should be added to subversion (git or svn) so every repository member can have the directory structure for the project when they run it with builder on their machine.
 -  **builder-user-config.json** It's reccomended that this file isn't added to git so every repository member can have his own configuration on his machine because this file contains options that are not tied to the project, but they're more like user preferences. This file contains the following options:
	 -  ```modifyGitignore```*(boolean)*: Should builder go through the project's ```.gitignore``` file and make sure that folders like ```bower_components``` and the build folder of the project are ignored so they're not commited to git.
	 -  ```copyToFolder```*(string)*: The path to which you want your files to be copied in the ```build:copy``` task. 
	 -  ```port``` *(int)*: The port on which the server should serve the project (default is 9000)
	 -  ```openAfterLaunch```*(boolean)*: Should the http://localhost:port url be opened immediately after builder starts a project
	 -  ```liveReload```*(boolean)*: Should the browser be automatically refreshed on every change
	 -  ```syncClicks```*(boolean)*: If the development url is opened on multiple devices should the clicks on links, buttons, etc. be synced between every device
	 -  ```syncForms``` *(boolean)*: Should the content of the forms be synced on every device. This is useful for testing on multiple devices at once so the form filling is synced.
	 -  ```syncScroll``` *(boolean)*: Should scrolling be synced between multiple devices

## Installation

- First, you have to install [node.js](https://nodejs.org/) on your machine.
- Then make sure you have bower installed globally: ```npm install bower -g``` 
- Then install builder globally: ``` npm install builder -g ```.

## Architecture

The default folder names are: css, js, fonts, templates, bower_components and img. Those folders should be inside a parent folder called ```app```.
Let's say that you're building an awesome app called ```cat-facts-generator```. 
Your project structure should look like this:  

```
/cat-facts-generator
	--- /app
	 	---	/js
	   	---	/css
	   	---	/img
	   	---	/fonts
	   	---	/templates
	---	/bower_copmonents
	--- .gitignore
	--- bower.json
   		
```
*(please note that you can change the folder names in your builder-project-config.json)*


**Method 1:**
After installing builder run `builder` in your terminal and choose "Create a new project". Enter the name of your app, the name doesn't have to be the same as the folder name so you can just write "cat" instead of "cat-facts-generator".

**Method 2:** If you don't want to add and persist the project and you just want to run it navigate to the project directory in the terminal and run ``` builder . ```

The default **builder** command will process the files in development mode, run a server on ```http://localhost:9000```, and keep watching the files for changes.

After running **builder** you will see that a `build` folder was added but instead of the source files it has the processed and compiled files (app.js, app.css, lib.js, lib.css) etc. This is the folder that you want to deploy to production or upload to your FTP server.

If you want a production version of your app (minified, uglified, etc.) you should run the build command: ```builder -n cat-facts-generator -t build:only```. See the list of commands you can run below.

## Bash
 - ``` builder ``` - List of builder features
 - ``` builder list``` - List all of your projects and pick one to run
 - ``` builder . ``` - Run current directory that's opened in the terminal
 - ``` builder -n example ``` -  Run the project with the name "example"
 - ``` builder -n example -t process:js ``` - Execute the gulp task named `process:js` on the project `example`

## Tasks

- **process** : runs the process task for html, css, js, bower, fonts and images
- **process:html**: compiles jade, minifies html, adds templates to $templateCache
- **process:css**: compiles .sass, includes global sass imports, runs postcss tasks, runs autoprefixer, minifies and concatenates everything into app.css
- **process:js**: compiles .coffeescript, convert es6 to es5 with babel, annotates angular files, minifies and concatenates everything into app.js
- **process:bower**: processes files from bower, joins main files into lib.js and lib.css
- **process:fonts**: copies fonts
- **process:images**: compresses images
- **server**: runs the server and serves the current files from the build directory
- **watch**: watches files for changes and executes the process task for the file type
- **build:only**: builds the project in production mode
- **build:serve**: builds the project in production mode and run the server 