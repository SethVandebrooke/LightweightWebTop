function animate(element, animation, delay, callback) {
  element.classList.remove("animated");
  element.classList.add("animated");
  element.classList.remove("faster");
  element.classList.add("faster");
  if (delay) {
    element.classList.remove("delay-" + delay + "s");
    element.classList.add("delay-" + delay + "s");
  }
  element.classList.remove(animation);
  element.classList.add(animation);
  element.addEventListener('animationend', function () {
    element.classList.remove("animated");
    element.classList.remove("delay-" + delay + "s");
    element.classList.remove(animation);
    element.classList.remove("fast");
    if (callback) {
      callback(element);
    }
  });
}

function setCSSVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}

function JSON_to_HTML(json) {
  var output = "", parsed;
  if (Array.isArray(json)) {
    json.forEach(function (item) {
      if (typeof item === "object") {
        output += JSON_to_HTML(item);
      }
    });
  } else if (typeof json === "object") {
    var obj = json;
    var tagName = obj.tagName;
    if (!tagName) {
      console.log("Tagname must be defined");
      return null;
    }
    // start the open tag
    output += "<" + tagName;
    // add attributes if any
    for (var k in obj) {
      var v = obj[k];
      if (typeof v === "string") {
        if (k != "tagName" && k != "text") {
          output += ' ' + k + '="' + v + '"';
        }
      }
    }
    // close the open tag
    output += '>';
    if (obj.text) {
      output += obj.text;
    }
    // nest children elements
    if (obj.children) {
      output += JSON_to_HTML(obj.children);
    }
    // add closing tag
    output += "</" + tagName + ">";
  } else if (typeof json === "string") {
    try {
      parsed = JSON.parse(json);
    } catch (e) {
      console.log(e);
      return null;
    }
    output += JSON_to_HTML(parsed);
  }
  return output;
}

function Style(winId, csso, vars) {
  var self = this;
  self.winId = winId;
  self.name = winId + "Style";
  self.vars = vars || {};
  self.csso = csso;
  self.generateCSS = style => {
    var selector, css = "", attr, a, v = self.vars;
    for (selector in style) {
      css += "\n" + " #" + self.winId + " .window-body " + selector + " {";
      for (attr in style[selector]) {
        a = style[selector][attr];
        if (typeof a == "string") {
          a = a.includes('$') ? v[a.replace('$', '')] : a;
          css += "\n\t" + attr + ": " + a + ";";
        }
      }
      css += "\n}"
    }
    return css + "\n";
  };
  self.addProperty = (
    selector,
    property,
    value) => { self.csso[selector][property] = value; self.compile(); };

  self.deleteProperty = (
    selector,
    property) => { delete csso[selector][property]; self.compile(); };

  self.changeProperty = self.addProperty;

  self.getProperty = (selector, property) => self.csso[selector][property];

  self.compile = () => {
    document.getElementById(
      self.name
    ).innerHTML = self.generateCSS(self.csso);
  };
  self.currentCSS = () => JSON.stringify(self.csso);
  //Init
  var style = document.createElement("style");
  style.setAttribute("id", self.name);
  document.getElementById(self.winId).appendChild(style);
}

function BUS() {
  var listeners = new Set();
  return {
    pub: (...args) => Array.from(listeners).forEach(listener => listener(...args)),
    sub: reaction => listeners.add(reaction) && reaction,
    unsub: listener => listeners.delete(listener),
    clear: () => listeners.clear()
  };
}


var AsyncFunction = Object.getPrototypeOf(async function () { }).constructor;

(function () {
  window.isMobile = false;
  window.ifMobile = {
    reactions: {},
    newReaction: (name, reaction, fallback) => {
      window.ifMobile.reactions[name] = {
        reaction: reaction || null, fallback: fallback || null
      };
      document.body.onresize();
    },
    forgetReaction: name => {
      window.ifMobile.reactions[name] = null;
      document.body.onresize();
    },
    getReaction: name => window.ifMobile.reactions[name]
  };
  function resize() {
    var window_width = Math.max(
      document.documentElement["clientWidth"],
      document.body["scrollWidth"],
      document.documentElement["scrollWidth"],
      document.body["offsetWidth"],
      document.documentElement["offsetWidth"]
    );
    var reactions = window.ifMobile.reactions;
    if (window_width < 600) {
      window.isMobile = true;
    }
    for (var k in reactions) {
      if (window_width < 600) {
        if (reactions[k].reaction) {
          reactions[k].reaction();
        }
      } else {
        if (reactions[k].fallback) {
          reactions[k].fallback();
        }
      }
    }
  }
  document.body.onresize = resize; resize();
})();