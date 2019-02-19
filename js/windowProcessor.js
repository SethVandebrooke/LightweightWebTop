// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    restrict: {
      restriction: "parent",
      endOnly: true,
      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
    },
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener,
    // call this function on every dragend event
    onend: function (event) {
      // do something
    }
  });

  interact('.window-handle')
  .on('doubletap', function (event) {
    maximizeWindow(event.currentTarget);
  });
  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;

  function newWindow(id,title,body) {
    var html = `
    <div class="window-handle noselect" data-window-id="${id}">
        <ul class="window-actions">
            <li class="dropdown">
                <a class="button dropbtn">${title}</a>
                <div class="dropdown-content">
                    <a href="#">New</a>
                    <a href="#">Save</a>
                    <a href="#">Open</a>
                </div>
            </li>
            <li class="f-right">
                <a class="button" 
                onclick="closeWindow('${id}')">x</a>
            </li>
            <li class="f-right">
                <a class="button"
                onclick="maximizeWindow('${id}')">^</a>
            </li>
            <li class="f-right">
                <a class="button"
                onclick="minimizeWindow('${id}')">&minus;</a>
            </li>
        </ul>
    </div>
    <div class="window-body">
        ${body}
    </div>`;
    var win = document.createElement("DIV");
    win.id = id;
    win.className = "window";
    win.innerHTML = html;
    document.getElementById("mainwindow").appendChild(win);
    document.getElementById(id).addEventListener("mousedown",function(event){
      var prevSelected = document.querySelector(".window-selected");
      if (prevSelected) {
        prevSelected.classList.remove('window-selected');
      }
      event.currentTarget.classList.add('window-selected');
    });
    setTimeout(function(){
      interact('#'+id)
      .draggable({
        // only allow dragging from the handle
        allowFrom: '.window-handle',
        // enable inertial throwing
        inertia: true,
        // enable autoScroll
        autoScroll: true,
        onmove: window.dragMoveListener,
        restrict: {
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
      })
      .pointerEvents({
        allowFrom: ''
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: false },

        // keep the edges inside the parent
        restrictEdges: {
          outer: 'parent',
          endOnly: true,
        },

        // minimum size
        restrictSize: {
          min: { width: 200, height: 100 },
        },

        inertia: true,
      })
      .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        target.style.webkitTransform = target.style.transform =
            'translate(' + x + 'px,' + y + 'px)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      });
    }, 500);
  }

  function placeWindow(winId, x, y) {
    var target = document.getElementById(winId);
    target.style.webkitTransform = 
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
  }

  function toggleWindowDisplay(winId) {
    var winElem = document.getElementById(winId);
    if (winElem.classList.contains("d-none")) {
      winElem.classList.toggle("d-none");
      var prevSelected = document.querySelector(".window-selected");
      if (prevSelected) {
        prevSelected.classList.remove('window-selected');
      }
      winElem.classList.add('window-selected');
    } else {
      winElem.classList.add('d-none');
    }
  }

  function minimizeWindow(winId) {
    toggleWindowDisplay(winId);
  }

  function maximizeWindow(winId) {
    var winElem = document.getElementById(winId);
    if (winElem.classList.contains("window-maximized")) {
      winElem.classList.remove("window-maximized");
      winElem.style.webkitTransform = winElem.style.transform = 
        winElem.getAttribute("data-last-pos");
    } else {
      winElem.setAttribute("data-last-pos", 
        winElem.style.transform || winElem.style.webkitTransform);
      // Set x and y to 0
      placeWindow(winId,0,0);
      winElem.classList.add("window-maximized");
    }
  }

  function closeWindow(winId) {
    var winElem = document.getElementById(winId);
    var winTab = document.getElementById(winId+"tab");
    // close the window 
    winElem.parentElement.removeChild(winElem);
    // and remove the tab from the taskbar
    winTab.parentElement.removeChild(winTab);
  }

