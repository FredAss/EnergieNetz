EnergieNetz
=======

## Requirements

Get chocolatey to track dependencies.
Refer to [http://chocolatey.org/](http://chocolatey.org/) for installation.
Then run
```
cinst nodejs
```

Get gulp [http://gulpjs.com/](http://gulpjs.com/)
```
$ npm install --global gulp
```

Get bower [http://bower.io/](http://bower.io/)
```
$ npm install --global bower
```

## Deploy

### Download Source
Use git

```bash
git clone https://github.com/htw-bui/EnergieNetz.git
```

Or download zip-file from here

### Open Solution in VisualStudio
- Open the ```EnergieNetwork.sln``` with VisualStudio
- Enable NuGet Package Restore
- Manage NuGet Packages for Solution

### Use Bower
right click on bower.json and choose ```Bower install packages```

or

Open cmd and go to ```EnergyNetwork/EnergieNetwork.Web```, then run

```bash
bower install
```

### Publish
right click on ```EnergyNetwork/EnergieNetwork.Web``` then ```Publish```
This will create a ```dist```-Folder with all nessesary files

### Gulp build
Open cmd and go to ```EnergyNetwork/EnergieNetwork.Web```, then run

```bash
gulp build
```

### NuGet for dist-Folder
Open cmd and go to ```EnergyNetwork/EnergieNetwork.Web/dist```, then run

```bash
npm install
```

### Ready
Now you can move the ```dist```-Folder to any position you like

## IIS-Hosting
Add the ```dist```-Folder as new webpage to your iis and run it with the settings you prefers

## Development
[Project-Page](http://energienetz.f2.htw-berlin.de) from EnergieNetz for further information

EnergieNetz was developed at the [HTW-Berlin](http://www.htw-berlin.de/) and published under the MIT-License

## Configure EMail
find and replace all ```@xxxxx.com``` email address

in ```Web.config``` you have to set up an email account from witch the emails will send
```
<add key="EmailServer" value="{EmailServer}"/>
<add key="Port" value="{EmailPort}"/>
<add key="EmailUser" value="{EmailUser}"/>
<add key="EmailPassword" value="{EmailPassword}"/>
```