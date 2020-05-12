function FileSystem(fileStructure) {
    var self = this;
    self.wd = "/";
    self.currentDir = fileStructure;
    self.fileStructure = fileStructure;
    self.getContents = function (path) {
        path = path.trim();
        if (path.substr(path.length-1,1) == "/") {
            path = path.substr(0,path.length-1);
        }
        if (path == "" || path == "/") {
            self.wd = "/";
            return self.currentDir = self.fileStructure;
        }
        var fullPath = path;
        path = path.split("/");
        self.currentDir = self.fileStructure;
        path.splice(0,1);
        path.forEach(function (dir){
            self.currentDir = self.currentDir.contents[dir];
        });
        self.wd = fullPath;
        return self.currentDir;
    };
    self.addDirToPath = function(path,dir) {
        if (path.substr(path.length-1,1) == "/") {
            return path + dir;
        }
        else {
            return path + "/"+dir;
        }
    };
    self.goUpInPath = function (path) {
        if (path.substr(path.length-1,1) == "/") {
            path = path.substr(0,path.length-1);
        }
        path = path.split("/");
        path.splice(path.length-1,1);
        return path.join("/");
    };
}

function FileExtensionMap(){
    var self = this;

    self.map = {};

    self.mapExt = function (ext,app) {
        if (!self.map[ext]) self.map[ext] = [];
        self.map[ext].push(app);
    }

    self.getAppsForExt = function (ext) {
        return self.map[ext] || [];
    }
}

function getFileExt(fileName) {
    return fileName.substr(fileName.lastIndexOf(".")+1,fileName.length);
}

function getFileNameFromPath(fileName) {
    return fileName.substr(fileName.lastIndexOf("/")+1,fileName.length);
}

function openFile (filePath) {
    var fileName = getFileNameFromPath(filePath);
    var ext = getFileExt(fileName);
    var supportiveApps = fileExtensionMap.getAppsForExt(ext);
    var fileData = new FileSystem(fileStructure).getContents(filePath);
    if (supportiveApps.length == 0) {
        // No currently installed app can open this file
        // Display a message
        // Possibly suggest applications
    } else if (supportiveApps.length == 1) {
        var fs = new FileSystem(fileStructure);
        openApp(supportiveApps[0], fileData);
    } else if (supportiveApps.length > 1) {
        document.getElementById("chooseApplication").classList.remove("d-none");
        var markup = [];
        supportiveApps.forEach(function(app){
            markup.push({
                tagName: "li",
                id: "CA"+app,
                class: "CAoption",
                text: app
            });
        });
        document.getElementById("chooseApplicationList").innerHTML = JSON_to_HTML(markup);
        supportiveApps.forEach(function(app){
            document.getElementById("CA"+app).addEventListener("click",function(ev){
                openApp(app,fileData);
                document.getElementById("chooseApplication").classList.add("d-none");
            });
        });
    }
}

function writeFile (filePath, content) {
    //
}