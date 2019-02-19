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
          contenteditable: "true",
          style: "width:100%;height:100%;"
        }
      ]
    }
  },
  RichTextEditor: {
    title: "Rich Text Editor",
    name: "RichTextEditor",
    icon: `<i class="fa fa-code" aria-hidden="true"></i>`,
    package: {
      style: {
        "#summernote": {
          position: "absolute"
        },
        "": {
          background: "white"
        }
      },
      markup: [
        {
          tagName: "div",
          id: "summernote"
        }
      ],
      code: async function (window, document, $) {
        $('#summernote').summernote({
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
          frameborder: 0,
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
          "text-align": "center"
        },
        ".file .fa": {
          "font-size": "40pt",
          "margin": "5px",
          "cursor": "pointer"
        },
        ".go-back": {
          "padding": "10px",
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
              class: "col-2",
              children: [
                {
                  tagName: "i",
                  class: "fa fa-arrow-left go-back",
                  "aria-hidden": true
                }
              ]
            }
          ]
        },
        {
          tagName: "div",
          class: "row main"
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
                        class="col-2 file" 
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
          background: "rgba(0,0,0,0.1)",
          color: "white",
          width: "100%"
        },
        input: {
          background: "rgba(0,0,0,0.1)",
          color: "white",
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
  }
  /*name: {
      title: "name",
      icon: `<i class="fa fa-play" aria-hidden="true"></i>`,
      package: {
          style: {},
          markup: [],
          code: function (window, document, $, winId){}
      }
  }*/ 
};