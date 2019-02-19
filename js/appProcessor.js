var appsInstalled = {};

loadApp("FileManager");
loadApp("TextEditor");
loadApp("RichTextEditor");
loadApp("Spotify");
loadApp("AppMaker");

var appsRunning = [];

//fileExtensionSupport
var FES = new BUS();

function openApp(name) {
  var app = appsInstalled[name];
  var windowId = name.split(" ").join("")
    +Math.floor(Math.random()*10000000);
  newWindow(
    windowId,
    app.icon + "&nbsp;&nbsp;" +app.title,
    JSON_to_HTML(app.package.markup)
  );
  appsRunning.push(windowId);
  var win = document.getElementById(windowId);
  win.stylesheet = new Style(windowId,app.package.style);
  // compile init css
  win.stylesheet.compile();
  // init javascript
  if ("string" === typeof app.package.code) {
    try {
      win.process = new AsyncFunction("window", "document", "$", "winId", app.package.code)(win,win,jQuery,windowId);
    } catch (e) {
      console.log("There was an issue trying to run the backend code associated with the "+name+" application",e);
    }
  } else if ("function" === typeof app.package.code) {
    try {
      win.process = app.package.code(win,win,jQuery,windowId);
    } catch (e) {
      console.log("There was an issue trying to run the backend code associated with the "+name+" application",e);
    }
  }

  // add app to taskbar
  var tab = document.createElement("li");
  tab.id = windowId+"tab";
  tab.setAttribute("onclick",`toggleWindowDisplay('${windowId}')`);
  tab.innerHTML = `<a class="button">${app.icon}</a>`;
  document.getElementById("openApps").appendChild(tab);
}

function AppPackage(name,title,icon,style,markup,js) {
  this.title = title;
  this.name = name;
  this.icon = icon;
  this.package = {style, markup, code: js};
}

function uploadApp(appPackage) {
  availableApps[appPackage.name] = appPackage;
}

function loadApp(name) {
  appsInstalled[name] = availableApps[name];
  taskBarScope.apps.push({
    name: name,
    icon: availableApps[name].icon
  });
}

function installApp(name) {
  appsInstalled[name] = availableApps[name];
  taskBarScope.apps.push({
    name: name,
    icon: availableApps[name].icon
  });
}

function compileApp(css_json,html_json,js_string) {
  var appPackage = JSONC.pack(JSONC.compress({
    style: css_json,
    markup: html_json,
    code: btoa(js_string)
  }));
  return appPackage;
}

function decompileApp(appPackage) {
  appPackage = JSONC.decompress(JSONC.unpack(appPackage));
  appPackage.code = atob(appPackage.code);
  return appPackage;
}

/*
var app = compileApp(
[{"tagName":"div","id":"main","children":[{"tagName":"h1","id":"mainTitle","text":"Hello World!"}]}]);
*/