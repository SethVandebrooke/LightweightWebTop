// (any)
// v: any value you want to wield
var Wieldable = function(v){
    var d, l = [], t = () => {
      for (var i = 0; i < l.length; i++) {
        if (typeof l[i] === "function") {
          l[i](d);
        }
      }
    };
    // (any)
    // v: any value you want to wield
    var wieldable = function (v) {
      if (v != undefined) {
        d = v;
        if (v instanceof Array) {
          function arrayFunc(func, ...params) {
            var r = d[func](...params); t();
            return r;
          }
          wieldable.push    =  function ( ...params ) { return arrayFunc( 'push',    ...params ) }
          wieldable.pop     =  function ( ...params ) { return arrayFunc( 'pop',     ...params ) }
          wieldable.shift   =  function ( ...params ) { return arrayFunc( 'shift',   ...params ) }
          wieldable.unshift =  function ( ...params ) { return arrayFunc( 'unshift', ...params ) }
          wieldable.splice  =  function ( ...params ) { return arrayFunc( 'splice',  ...params ) }
          wieldable.slice   =  function ( ...params ) { return arrayFunc( 'slice',   ...params ) }
          Object.defineProperty(wieldable, 'length',  { get: function(){ return d.length; } });
        } else if (typeof v === "object") {
          for (var k in v) {
            wieldable[k] = new Wieldable(v[k]);
          }
        } else { // Clear out helper functions if there
          if (wieldable.push)    { delete wieldable.push;    }
          if (wieldable.pop)     { delete wieldable.pop;     }
          if (wieldable.shift)   { delete wieldable.shift;   }
          if (wieldable.unshift) { delete wieldable.unshift; }
          if (wieldable.splice)  { delete wieldable.splice;  }
          if (wieldable.slice)   { delete wieldable.slice;   }
        }
        t();
      }
      if ("object" === typeof d && !(d instanceof Array) ) {
        var o = {};
        for (var k in wieldable) {
          if ("function" === typeof wieldable[k] && wieldable[k].name == "wieldable") {
            o[k] = wieldable[k]();
          }
        }
        return o;
      }
      return d;
    };
    // (function)
    // f: function to run when the value of the wieldable changes
    wieldable.observe = f => {
      if ("function" === typeof f) {
        l.push(f);
        return {
          stop: () => {
            l.splice(l.indexOf(f),1)
          },
          start: () => l.push(f)
        };
      }
    };
    // (DOM Element, String, Boolean) 
    // element: DOM Element to bind the wieldable to
    // param: Name of event (if input is true) to update on, or DOM Element property to set when updated
    // input: wheather you are setting the wieldable on an event or getting it when changed
    wieldable.bind = function (element,param,input) {
      param = param.trim();
      if (input) {
        if (param.replace("key","")!==param&&param.replace("-","")!==param) {
          param = param.split("-");
          var key = param[0];
          param = param[1];
        }
        element.addEventListener(param, function(e) {
          if (key !== undefined) {
            if (key == e.key || key == e.code || key == e.which) {
              wieldable(element.value);
            }
          } else {
            wieldable(element.value);
          }
        });
        if (element.value) wieldable(element.value);
        return wieldable.observe(function(text) {
          element.value = text;
        });
      } else {
        wieldable.template = element[param];
        var observer = wieldable.observe(function(text) {
          if (d instanceof Array && wieldable.template) {
            element[param] = "";
            d.forEach((el,index) => {
              var str = wieldable.template;
              if ("object" === typeof el) {
                for (k in el) {
                  str = str.split("${"+k+"}").join(el[k]);
                }
              } else {
                str = str.split("${index}").join(index);
                str = str.split("${value}").join(el);
              }
              element[param] += str;
            })
          } else {
            element[param] = text;
          }
        });
        element[param] = d;
        return observer;
      }
    }
    wieldable.refresh = t;
    wieldable(v);
    return wieldable;
  };
  
  // (DOM Element, Object)
  // tar: target element to bind the scope to
  // model: an object of wieldable values inside the bound scope
  function WieldyScope(tar,model) {
    var scope = this;
    scope.debug = false;
    scope.run = function (target) {
      target.querySelectorAll("[bind]").forEach(e=> {
        var bindings = e.getAttribute("bind"), input = false;
        if (!!bindings) {
          bindings = bindings.split(",");
          bindings.forEach(function(params) {
            if (params.match(":")!==null) {
              params = params.split(":");
              var binding = params[0];
              var param = params[1];
              if (!!binding && !!param) {
                if (binding.match("-on")!==null) {
                  binding = binding.replace("-on","");
                  input = true;
                }
                binding = binding.trim();
                console.log(scope[binding],typeof scope[binding])
                if (typeof scope[binding] === "undefined") {
                  scope[binding] = new Wieldable();
                }
                if (input) {
                  if (scope[binding].name == "wieldable") {
                    scope[binding].bind(e,param,true);
                  } else if ("function" == typeof scope[binding]) {
                    if (param.replace("key","")!==param&&param.replace("-","")!==param) {
                      param = param.split("-");
                      var key = param[1];
                      key = key.charAt(0).toUpperCase() + key.slice(1);
                      param = param[0];
                    }
                    e.addEventListener(param, function(ev) {
                      if (key !== undefined) {
                        if (key == ev.key || key == ev.code || key == ev.which) {
                          scope[binding](e.value);
                        }
                      } else {
                        scope[binding](e.value);
                      }
                    });
                  }
                  scope.debug?console.log(e,param, true):null;
                } else {
                  scope[binding](!!e[param]?e[param]:"");
                  scope[binding].bind(e,param);
                  if (e[param].match(/\$\{.*}/g) != null) {
                    scope[binding]([]);
                    scope[binding].observe(function(){
                      scope.run(e);
                    })
                  }
                  scope.debug?console.log(e,param):null;
                  return scope;
                }
              } else {
                console.log("No bindings were defined");
                return false;
              }
            } else {
              console.log("No bindings were defined");
              return false;
            }
          })
        } else {
          console.error("No bindings were defined");
          return false;
        }
      });
    }
    if (model) {
      for (var k in model) {
        scope[k] = typeof model[k] == "function" ? model[k] : new Wieldable(model[k]);
      }
    }
    if (tar) {
      scope.run(tar);
    }
  }