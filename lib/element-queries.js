var elementQuery = (function() {

  // implementations for testing actual element query properties
  var queryMatchers = {
    "max-available-width": function(element, value, units) {
      var parent = element.parentNode;
      var px = convertToPx(parent, value, units);
      return value && parent && parent.offsetWidth <= px;
    },

    "min-available-width": function(element, value, units) {
      var parent = element.parentNode;
      var px = convertToPx(parent, value, units);
      return value && parent && parent.offsetWidth >= px;
    },
  };

  // convert an element query into a css class name we can replace it with
  var classNameForRules = function(rules) {
    var name = "query";
    for (var i = 0, len = rules.length; i < len; i++) {
      name += "_" + rules[i].property + "_" + rules[i].value + rules[i].units;
    }
    return name;
  };
  
  // determine the px value for a measurement (e.g. "5em") on a given element
  var convertToPx = function(element, value, units) {
    switch (units) {
      case "px": return value;
      case "em": return value * getEmSize(element);
      case "rem": return value * getEmSize();
      // Viewport units!
      // According to http://quirksmode.org/mobile/tableViewport.html
      // documentElement.clientWidth/Height gets us the most reliable info
      case "vw": return value * document.documentElement.clientWidth / 100;
      case "vh": return value * document.documentElement.clientHeight / 100;
      case "vmin":
      case "vmax":
        var vw = document.documentElement.clientWidth / 100;
        var vh = document.documentElement.clientHeight / 100;
        var chooser = Math[units === "vmin" ? "min" : "max"];
        return value * chooser(vw, vh);
      default: return value;
      // for now, not supporting physical units (since they are just a set number of px)
      // or ex/ch (getting accurate measurements is hard)
    }
  };
  
  // determine the size of an em in a given element
  var getEmSize = function(element) {
    if (!element) {
      element = document.documentElement;
    }
    if (window.getComputedStyle) {
      return parseFloat(getComputedStyle(element).fontSize) || 16;
    }
    // TODO: support IE?
    return 16;
  };

  // test whether an element matches a set of query rules
  var elementMatchesRules = function(element, rules) {
    for (var i = rules.length - 1; i > -1; i--) {
      var rule = rules[i];
      var matcher = queryMatchers[rule.property];
      if (matcher && !matcher(element, rule.value, rule.units)) {
        return false;
      }
    }
    return true;
  };

  var loader = {
    // parse an array of CSSStyleSheet objects for element queries
    loadStyleSheets: function(sheets, callback) {
      var completed = 0;
      for (var i = 0, len = sheets.length; i < len; i++) {
        this.loadStyleSheet(sheets[i], function() {
          completed += 1;
          if (completed === len) {
            callback && callback();
          }
        });
      }
    },

    // parse a single CSSStyleSheet object for element queries
    loadStyleSheet: function(sheet, callback) {
      if (sheet.ownerNode.nodeName === "STYLE") {
        var result = elementQuery.parser.parseStyleText(sheet.ownerNode.innerHTML);
        sheet.ownerNode.innerHTML += result.newCss;
        elementQuery.queries = elementQuery.queries.concat(result.queries);
        callback && callback();
      }
      else if (sheet.href) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", sheet.href, true);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              var result = elementQuery.parser.parseStyleText(xhr.responseText);
              elementQuery.queries = elementQuery.queries.concat(result.queries);
              var style = document.createElement("style");
              style.innerHTML = result.newCss;
              document.body.appendChild(style);
            }
            else if (window.console) {
              console.log("Could not load stylesheet at " + sheet.href);
            }
            callback && callback();
          }
        }
        xhr.send(null);
      }
    },
  };

  // public API
  var elementQuery = {
    autoInit: true,

    init: function() {
      var evaluated = false;
      this.loader.loadStyleSheets(document.styleSheets, function() {
        evaluated = true;
        elementQuery.evaluateQueries();
      });

      // if we are still waiting for some asynchronous ones, go ahead and evaluate
      // any found queries now for minimum latency
      if (!evaluated) {
        elementQuery.evaluateQueries();
      }
    },

    // update the styling for all the elements that have queries
    evaluateQueries: function(context) {
      context = context || document;
      var queries = this.queries;
      for (var i = 0, len = queries.length; i < len; i++) {
        var elements = context.querySelectorAll(queries[i].selector);
        for (var j = 0; j < elements.length; j++) {
          var element = elements[j];
          if (elementMatchesRules(element, queries[i].rules)) {
            element.classList.add(queries[i].className);
          }
          else {
            element.classList.remove(queries[i].className);
          }
        }
      }
    },

    queryMatchers: queryMatchers,
    queries: [],
    classNameForRules: classNameForRules,
    loader: loader
  };

  // re-run all queries on resize
  window.addEventListener("resize", function() {
    elementQuery.evaluateQueries();
  }, false);

  // automatically look for things on window load
  window.addEventListener("load", function() {
    if (elementQuery.autoInit) {
      elementQuery.init();
    }
  });

  // TODO: re-run all queries... on an interval?
  // override setTimeout, addEventListener, etc to hit every possible JS entry
  // point? Not really an ideal solution to this.
  // Repaint events in Mozilla?
  
  return elementQuery;
  
}());