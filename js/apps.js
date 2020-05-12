var availableApps = {
  TextEditor: {
    title: "TextEditor",
    name: "TextEditor",
    icon: `<i class="fa fa-pencil" aria-hidden="true"></i>`,
    package: {
      style: {
        "div": {
          padding: "5px"
        }
      },
      markup: [
        {
          tagName: "div",
          class: "text",
          contenteditable: "true",
          style: "width:100%;height:100%;"
        }
      ],
      code: function (window, document, $, winId, data) {
        if (data && data.contents) {
          document.querySelector(".text").innerHTML = data.contents;
        }
      }
    }
  },
  RichTextEditor: {
    title: "Rich Text Editor",
    name: "RichTextEditor",
    icon: `<i class="fa fa-code" aria-hidden="true"></i>`,
    package: {
      style: {
        ".summernote": {
          position: "absolute"
        },
        "": {
          background: "white"
        }
      },
      markup: [
        {
          tagName: "div",
          class: "summernote"
        }
      ],
      code: async function (window, document, $, winId, data) {
        $(document.querySelector(".summernote")).summernote({
          placeholder: 'Start creating...',
          tabsize: 2,
          height: 400,
          toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']],
            ['insert', ['link', 'picture', 'video', 'table', 'hr']],
            ['misc', [/*'codeview'*/ 'undo', 'redo', 'help']]
          ]
        });
        if (data && data.contents) {
          $(document.querySelector(".summernote")).summernote("code", data.contents);
        }
      }
    }
  },
  Spotify: {
    title: "Spotify",
    name: "Spotify",
    icon: `<i class="fa fa-play" aria-hidden="true"></i>`,
    package: {
      style: {
        iframe: {
          width: "100%",
          height: "100%"
        }
      },
      markup: [
        {
          tagName: "iframe",
          id: "spotify",
          frameborder: "0",
          allowtransparency: "true",
          allow: "encrypted-media",
          src: "https://open.spotify.com/embed/user/spotify/playlist/37i9dQZF1DX4sWSpwq3LiO"
        }
      ]
    }
  },
  FileManager: {
    title: "File Manager",
    name: "FileManager",
    icon: `<i class="fa fa-folder" aria-hidden="true"></i>`,
    package: {
      style: {
        ".file": {
          padding: "15px",
          margin: "15px",
          "text-align": "center",
          "cursor": "pointer"
        },
        ".file:hover": {
          background: "rgba(0,0,0,0.2)",
        },
        ".file .fa": {
          "font-size": "40pt",
          "margin": "5px",
        },
        ".go-back": {
          "padding": "10px",
          cursor: "pointer"
        },
        "option": {
          "padding-left": "10px"
        }
      },
      markup: [
        {
          tagName: "div",
          class: "flex-container toolbar noselect",
          children: [
            {
              tagName: "div",
              class: "option",
              children: [
                {
                  tagName: "i",
                  class: "fa fa-arrow-left go-back",
                  "aria-hidden": "true"
                }
              ]
            }
          ]
        },
        {
          tagName: "div noselect",
          class: "flex-container main"
        }
      ],
      code: async function (window, document, $, winId) {
        var fs = new FileSystem(fileStructure);
        var target = document.querySelector(".main");
        document.querySelector(".go-back").addEventListener("click", function (ev) {
          renderFiles(fs.getContents(fs.goUpInPath(fs.wd)).contents);
        });
        function renderFiles(files) {
          var html = "";
          document.querySelectorAll(".file")
            .forEach(function (file) {
              file.parentElement.removeChild(file);
            });
          for (var fileName in files) {
            var file = files[fileName];
            html += `
                      <div 
                        class="file noselect" 
                        data-file-path="${fs.addDirToPath(fs.wd, fileName)}"
                        data-file-type="${file.type}"
                      >
                      <i class="fa fa-${file.type}" aria-hidden="true"></i>
                      <br>
                      <span>${fileName}</span>
                      </div>
                      `;
          }
          target.innerHTML = html;
          document.querySelectorAll(".file")
            .forEach(function (file) {
              file.addEventListener("click", function (ev) {
                var target = ev.currentTarget;
                var p = target.getAttribute("data-file-path");
                var type = target.getAttribute("data-file-type");
                if (type == "folder") {
                  renderFiles(fs.getContents(p).contents);
                } else if (type == "file") {
                  openFile(p);
                }
              });
            });
        }
        renderFiles(fs.getContents("").contents);
      }
    }
  },
  AppMaker: {
    title: "App Maker",
    name: "AppMaker",
    icon: `<i class="fa fa-edit" aria-hidden="true"></i>`,
    package: {
      style: {
        "": {
          padding: "20px",
          "padding-top": "40px"
        },
        textarea: {
          width: "100%"
        },
        input: {
          width: "100%"
        },
        ".fa": {
          cursor: "pointer"
        }
      },
      markup: [
        {
          tagName: "div",
          class: "row toolbar",
          children: [
            {
              tagName: "div",
              class: "col-1",
              children: [
                {
                  tagName: "i",
                  class: "fa fa-upload upload",
                  "aria-hidden": true
                }
              ]
            },
            {
              tagName: "div",
              class: "col-1",
              children: [
                {
                  tagName: "i",
                  class: "fa fa-download download",
                  "aria-hidden": true
                }
              ]
            }
          ]
        },
        {
          tagName: "h2",
          text: "App Name"
        },
        {
          tagName: "input",
          type: "text",
          class: "nameinput"
        },
        {
          tagName: "h2",
          text: "icon"
        },
        {
          tagName: "input",
          type: "text",
          class: "iconinput"
        },
        {
          tagName: "h2",
          text: "Style JSON"
        },
        {
          tagName: "textarea",
          class: "styleinput"
        },
        {
          tagName: "h2",
          text: "Markup JSON"
        },
        {
          tagName: "textarea",
          class: "markupinput"
        },
        {
          tagName: "h2",
          text: "JavaScript"
        },
        {
          tagName: "textarea",
          class: "javascriptinput"
        }
      ],
      code: async function (window, document, $, winId) {
        document.querySelector(".upload").addEventListener("click", function (ev) {
          var name = document.querySelector(".nameinput").value;
          var icon = document.querySelector(".iconinput").value;
          var style = JSON.parse(document.querySelector(".styleinput").value);
          var markup = JSON.parse(document.querySelector(".markupinput").value);
          var javascript = document.querySelector(".javascriptinput").value;
          icon = `<i class="fa fa-${icon}" aria-hidden="true"></i>`;
          uploadApp(new AppPackage(name, name, icon, style, markup, javascript));
        });
        document.querySelector(".download").addEventListener("click", function (ev) {
          var name = document.querySelector(".nameinput").value;
          installApp(name);
        });
      }
    }
  },
  Theme: {
    title: "Theme",
    icon: `<i class="fa fa-paint-brush" aria-hidden="true"></i>`,
    package: {
      style: {
        ".main": {
          padding: "20px"
        }
      },
      markup: [
        {
          tagName: "div",
          class: "main",
          children: [
            {
              tagName: "div",
              children: [{
                tagName: "p",
                text: "Text Color"
              }, {
                tagName: "input",
                type: "color",
                "data-var": "--main-text-color"
              }, {
                tagName: "p",
                text: "Window Background Color"
              }, {
                tagName: "input",
                type: "color",
                "data-var": "--main-solid-bg-color"
              }]
            }, {
              tagName: "button",
              text: "Save Changes",
              class: "save f-right"
            }
          ]
        }
      ],
      code: function (window, document, $, winId, data) {
        document.querySelector(".save").addEventListener("click", function (ev) {
          document.querySelectorAll("input").forEach(function (input) {
            setCSSVar(input.getAttribute("data-var"), input.value);
          });
        });
      }
    }
  },
  Browser: {
    title: "Browser",
    icon: `<i class="fa fa-globe" aria-hidden="true"></i>`,
    package: {
      style: {
        ".main": {
          width: "100%",
          height: "inherit",
          "padding-bottom":"110px"
        },
        ".browser": {
          width: "100%",
          height: "100%",
          border: "none"
        },
        ".toolbar": {
          margin: "10px"
        },
        ".fa": {
          cursor: "pointer",
          "margin": "10px",
          "margin-top": "20px",
        },
        ".urlTarget": {
          width: "100%"
        },
        "": {
          overflow: "hidden"
        }
      },
      markup: [
        {
          tagName: "div",
          class: "row toolbar noselect",
          children: [
            {
              tagName: "div",
              class: "col-2",
              children: [
                {
                  tagName: "i",
                  class: "fa fa-arrow-left go-back",
                  "aria-hidden": "true"
                }, 
                {
                  tagName: "i",
                  class: "fa fa-arrow-right go-forward",
                  "aria-hidden": "true"
                }
              ]
            }, {
              tagName: "div",
              class: "col-9",
              children: [
                {
                  tagName: "input",
                  type: "text",
                  class: "urlTarget",
                  placeholder: "Enter web address here"
                }
              ]
            }
          ]
        }, {
          tagName: "div",
          class: "row main",
          children: [
            {
              tagName: "iframe",
              class: "browser"
            }
          ]
        }
      ],
      code: function (window, document, $, winId, data) {
        window.browser = {
          history: [],
          currentIndex: 0
        };
        function loadWebPage(url) {
          if (!url) {
            url = document.querySelector(".urlTarget").value;
          }
          document.querySelector(".browser").src = url.includes("http")?url:"http://"+url;
          window.browser.history.unshift(url);
        }
        document.querySelector(".go-back").addEventListener("click", function (){
          window.browser.currentIndex += 1;
          loadWebPage(window.browser.history[window.browser.currentIndex]);
          window.browser.history.splice(0,1);
        });
        document.querySelector(".go-forward").addEventListener("click", function (){
          console.log(window.browser.currentIndex, window.browser.history);
          if (window.browser.currentIndex > 0) {
            window.browser.currentIndex -= 1;
            loadWebPage(window.browser.history[window.browser.currentIndex]);
          }
        });
        document.querySelector(".urlTarget").addEventListener("keyup", function (ev){
          if (ev.keyCode === 13) {
            loadWebPage();
            window.browser.currentIndex = 0;
          }
        });
        loadWebPage("https://bing.com");
      }
    }
  }
  /*name: {
      title: "name",
      icon: `<i class="fa fa-play" aria-hidden="true"></i>`,
      package: {
          style: {},
          markup: [],
          code: function (window, document, $, winId, data){}
      }
  }*/
};