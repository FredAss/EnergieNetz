Install bower, npm, grunt in visual studio
follow the "What do you need" part in [1] and install all 3 VS extensions

Get chochcolatey[2] to install further packages.
run
```
choco install git.install
choco install nodejs
```

reboot your computer for the changes to take effect

open a cmd/powershell and run
```
npm install -g gulp
npm install -g bower
```

Install the javascript/css dependencies

rightclick the `package.json` file in visual studio and select "NPM install packages"
rightclick the `bower.json` file in visual studio and select "Bower install packages"

[1] http://www.hanselman.com/blog/IntroducingGulpGruntBowerAndNpmSupportForVisualStudio.aspx
[2] https://chocolatey.org/
