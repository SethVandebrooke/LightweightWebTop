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
      output += "<"+tagName;
      // add attributes if any
      for (var k in obj) {
          var v = obj[k];
          if (typeof v === "string") {
              if (k != "tagName" && k != "text") {
                output += ' ' + k + '="' + v + '"';
              }
          } else {
              console.log(k,"attribute must be a string");
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
      output += "</"+tagName+">";
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
        css+="\n"+" #"+self.winId+" .window-body "+selector+" {";
        for (attr in style[selector]) {
          a=style[selector][attr];
          if (typeof a == "string") {
            a=a.includes('$')?v[a.replace('$','')]:a;
            css+="\n\t"+attr+": "+a+";";
          }
        }
        css+="\n}"
      }
      return css+"\n";
    };
    self.addProperty = (
      selector,
      property,
      value ) => { self.csso[selector][property] = value; self.compile(); };
  
    self.deleteProperty = (
      selector,
      property ) => { delete csso[selector][property]; self.compile(); };
  
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
    style.setAttribute("id",self.name);
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


var AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;