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
            console.log(self.currentDir);
            return self.currentDir = self.fileStructure;
        }
        var fullPath = path;
        path = path.split("/");
        console.log(path);
        self.currentDir = self.fileStructure;
        path.splice(0,1);
        path.forEach(function (dir){
            console.log(self.currentDir);
            self.currentDir = self.currentDir.contents[dir];
        });
        self.wd = fullPath;
        console.log(self.currentDir);
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
var folder = "folder";
var file = "file";
var fileStructure = {
    contents: {
        Desktop: {
            type: folder,
            contents: {
                "mydocs": {
                    type: folder,
                    contents: {
                        "readme.txt": {
                            type: file,
                            contents: "Hello there!"
                        }
                    }
                }, 
                "test.txt": {
                    type: file,
                    contents: "I am a text file"
                }
            }
        }
    }
};
