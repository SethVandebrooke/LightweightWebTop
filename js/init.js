var taskBarScope = new WieldyScope(document.getElementById("taskbar"), {
    apps: []
});

var appsInstalled = {};
var appsRunning = [];
var fileExtensionMap = new FileExtensionMap();
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
var typeWriterSounds = {
    "enter": "typewriter-enter.mp3",
    "spacebar": "typewriter-spacebar.mp3"
};
var typeWriterKeySounds = {
    "key1": "TW_Letters_0.mp3",
    "key2": "TW_Letters_1.mp3",
    "key3": "TW_Letters_2.mp3"
};
var typeWriter = new AudioGallery(
    typeWriterSounds, // Audio files
    "audio/" //  Root folder
);
var typeWriterKeys = new AudioGallery(
    typeWriterKeySounds, // Audio files
    "audio/" //  Root folder
);
document.body.addEventListener("keypress",function(event){
    if (!event.repeat) {
        if (event.keyCode === 13) { // Enter
            typeWriter.stop("enter");
            typeWriter.play("enter");
        } else if (event.keyCode === 32) { // Spacebar
            typeWriter.stop("spacebar");
            typeWriter.play("spacebar");
        } else {
            typeWriterKeys.playRandom();
        }
    }
});
loadApp("Browser");
loadApp("TextEditor");
loadApp("RichTextEditor");
loadApp("FileManager");
loadApp("Spotify");
loadApp("AppMaker");
loadApp("Theme");
fileExtensionMap.mapExt("txt","TextEditor");
fileExtensionMap.mapExt("txt","RichTextEditor");
initContextMenu();
date_time("datetime");