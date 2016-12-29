//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

var Zepto = (function() {
  var undefined, key, $, classList, emptyArray = [], concat = emptyArray.concat, filter = emptyArray.filter, slice = emptyArray.slice,
    document = window.document,
    elementDisplay = {}, classCache = {},
    cssNumber = { 'column-count': 1, 'columns': 1, 'font-weight': 1, 'line-height': 1,'opacity': 1, 'z-index': 1, 'zoom': 1 },
    fragmentRE = /^\s*<(\w+|!)[^>]*>/,
    singleTagRE = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    tagExpanderRE = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
    rootNodeRE = /^(?:body|html)$/i,
    capitalRE = /([A-Z])/g,

    // special attributes that should be get/set via method calls
    methodAttributes = ['val', 'css', 'html', 'text', 'data', 'width', 'height', 'offset'],

    adjacencyOperators = [ 'after', 'prepend', 'before', 'append' ],
    table = document.createElement('table'),
    tableRow = document.createElement('tr'),
    containers = {
      'tr': document.createElement('tbody'),
      'tbody': table, 'thead': table, 'tfoot': table,
      'td': tableRow, 'th': tableRow,
      '*': document.createElement('div')
    },
    readyRE = /complete|loaded|interactive/,
    simpleSelectorRE = /^[\w-]*$/,
    class2type = {},
    toString = class2type.toString,
    zepto = {},
    camelize, uniq,
    tempParent = document.createElement('div'),
    propMap = {
      'tabindex': 'tabIndex',
      'readonly': 'readOnly',
      'for': 'htmlFor',
      'class': 'className',
      'maxlength': 'maxLength',
      'cellspacing': 'cellSpacing',
      'cellpadding': 'cellPadding',
      'rowspan': 'rowSpan',
      'colspan': 'colSpan',
      'usemap': 'useMap',
      'frameborder': 'frameBorder',
      'contenteditable': 'contentEditable'
    },
    isArray = Array.isArray ||
      function(object){ return object instanceof Array }

  zepto.matches = function(element, selector) {
    if (!selector || !element || element.nodeType !== 1) return false
    var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector ||
                          element.oMatchesSelector || element.matchesSelector
    if (matchesSelector) return matchesSelector.call(element, selector)
    // fall back to performing a selector:
    var match, parent = element.parentNode, temp = !parent
    if (temp) (parent = tempParent).appendChild(element)
    match = ~zepto.qsa(parent, selector).indexOf(element)
    temp && tempParent.removeChild(element)
    return match
  }

  function type(obj) {
    return obj == null ? String(obj) :
      class2type[toString.call(obj)] || "object"
  }

  function isFunction(value) { return type(value) == "function" }
  function isWindow(obj)     { return obj != null && obj == obj.window }
  function isDocument(obj)   { return obj != null && obj.nodeType == obj.DOCUMENT_NODE }
  function isObject(obj)     { return type(obj) == "object" }
  function isPlainObject(obj) {
    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
  }
  function likeArray(obj) { return typeof obj.length == 'number' }

  function compact(array) { return filter.call(array, function(item){ return item != null }) }
  function flatten(array) { return array.length > 0 ? $.fn.concat.apply([], array) : array }
  camelize = function(str){ return str.replace(/-+(.)?/g, function(match, chr){ return chr ? chr.toUpperCase() : '' }) }
  function dasherize(str) {
    return str.replace(/::/g, '/')
           .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
           .replace(/([a-z\d])([A-Z])/g, '$1_$2')
           .replace(/_/g, '-')
           .toLowerCase()
  }
  uniq = function(array){ return filter.call(array, function(item, idx){ return array.indexOf(item) == idx }) }

  function classRE(name) {
    return name in classCache ?
      classCache[name] : (classCache[name] = new RegExp('(^|\\s)' + name + '(\\s|$)'))
  }

  function maybeAddPx(name, value) {
    return (typeof value == "number" && !cssNumber[dasherize(name)]) ? value + "px" : value
  }

  function defaultDisplay(nodeName) {
    var element, display
    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName)
      document.body.appendChild(element)
      display = getComputedStyle(element, '').getPropertyValue("display")
      element.parentNode.removeChild(element)
      display == "none" && (display = "block")
      elementDisplay[nodeName] = display
    }
    return elementDisplay[nodeName]
  }

  function children(element) {
    return 'children' in element ?
      slice.call(element.children) :
      $.map(element.childNodes, function(node){ if (node.nodeType == 1) return node })
  }

  function Z(dom, selector) {
    var i, len = dom ? dom.length : 0
    for (i = 0; i < len; i++) this[i] = dom[i]
    this.length = len
    this.selector = selector || ''
  }

  // `$.zepto.fragment` takes a html string and an optional tag name
  // to generate DOM nodes nodes from the given html string.
  // The generated DOM nodes are returned as an array.
  // This function can be overriden in plugins for example to make
  // it compatible with browsers that don't support the DOM fully.
  zepto.fragment = function(html, name, properties) {
    var dom, nodes, container

    // A special case optimization for a single tag
    if (singleTagRE.test(html)) dom = $(document.createElement(RegExp.$1))

    if (!dom) {
      if (html.replace) html = html.replace(tagExpanderRE, "<$1></$2>")
      if (name === undefined) name = fragmentRE.test(html) && RegExp.$1
      if (!(name in containers)) name = '*'

      container = containers[name]
      container.innerHTML = '' + html
      dom = $.each(slice.call(container.childNodes), function(){
        container.removeChild(this)
      })
    }

    if (isPlainObject(properties)) {
      nodes = $(dom)
      $.each(properties, function(key, value) {
        if (methodAttributes.indexOf(key) > -1) nodes[key](value)
        else nodes.attr(key, value)
      })
    }

    return dom
  }

  // `$.zepto.Z` swaps out the prototype of the given `dom` array
  // of nodes with `$.fn` and thus supplying all the Zepto functions
  // to the array. This method can be overriden in plugins.
  zepto.Z = function(dom, selector) {
    return new Z(dom, selector)
  }

  // `$.zepto.isZ` should return `true` if the given object is a Zepto
  // collection. This method can be overriden in plugins.
  zepto.isZ = function(object) {
    return object instanceof zepto.Z
  }

  // `$.zepto.init` is Zepto's counterpart to jQuery's `$.fn.init` and
  // takes a CSS selector and an optional context (and handles various
  // special cases).
  // This method can be overriden in plugins.
  zepto.init = function(selector, context) {
    var dom
    // If nothing given, return an empty Zepto collection
    if (!selector) return zepto.Z()
    // Optimize for string selectors
    else if (typeof selector == 'string') {
      selector = selector.trim()
      // If it's a html fragment, create nodes from it
      // Note: In both Chrome 21 and Firefox 15, DOM error 12
      // is thrown if the fragment doesn't begin with <
      if (selector[0] == '<' && fragmentRE.test(selector))
        dom = zepto.fragment(selector, RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // If it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // If a function is given, call it when the DOM is ready
    else if (isFunction(selector)) return $(document).ready(selector)
    // If a Zepto collection is given, just return it
    else if (zepto.isZ(selector)) return selector
    else {
      // normalize array if an array of nodes is given
      if (isArray(selector)) dom = compact(selector)
      // Wrap DOM nodes.
      else if (isObject(selector))
        dom = [selector], selector = null
      // If it's a html fragment, create nodes from it
      else if (fragmentRE.test(selector))
        dom = zepto.fragment(selector.trim(), RegExp.$1, context), selector = null
      // If there's a context, create a collection on that context first, and select
      // nodes from there
      else if (context !== undefined) return $(context).find(selector)
      // And last but no least, if it's a CSS selector, use it to select nodes.
      else dom = zepto.qsa(document, selector)
    }
    // create a new Zepto collection from the nodes found
    return zepto.Z(dom, selector)
  }

  // `$` will be the base `Zepto` object. When calling this
  // function just call `$.zepto.init, which makes the implementation
  // details of selecting nodes and creating Zepto collections
  // patchable in plugins.
  $ = function(selector, context){
    return zepto.init(selector, context)
  }

  function extend(target, source, deep) {
    for (key in source)
      if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
        if (isPlainObject(source[key]) && !isPlainObject(target[key]))
          target[key] = {}
        if (isArray(source[key]) && !isArray(target[key]))
          target[key] = []
        extend(target[key], source[key], deep)
      }
      else if (source[key] !== undefined) target[key] = source[key]
  }

  // Copy all but undefined properties from one or more
  // objects to the `target` object.
  $.extend = function(target){
    var deep, args = slice.call(arguments, 1)
    if (typeof target == 'boolean') {
      deep = target
      target = args.shift()
    }
    args.forEach(function(arg){ extend(target, arg, deep) })
    return target
  }

  // `$.zepto.qsa` is Zepto's CSS selector implementation which
  // uses `document.querySelectorAll` and optimizes for some special cases, like `#id`.
  // This method can be overriden in plugins.
  zepto.qsa = function(element, selector){
    var found,
        maybeID = selector[0] == '#',
        maybeClass = !maybeID && selector[0] == '.',
        nameOnly = maybeID || maybeClass ? selector.slice(1) : selector, // Ensure that a 1 char tag name still gets checked
        isSimple = simpleSelectorRE.test(nameOnly)
    return (element.getElementById && isSimple && maybeID) ? // Safari DocumentFragment doesn't have getElementById
      ( (found = element.getElementById(nameOnly)) ? [found] : [] ) :
      (element.nodeType !== 1 && element.nodeType !== 9 && element.nodeType !== 11) ? [] :
      slice.call(
        isSimple && !maybeID && element.getElementsByClassName ? // DocumentFragment doesn't have getElementsByClassName/TagName
          maybeClass ? element.getElementsByClassName(nameOnly) : // If it's simple, it could be a class
          element.getElementsByTagName(selector) : // Or a tag
          element.querySelectorAll(selector) // Or it's not simple, and we need to query all
      )
  }

  function filtered(nodes, selector) {
    return selector == null ? $(nodes) : $(nodes).filter(selector)
  }

  $.contains = document.documentElement.contains ?
    function(parent, node) {
      return parent !== node && parent.contains(node)
    } :
    function(parent, node) {
      while (node && (node = node.parentNode))
        if (node === parent) return true
      return false
    }

  function funcArg(context, arg, idx, payload) {
    return isFunction(arg) ? arg.call(context, idx, payload) : arg
  }

  function setAttribute(node, name, value) {
    value == null ? node.removeAttribute(name) : node.setAttribute(name, value)
  }

  // access className property while respecting SVGAnimatedString
  function className(node, value){
    var klass = node.className || '',
        svg   = klass && klass.baseVal !== undefined

    if (value === undefined) return svg ? klass.baseVal : klass
    svg ? (klass.baseVal = value) : (node.className = value)
  }

  // "true"  => true
  // "false" => false
  // "null"  => null
  // "42"    => 42
  // "42.5"  => 42.5
  // "08"    => "08"
  // JSON    => parse if valid
  // String  => self
  function deserializeValue(value) {
    try {
      return value ?
        value == "true" ||
        ( value == "false" ? false :
          value == "null" ? null :
          +value + "" == value ? +value :
          /^[\[\{]/.test(value) ? $.parseJSON(value) :
          value )
        : value
    } catch(e) {
      return value
    }
  }

  $.type = type
  $.isFunction = isFunction
  $.isWindow = isWindow
  $.isArray = isArray
  $.isPlainObject = isPlainObject

  $.isEmptyObject = function(obj) {
    var name
    for (name in obj) return false
    return true
  }

  $.inArray = function(elem, array, i){
    return emptyArray.indexOf.call(array, elem, i)
  }

  $.camelCase = camelize
  $.trim = function(str) {
    return str == null ? "" : String.prototype.trim.call(str)
  }

  // plugin compatibility
  $.uuid = 0
  $.support = { }
  $.expr = { }
  $.noop = function() {}

  $.map = function(elements, callback){
    var value, values = [], i, key
    if (likeArray(elements))
      for (i = 0; i < elements.length; i++) {
        value = callback(elements[i], i)
        if (value != null) values.push(value)
      }
    else
      for (key in elements) {
        value = callback(elements[key], key)
        if (value != null) values.push(value)
      }
    return flatten(values)
  }

  $.each = function(elements, callback){
    var i, key
    if (likeArray(elements)) {
      for (i = 0; i < elements.length; i++)
        if (callback.call(elements[i], i, elements[i]) === false) return elements
    } else {
      for (key in elements)
        if (callback.call(elements[key], key, elements[key]) === false) return elements
    }

    return elements
  }

  $.grep = function(elements, callback){
    return filter.call(elements, callback)
  }

  if (window.JSON) $.parseJSON = JSON.parse

  // Populate the class2type map
  $.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
    class2type[ "[object " + name + "]" ] = name.toLowerCase()
  })

  // Define methods that will be available on all
  // Zepto collections
  $.fn = {
    constructor: zepto.Z,
    length: 0,

    // Because a collection acts like an array
    // copy over these useful array functions.
    forEach: emptyArray.forEach,
    reduce: emptyArray.reduce,
    push: emptyArray.push,
    sort: emptyArray.sort,
    splice: emptyArray.splice,
    indexOf: emptyArray.indexOf,
    concat: function(){
      var i, value, args = []
      for (i = 0; i < arguments.length; i++) {
        value = arguments[i]
        args[i] = zepto.isZ(value) ? value.toArray() : value
      }
      return concat.apply(zepto.isZ(this) ? this.toArray() : this, args)
    },

    // `map` and `slice` in the jQuery API work differently
    // from their array counterparts
    map: function(fn){
      return $($.map(this, function(el, i){ return fn.call(el, i, el) }))
    },
    slice: function(){
      return $(slice.apply(this, arguments))
    },

    ready: function(callback){
      // need to check if document.body exists for IE as that browser reports
      // document ready when it hasn't yet created the body element
      if (readyRE.test(document.readyState) && document.body) callback($)
      else document.addEventListener('DOMContentLoaded', function(){ callback($) }, false)
      return this
    },
    get: function(idx){
      return idx === undefined ? slice.call(this) : this[idx >= 0 ? idx : idx + this.length]
    },
    toArray: function(){ return this.get() },
    size: function(){
      return this.length
    },
    remove: function(){
      return this.each(function(){
        if (this.parentNode != null)
          this.parentNode.removeChild(this)
      })
    },
    each: function(callback){
      emptyArray.every.call(this, function(el, idx){
        return callback.call(el, idx, el) !== false
      })
      return this
    },
    filter: function(selector){
      if (isFunction(selector)) return this.not(this.not(selector))
      return $(filter.call(this, function(element){
        return zepto.matches(element, selector)
      }))
    },
    add: function(selector,context){
      return $(uniq(this.concat($(selector,context))))
    },
    is: function(selector){
      return this.length > 0 && zepto.matches(this[0], selector)
    },
    not: function(selector){
      var nodes=[]
      if (isFunction(selector) && selector.call !== undefined)
        this.each(function(idx){
          if (!selector.call(this,idx)) nodes.push(this)
        })
      else {
        var excludes = typeof selector == 'string' ? this.filter(selector) :
          (likeArray(selector) && isFunction(selector.item)) ? slice.call(selector) : $(selector)
        this.forEach(function(el){
          if (excludes.indexOf(el) < 0) nodes.push(el)
        })
      }
      return $(nodes)
    },
    has: function(selector){
      return this.filter(function(){
        return isObject(selector) ?
          $.contains(this, selector) :
          $(this).find(selector).size()
      })
    },
    eq: function(idx){
      return idx === -1 ? this.slice(idx) : this.slice(idx, + idx + 1)
    },
    first: function(){
      var el = this[0]
      return el && !isObject(el) ? el : $(el)
    },
    last: function(){
      var el = this[this.length - 1]
      return el && !isObject(el) ? el : $(el)
    },
    find: function(selector){
      var result, $this = this
      if (!selector) result = $()
      else if (typeof selector == 'object')
        result = $(selector).filter(function(){
          var node = this
          return emptyArray.some.call($this, function(parent){
            return $.contains(parent, node)
          })
        })
      else if (this.length == 1) result = $(zepto.qsa(this[0], selector))
      else result = this.map(function(){ return zepto.qsa(this, selector) })
      return result
    },
    closest: function(selector, context){
      var node = this[0], collection = false
      if (typeof selector == 'object') collection = $(selector)
      while (node && !(collection ? collection.indexOf(node) >= 0 : zepto.matches(node, selector)))
        node = node !== context && !isDocument(node) && node.parentNode
      return $(node)
    },
    parents: function(selector){
      var ancestors = [], nodes = this
      while (nodes.length > 0)
        nodes = $.map(nodes, function(node){
          if ((node = node.parentNode) && !isDocument(node) && ancestors.indexOf(node) < 0) {
            ancestors.push(node)
            return node
          }
        })
      return filtered(ancestors, selector)
    },
    parent: function(selector){
      return filtered(uniq(this.pluck('parentNode')), selector)
    },
    children: function(selector){
      return filtered(this.map(function(){ return children(this) }), selector)
    },
    contents: function() {
      return this.map(function() { return this.contentDocument || slice.call(this.childNodes) })
    },
    siblings: function(selector){
      return filtered(this.map(function(i, el){
        return filter.call(children(el.parentNode), function(child){ return child!==el })
      }), selector)
    },
    empty: function(){
      return this.each(function(){ this.innerHTML = '' })
    },
    // `pluck` is borrowed from Prototype.js
    pluck: function(property){
      return $.map(this, function(el){ return el[property] })
    },
    show: function(){
      return this.each(function(){
        this.style.display == "none" && (this.style.display = '')
        if (getComputedStyle(this, '').getPropertyValue("display") == "none")
          this.style.display = defaultDisplay(this.nodeName)
      })
    },
    replaceWith: function(newContent){
      return this.before(newContent).remove()
    },
    wrap: function(structure){
      var func = isFunction(structure)
      if (this[0] && !func)
        var dom   = $(structure).get(0),
            clone = dom.parentNode || this.length > 1

      return this.each(function(index){
        $(this).wrapAll(
          func ? structure.call(this, index) :
            clone ? dom.cloneNode(true) : dom
        )
      })
    },
    wrapAll: function(structure){
      if (this[0]) {
        $(this[0]).before(structure = $(structure))
        var children
        // drill down to the inmost element
        while ((children = structure.children()).length) structure = children.first()
        $(structure).append(this)
      }
      return this
    },
    wrapInner: function(structure){
      var func = isFunction(structure)
      return this.each(function(index){
        var self = $(this), contents = self.contents(),
            dom  = func ? structure.call(this, index) : structure
        contents.length ? contents.wrapAll(dom) : self.append(dom)
      })
    },
    unwrap: function(){
      this.parent().each(function(){
        $(this).replaceWith($(this).children())
      })
      return this
    },
    clone: function(){
      return this.map(function(){ return this.cloneNode(true) })
    },
    hide: function(){
      return this.css("display", "none")
    },
    toggle: function(setting){
      return this.each(function(){
        var el = $(this)
        ;(setting === undefined ? el.css("display") == "none" : setting) ? el.show() : el.hide()
      })
    },
    prev: function(selector){ return $(this.pluck('previousElementSibling')).filter(selector || '*') },
    next: function(selector){ return $(this.pluck('nextElementSibling')).filter(selector || '*') },
    html: function(html){
      return 0 in arguments ?
        this.each(function(idx){
          var originHtml = this.innerHTML
          $(this).empty().append( funcArg(this, html, idx, originHtml) )
        }) :
        (0 in this ? this[0].innerHTML : null)
    },
    text: function(text){
      return 0 in arguments ?
        this.each(function(idx){
          var newText = funcArg(this, text, idx, this.textContent)
          this.textContent = newText == null ? '' : ''+newText
        }) :
        (0 in this ? this[0].textContent : null)
    },
    attr: function(name, value){
      var result
      return (typeof name == 'string' && !(1 in arguments)) ?
        (!this.length || this[0].nodeType !== 1 ? undefined :
          (!(result = this[0].getAttribute(name)) && name in this[0]) ? this[0][name] : result
        ) :
        this.each(function(idx){
          if (this.nodeType !== 1) return
          if (isObject(name)) for (key in name) setAttribute(this, key, name[key])
          else setAttribute(this, name, funcArg(this, value, idx, this.getAttribute(name)))
        })
    },
    removeAttr: function(name){
      return this.each(function(){ this.nodeType === 1 && name.split(' ').forEach(function(attribute){
        setAttribute(this, attribute)
      }, this)})
    },
    prop: function(name, value){
      name = propMap[name] || name
      return (1 in arguments) ?
        this.each(function(idx){
          this[name] = funcArg(this, value, idx, this[name])
        }) :
        (this[0] && this[0][name])
    },
    data: function(name, value){
      var attrName = 'data-' + name.replace(capitalRE, '-$1').toLowerCase()

      var data = (1 in arguments) ?
        this.attr(attrName, value) :
        this.attr(attrName)

      return data !== null ? deserializeValue(data) : undefined
    },
    val: function(value){
      return 0 in arguments ?
        this.each(function(idx){
          this.value = funcArg(this, value, idx, this.value)
        }) :
        (this[0] && (this[0].multiple ?
           $(this[0]).find('option').filter(function(){ return this.selected }).pluck('value') :
           this[0].value)
        )
    },
    offset: function(coordinates){
      if (coordinates) return this.each(function(index){
        var $this = $(this),
            coords = funcArg(this, coordinates, index, $this.offset()),
            parentOffset = $this.offsetParent().offset(),
            props = {
              top:  coords.top  - parentOffset.top,
              left: coords.left - parentOffset.left
            }

        if ($this.css('position') == 'static') props['position'] = 'relative'
        $this.css(props)
      })
      if (!this.length) return null
      if (!$.contains(document.documentElement, this[0]))
        return {top: 0, left: 0}
      var obj = this[0].getBoundingClientRect()
      return {
        left: obj.left + window.pageXOffset,
        top: obj.top + window.pageYOffset,
        width: Math.round(obj.width),
        height: Math.round(obj.height)
      }
    },
    css: function(property, value){
      if (arguments.length < 2) {
        var computedStyle, element = this[0]
        if(!element) return
        computedStyle = getComputedStyle(element, '')
        if (typeof property == 'string')
          return element.style[camelize(property)] || computedStyle.getPropertyValue(property)
        else if (isArray(property)) {
          var props = {}
          $.each(property, function(_, prop){
            props[prop] = (element.style[camelize(prop)] || computedStyle.getPropertyValue(prop))
          })
          return props
        }
      }

      var css = ''
      if (type(property) == 'string') {
        if (!value && value !== 0)
          this.each(function(){ this.style.removeProperty(dasherize(property)) })
        else
          css = dasherize(property) + ":" + maybeAddPx(property, value)
      } else {
        for (key in property)
          if (!property[key] && property[key] !== 0)
            this.each(function(){ this.style.removeProperty(dasherize(key)) })
          else
            css += dasherize(key) + ':' + maybeAddPx(key, property[key]) + ';'
      }

      return this.each(function(){ this.style.cssText += ';' + css })
    },
    index: function(element){
      return element ? this.indexOf($(element)[0]) : this.parent().children().indexOf(this[0])
    },
    hasClass: function(name){
      if (!name) return false
      return emptyArray.some.call(this, function(el){
        return this.test(className(el))
      }, classRE(name))
    },
    addClass: function(name){
      if (!name) return this
      return this.each(function(idx){
        if (!('className' in this)) return
        classList = []
        var cls = className(this), newName = funcArg(this, name, idx, cls)
        newName.split(/\s+/g).forEach(function(klass){
          if (!$(this).hasClass(klass)) classList.push(klass)
        }, this)
        classList.length && className(this, cls + (cls ? " " : "") + classList.join(" "))
      })
    },
    removeClass: function(name){
      return this.each(function(idx){
        if (!('className' in this)) return
        if (name === undefined) return className(this, '')
        classList = className(this)
        funcArg(this, name, idx, classList).split(/\s+/g).forEach(function(klass){
          classList = classList.replace(classRE(klass), " ")
        })
        className(this, classList.trim())
      })
    },
    toggleClass: function(name, when){
      if (!name) return this
      return this.each(function(idx){
        var $this = $(this), names = funcArg(this, name, idx, className(this))
        names.split(/\s+/g).forEach(function(klass){
          (when === undefined ? !$this.hasClass(klass) : when) ?
            $this.addClass(klass) : $this.removeClass(klass)
        })
      })
    },
    scrollTop: function(value){
      if (!this.length) return
      var hasScrollTop = 'scrollTop' in this[0]
      if (value === undefined) return hasScrollTop ? this[0].scrollTop : this[0].pageYOffset
      return this.each(hasScrollTop ?
        function(){ this.scrollTop = value } :
        function(){ this.scrollTo(this.scrollX, value) })
    },
    scrollLeft: function(value){
      if (!this.length) return
      var hasScrollLeft = 'scrollLeft' in this[0]
      if (value === undefined) return hasScrollLeft ? this[0].scrollLeft : this[0].pageXOffset
      return this.each(hasScrollLeft ?
        function(){ this.scrollLeft = value } :
        function(){ this.scrollTo(value, this.scrollY) })
    },
    position: function() {
      if (!this.length) return

      var elem = this[0],
        // Get *real* offsetParent
        offsetParent = this.offsetParent(),
        // Get correct offsets
        offset       = this.offset(),
        parentOffset = rootNodeRE.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset()

      // Subtract element margins
      // note: when an element has margin: auto the offsetLeft and marginLeft
      // are the same in Safari causing offset.left to incorrectly be 0
      offset.top  -= parseFloat( $(elem).css('margin-top') ) || 0
      offset.left -= parseFloat( $(elem).css('margin-left') ) || 0

      // Add offsetParent borders
      parentOffset.top  += parseFloat( $(offsetParent[0]).css('border-top-width') ) || 0
      parentOffset.left += parseFloat( $(offsetParent[0]).css('border-left-width') ) || 0

      // Subtract the two offsets
      return {
        top:  offset.top  - parentOffset.top,
        left: offset.left - parentOffset.left
      }
    },
    offsetParent: function() {
      return this.map(function(){
        var parent = this.offsetParent || document.body
        while (parent && !rootNodeRE.test(parent.nodeName) && $(parent).css("position") == "static")
          parent = parent.offsetParent
        return parent
      })
    }
  }

  // for now
  $.fn.detach = $.fn.remove

  // Generate the `width` and `height` functions
  ;['width', 'height'].forEach(function(dimension){
    var dimensionProperty =
      dimension.replace(/./, function(m){ return m[0].toUpperCase() })

    $.fn[dimension] = function(value){
      var offset, el = this[0]
      if (value === undefined) return isWindow(el) ? el['inner' + dimensionProperty] :
        isDocument(el) ? el.documentElement['scroll' + dimensionProperty] :
        (offset = this.offset()) && offset[dimension]
      else return this.each(function(idx){
        el = $(this)
        el.css(dimension, funcArg(this, value, idx, el[dimension]()))
      })
    }
  })

  function traverseNode(node, fun) {
    fun(node)
    for (var i = 0, len = node.childNodes.length; i < len; i++)
      traverseNode(node.childNodes[i], fun)
  }

  // Generate the `after`, `prepend`, `before`, `append`,
  // `insertAfter`, `insertBefore`, `appendTo`, and `prependTo` methods.
  adjacencyOperators.forEach(function(operator, operatorIndex) {
    var inside = operatorIndex % 2 //=> prepend, append

    $.fn[operator] = function(){
      // arguments can be nodes, arrays of nodes, Zepto objects and HTML strings
      var argType, nodes = $.map(arguments, function(arg) {
            argType = type(arg)
            return argType == "object" || argType == "array" || arg == null ?
              arg : zepto.fragment(arg)
          }),
          parent, copyByClone = this.length > 1
      if (nodes.length < 1) return this

      return this.each(function(_, target){
        parent = inside ? target : target.parentNode

        // convert all methods to a "before" operation
        target = operatorIndex == 0 ? target.nextSibling :
                 operatorIndex == 1 ? target.firstChild :
                 operatorIndex == 2 ? target :
                 null

        var parentInDocument = $.contains(document.documentElement, parent)

        nodes.forEach(function(node){
          if (copyByClone) node = node.cloneNode(true)
          else if (!parent) return $(node).remove()

          parent.insertBefore(node, target)
          if (parentInDocument) traverseNode(node, function(el){
            if (el.nodeName != null && el.nodeName.toUpperCase() === 'SCRIPT' &&
               (!el.type || el.type === 'text/javascript') && !el.src)
              window['eval'].call(window, el.innerHTML)
          })
        })
      })
    }

    // after    => insertAfter
    // prepend  => prependTo
    // before   => insertBefore
    // append   => appendTo
    $.fn[inside ? operator+'To' : 'insert'+(operatorIndex ? 'Before' : 'After')] = function(html){
      $(html)[operator](this)
      return this
    }
  })

  zepto.Z.prototype = Z.prototype = $.fn

  // Export internal API functions in the `$.zepto` namespace
  zepto.uniq = uniq
  zepto.deserializeValue = deserializeValue
  $.zepto = zepto

  return $
})()

// If `$` is not yet defined, point it to `Zepto`
window.Zepto = Zepto
window.$ === undefined && (window.$ = Zepto)
;
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var _zid = 1, undefined,
      slice = Array.prototype.slice,
      isFunction = $.isFunction,
      isString = function(obj){ return typeof obj == 'string' },
      handlers = {},
      specialEvents={},
      focusinSupported = 'onfocusin' in window,
      focus = { focus: 'focusin', blur: 'focusout' },
      hover = { mouseenter: 'mouseover', mouseleave: 'mouseout' }

  specialEvents.click = specialEvents.mousedown = specialEvents.mouseup = specialEvents.mousemove = 'MouseEvents'

  function zid(element) {
    return element._zid || (element._zid = _zid++)
  }
  function findHandlers(element, event, fn, selector) {
    event = parse(event)
    if (event.ns) var matcher = matcherFor(event.ns)
    return (handlers[zid(element)] || []).filter(function(handler) {
      return handler
        && (!event.e  || handler.e == event.e)
        && (!event.ns || matcher.test(handler.ns))
        && (!fn       || zid(handler.fn) === zid(fn))
        && (!selector || handler.sel == selector)
    })
  }
  function parse(event) {
    var parts = ('' + event).split('.')
    return {e: parts[0], ns: parts.slice(1).sort().join(' ')}
  }
  function matcherFor(ns) {
    return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)')
  }

  function eventCapture(handler, captureSetting) {
    return handler.del &&
      (!focusinSupported && (handler.e in focus)) ||
      !!captureSetting
  }

  function realEvent(type) {
    return hover[type] || (focusinSupported && focus[type]) || type
  }

  function add(element, events, fn, data, selector, delegator, capture){
    var id = zid(element), set = (handlers[id] || (handlers[id] = []))
    events.split(/\s/).forEach(function(event){
      if (event == 'ready') return $(document).ready(fn)
      var handler   = parse(event)
      handler.fn    = fn
      handler.sel   = selector
      // emulate mouseenter, mouseleave
      if (handler.e in hover) fn = function(e){
        var related = e.relatedTarget
        if (!related || (related !== this && !$.contains(this, related)))
          return handler.fn.apply(this, arguments)
      }
      handler.del   = delegator
      var callback  = delegator || fn
      handler.proxy = function(e){
        e = compatible(e)
        if (e.isImmediatePropagationStopped()) return
        e.data = data
        var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
        if (result === false) e.preventDefault(), e.stopPropagation()
        return result
      }
      handler.i = set.length
      set.push(handler)
      if ('addEventListener' in element)
        element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
    })
  }
  function remove(element, events, fn, selector, capture){
    var id = zid(element)
    ;(events || '').split(/\s/).forEach(function(event){
      findHandlers(element, event, fn, selector).forEach(function(handler){
        delete handlers[id][handler.i]
      if ('removeEventListener' in element)
        element.removeEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
      })
    })
  }

  $.event = { add: add, remove: remove }

  $.proxy = function(fn, context) {
    var args = (2 in arguments) && slice.call(arguments, 2)
    if (isFunction(fn)) {
      var proxyFn = function(){ return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments) }
      proxyFn._zid = zid(fn)
      return proxyFn
    } else if (isString(context)) {
      if (args) {
        args.unshift(fn[context], fn)
        return $.proxy.apply(null, args)
      } else {
        return $.proxy(fn[context], fn)
      }
    } else {
      throw new TypeError("expected function")
    }
  }

  $.fn.bind = function(event, data, callback){
    return this.on(event, data, callback)
  }
  $.fn.unbind = function(event, callback){
    return this.off(event, callback)
  }
  $.fn.one = function(event, selector, data, callback){
    return this.on(event, selector, data, callback, 1)
  }

  var returnTrue = function(){return true},
      returnFalse = function(){return false},
      ignoreProperties = /^([A-Z]|returnValue$|layer[XY]$)/,
      eventMethods = {
        preventDefault: 'isDefaultPrevented',
        stopImmediatePropagation: 'isImmediatePropagationStopped',
        stopPropagation: 'isPropagationStopped'
      }

  function compatible(event, source) {
    if (source || !event.isDefaultPrevented) {
      source || (source = event)

      $.each(eventMethods, function(name, predicate) {
        var sourceMethod = source[name]
        event[name] = function(){
          this[predicate] = returnTrue
          return sourceMethod && sourceMethod.apply(source, arguments)
        }
        event[predicate] = returnFalse
      })

      if (source.defaultPrevented !== undefined ? source.defaultPrevented :
          'returnValue' in source ? source.returnValue === false :
          source.getPreventDefault && source.getPreventDefault())
        event.isDefaultPrevented = returnTrue
    }
    return event
  }

  function createProxy(event) {
    var key, proxy = { originalEvent: event }
    for (key in event)
      if (!ignoreProperties.test(key) && event[key] !== undefined) proxy[key] = event[key]

    return compatible(proxy, event)
  }

  $.fn.delegate = function(selector, event, callback){
    return this.on(event, selector, callback)
  }
  $.fn.undelegate = function(selector, event, callback){
    return this.off(event, selector, callback)
  }

  $.fn.live = function(event, callback){
    $(document.body).delegate(this.selector, event, callback)
    return this
  }
  $.fn.die = function(event, callback){
    $(document.body).undelegate(this.selector, event, callback)
    return this
  }

  $.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (callback === undefined || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }

      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
  $.fn.off = function(event, selector, callback){
    var $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.off(type, selector, fn)
      })
      return $this
    }

    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = selector, selector = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(){
      remove(this, event, callback, selector)
    })
  }

  $.fn.trigger = function(event, args){
    event = (isString(event) || $.isPlainObject(event)) ? $.Event(event) : compatible(event)
    event._args = args
    return this.each(function(){
      // handle focus(), blur() by calling them directly
      if (event.type in focus && typeof this[event.type] == "function") this[event.type]()
      // items in the collection might not be DOM elements
      else if ('dispatchEvent' in this) this.dispatchEvent(event)
      else $(this).triggerHandler(event, args)
    })
  }

  // triggers event handlers on current element just as if an event occurred,
  // doesn't trigger an actual event, doesn't bubble
  $.fn.triggerHandler = function(event, args){
    var e, result
    this.each(function(i, element){
      e = createProxy(isString(event) ? $.Event(event) : event)
      e._args = args
      e.target = element
      $.each(findHandlers(element, event.type || event), function(i, handler){
        result = handler.proxy(e)
        if (e.isImmediatePropagationStopped()) return false
      })
    })
    return result
  }

  // shortcut methods for `.bind(event, fn)` for each event type
  ;('focusin focusout focus blur load resize scroll unload click dblclick '+
  'mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave '+
  'change select keydown keypress keyup error').split(' ').forEach(function(event) {
    $.fn[event] = function(callback) {
      return (0 in arguments) ?
        this.bind(event, callback) :
        this.trigger(event)
    }
  })

  $.Event = function(type, props) {
    if (!isString(type)) props = type, type = props.type
    var event = document.createEvent(specialEvents[type] || 'Events'), bubbles = true
    if (props) for (var name in props) (name == 'bubbles') ? (bubbles = !!props[name]) : (event[name] = props[name])
    event.initEvent(type, bubbles, true)
    return compatible(event)
  }

})(Zepto)
;
//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

;(function($){
  var jsonpID = 0,
      document = window.document,
      key,
      name,
      rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      scriptTypeRE = /^(?:text|application)\/javascript/i,
      xmlTypeRE = /^(?:text|application)\/xml/i,
      jsonType = 'application/json',
      htmlType = 'text/html',
      blankRE = /^\s*$/,
      originAnchor = document.createElement('a')

  originAnchor.href = window.location.href

  // trigger a custom event and return false if it was cancelled
  function triggerAndReturn(context, eventName, data) {
    var event = $.Event(eventName)
    $(context).trigger(event, data)
    return !event.isDefaultPrevented()
  }

  // trigger an Ajax "global" event
  function triggerGlobal(settings, context, eventName, data) {
    if (settings.global) return triggerAndReturn(context || document, eventName, data)
  }

  // Number of active Ajax requests
  $.active = 0

  function ajaxStart(settings) {
    if (settings.global && $.active++ === 0) triggerGlobal(settings, null, 'ajaxStart')
  }
  function ajaxStop(settings) {
    if (settings.global && !(--$.active)) triggerGlobal(settings, null, 'ajaxStop')
  }

  // triggers an extra global event "ajaxBeforeSend" that's like "ajaxSend" but cancelable
  function ajaxBeforeSend(xhr, settings) {
    var context = settings.context
    if (settings.beforeSend.call(context, xhr, settings) === false ||
        triggerGlobal(settings, context, 'ajaxBeforeSend', [xhr, settings]) === false)
      return false

    triggerGlobal(settings, context, 'ajaxSend', [xhr, settings])
  }
  function ajaxSuccess(data, xhr, settings, deferred) {
    var context = settings.context, status = 'success'
    settings.success.call(context, data, status, xhr)
    if (deferred) deferred.resolveWith(context, [data, status, xhr])
    triggerGlobal(settings, context, 'ajaxSuccess', [xhr, settings, data])
    ajaxComplete(status, xhr, settings)
  }
  // type: "timeout", "error", "abort", "parsererror"
  function ajaxError(error, type, xhr, settings, deferred) {
    var context = settings.context
    settings.error.call(context, xhr, type, error)
    if (deferred) deferred.rejectWith(context, [xhr, type, error])
    triggerGlobal(settings, context, 'ajaxError', [xhr, settings, error || type])
    ajaxComplete(type, xhr, settings)
  }
  // status: "success", "notmodified", "error", "timeout", "abort", "parsererror"
  function ajaxComplete(status, xhr, settings) {
    var context = settings.context
    settings.complete.call(context, xhr, status)
    triggerGlobal(settings, context, 'ajaxComplete', [xhr, settings])
    ajaxStop(settings)
  }

  // Empty function, used as default callback
  function empty() {}

  $.ajaxJSONP = function(options, deferred){
    if (!('type' in options)) return $.ajax(options)

    var _callbackName = options.jsonpCallback,
      callbackName = ($.isFunction(_callbackName) ?
        _callbackName() : _callbackName) || ('jsonp' + (++jsonpID)),
      script = document.createElement('script'),
      originalCallback = window[callbackName],
      responseData,
      abort = function(errorType) {
        $(script).triggerHandler('error', errorType || 'abort')
      },
      xhr = { abort: abort }, abortTimeout

    if (deferred) deferred.promise(xhr)

    $(script).on('load error', function(e, errorType){
      clearTimeout(abortTimeout)
      $(script).off().remove()

      if (e.type == 'error' || !responseData) {
        ajaxError(null, errorType || 'error', xhr, options, deferred)
      } else {
        ajaxSuccess(responseData[0], xhr, options, deferred)
      }

      window[callbackName] = originalCallback
      if (responseData && $.isFunction(originalCallback))
        originalCallback(responseData[0])

      originalCallback = responseData = undefined
    })

    if (ajaxBeforeSend(xhr, options) === false) {
      abort('abort')
      return xhr
    }

    window[callbackName] = function(){
      responseData = arguments
    }

    script.src = options.url.replace(/\?(.+)=\?/, '?$1=' + callbackName)
    document.head.appendChild(script)

    if (options.timeout > 0) abortTimeout = setTimeout(function(){
      abort('timeout')
    }, options.timeout)

    return xhr
  }

  $.ajaxSettings = {
    // Default type of request
    type: 'GET',
    // Callback that is executed before request
    beforeSend: empty,
    // Callback that is executed if the request succeeds
    success: empty,
    // Callback that is executed the the server drops error
    error: empty,
    // Callback that is executed on request complete (both: error and success)
    complete: empty,
    // The context for the callbacks
    context: null,
    // Whether to trigger "global" Ajax events
    global: true,
    // Transport
    xhr: function () {
      return new window.XMLHttpRequest()
    },
    // MIME types mapping
    // IIS returns Javascript as "application/x-javascript"
    accepts: {
      script: 'text/javascript, application/javascript, application/x-javascript',
      json:   jsonType,
      xml:    'application/xml, text/xml',
      html:   htmlType,
      text:   'text/plain'
    },
    // Whether the request is to another domain
    crossDomain: false,
    // Default timeout
    timeout: 0,
    // Whether data should be serialized to string
    processData: true,
    // Whether the browser should be allowed to cache GET responses
    cache: true
  }

  function mimeToDataType(mime) {
    if (mime) mime = mime.split(';', 2)[0]
    return mime && ( mime == htmlType ? 'html' :
      mime == jsonType ? 'json' :
      scriptTypeRE.test(mime) ? 'script' :
      xmlTypeRE.test(mime) && 'xml' ) || 'text'
  }

  function appendQuery(url, query) {
    if (query == '') return url
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
  }

  // serialize payload and append it to the URL for GET requests
  function serializeData(options) {
    if (options.processData && options.data && $.type(options.data) != "string")
      options.data = $.param(options.data, options.traditional)
    if (options.data && (!options.type || options.type.toUpperCase() == 'GET'))
      options.url = appendQuery(options.url, options.data), options.data = undefined
  }

  $.ajax = function(options){
    var settings = $.extend({}, options || {}),
        deferred = $.Deferred && $.Deferred(),
        urlAnchor, hashIndex
    for (key in $.ajaxSettings) if (settings[key] === undefined) settings[key] = $.ajaxSettings[key]

    ajaxStart(settings)

    if (!settings.crossDomain) {
      urlAnchor = document.createElement('a')
      urlAnchor.href = settings.url
      // cleans up URL for .href (IE only), see https://github.com/madrobby/zepto/pull/1049
      urlAnchor.href = urlAnchor.href
      settings.crossDomain = (originAnchor.protocol + '//' + originAnchor.host) !== (urlAnchor.protocol + '//' + urlAnchor.host)
    }

    if (!settings.url) settings.url = window.location.toString()
    if ((hashIndex = settings.url.indexOf('#')) > -1) settings.url = settings.url.slice(0, hashIndex)
    serializeData(settings)

    var dataType = settings.dataType, hasPlaceholder = /\?.+=\?/.test(settings.url)
    if (hasPlaceholder) dataType = 'jsonp'

    if (settings.cache === false || (
         (!options || options.cache !== true) &&
         ('script' == dataType || 'jsonp' == dataType)
        ))
      settings.url = appendQuery(settings.url, '_=' + Date.now())

    if ('jsonp' == dataType) {
      if (!hasPlaceholder)
        settings.url = appendQuery(settings.url,
          settings.jsonp ? (settings.jsonp + '=?') : settings.jsonp === false ? '' : 'callback=?')
      return $.ajaxJSONP(settings, deferred)
    }

    var mime = settings.accepts[dataType],
        headers = { },
        setHeader = function(name, value) { headers[name.toLowerCase()] = [name, value] },
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol,
        xhr = settings.xhr(),
        nativeSetHeader = xhr.setRequestHeader,
        abortTimeout

    if (deferred) deferred.promise(xhr)

    if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest')
    setHeader('Accept', mime || '*/*')
    if (mime = settings.mimeType || mime) {
      if (mime.indexOf(',') > -1) mime = mime.split(',', 2)[0]
      xhr.overrideMimeType && xhr.overrideMimeType(mime)
    }
    if (settings.contentType || (settings.contentType !== false && settings.data && settings.type.toUpperCase() != 'GET'))
      setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded')

    if (settings.headers) for (name in settings.headers) setHeader(name, settings.headers[name])
    xhr.setRequestHeader = setHeader

    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        xhr.onreadystatechange = empty
        clearTimeout(abortTimeout)
        var result, error = false
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
          dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'))
          result = xhr.responseText

          try {
            // http://perfectionkills.com/global-eval-what-are-the-options/
            if (dataType == 'script')    (1,eval)(result)
            else if (dataType == 'xml')  result = xhr.responseXML
            else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result)
          } catch (e) { error = e }

          if (error) ajaxError(error, 'parsererror', xhr, settings, deferred)
          else ajaxSuccess(result, xhr, settings, deferred)
        } else {
          ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings, deferred)
        }
      }
    }

    if (ajaxBeforeSend(xhr, settings) === false) {
      xhr.abort()
      ajaxError(null, 'abort', xhr, settings, deferred)
      return xhr
    }

    if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

    var async = 'async' in settings ? settings.async : true
    xhr.open(settings.type, settings.url, async, settings.username, settings.password)

    for (name in headers) nativeSetHeader.apply(xhr, headers[name])

    if (settings.timeout > 0) abortTimeout = setTimeout(function(){
        xhr.onreadystatechange = empty
        xhr.abort()
        ajaxError(null, 'timeout', xhr, settings, deferred)
      }, settings.timeout)

    // avoid sending empty string (#319)
    xhr.send(settings.data ? settings.data : null)
    return xhr
  }

  // handle optional data/success arguments
  function parseArguments(url, data, success, dataType) {
    if ($.isFunction(data)) dataType = success, success = data, data = undefined
    if (!$.isFunction(success)) dataType = success, success = undefined
    return {
      url: url
    , data: data
    , success: success
    , dataType: dataType
    }
  }

  $.get = function(/* url, data, success, dataType */){
    return $.ajax(parseArguments.apply(null, arguments))
  }

  $.post = function(/* url, data, success, dataType */){
    var options = parseArguments.apply(null, arguments)
    options.type = 'POST'
    return $.ajax(options)
  }

  $.getJSON = function(/* url, data, success */){
    var options = parseArguments.apply(null, arguments)
    options.dataType = 'json'
    return $.ajax(options)
  }

  $.fn.load = function(url, data, success){
    if (!this.length) return this
    var self = this, parts = url.split(/\s/), selector,
        options = parseArguments(url, data, success),
        callback = options.success
    if (parts.length > 1) options.url = parts[0], selector = parts[1]
    options.success = function(response){
      self.html(selector ?
        $('<div>').html(response.replace(rscript, "")).find(selector)
        : response)
      callback && callback.apply(self, arguments)
    }
    $.ajax(options)
    return this
  }

  var escape = encodeURIComponent

  function serialize(params, obj, traditional, scope){
    var type, array = $.isArray(obj), hash = $.isPlainObject(obj)
    $.each(obj, function(key, value) {
      type = $.type(value)
      if (scope) key = traditional ? scope :
        scope + '[' + (hash || type == 'object' || type == 'array' ? key : '') + ']'
      // handle data in serializeArray() format
      if (!scope && array) params.add(value.name, value.value)
      // recurse into nested objects
      else if (type == "array" || (!traditional && type == "object"))
        serialize(params, value, traditional, key)
      else params.add(key, value)
    })
  }

  $.param = function(obj, traditional){
    var params = []
    params.add = function(key, value) {
      if ($.isFunction(value)) value = value()
      if (value == null) value = ""
      this.push(escape(key) + '=' + escape(value))
    }
    serialize(params, obj, traditional)
    return params.join('&').replace(/%20/g, '+')
  }
})(Zepto)
;



//     Zepto.js
//     (c) 2010-2015 Thomas Fuchs
//     Zepto.js may be freely distributed under the MIT license.

// The following code is heavily inspired by jQuery's $.fn.data()

;(function($){
  var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
    exp = $.expando = 'Zepto' + (+new Date()), emptyArray = []

  // Get value from node:
  // 1. first try key as given,
  // 2. then try camelized key,
  // 3. fall back to reading "data-*" attribute.
  function getData(node, name) {
    var id = node[exp], store = id && data[id]
    if (name === undefined) return store || setData(node)
    else {
      if (store) {
        if (name in store) return store[name]
        var camelName = camelize(name)
        if (camelName in store) return store[camelName]
      }
      return dataAttr.call($(node), name)
    }
  }

  // Store value under camelized key on node
  function setData(node, name, value) {
    var id = node[exp] || (node[exp] = ++$.uuid),
      store = data[id] || (data[id] = attributeData(node))
    if (name !== undefined) store[camelize(name)] = value
    return store
  }

  // Read all "data-*" attributes from a node
  function attributeData(node) {
    var store = {}
    $.each(node.attributes || emptyArray, function(i, attr){
      if (attr.name.indexOf('data-') == 0)
        store[camelize(attr.name.replace('data-', ''))] =
          $.zepto.deserializeValue(attr.value)
    })
    return store
  }

  $.fn.data = function(name, value) {
    return value === undefined ?
      // set multiple values via object
      $.isPlainObject(name) ?
        this.each(function(i, node){
          $.each(name, function(key, value){ setData(node, key, value) })
        }) :
        // get value from first element
        (0 in this ? getData(this[0], name) : undefined) :
      // set value on all elements
      this.each(function(){ setData(this, name, value) })
  }

  $.fn.removeData = function(names) {
    if (typeof names == 'string') names = names.split(/\s+/)
    return this.each(function(){
      var id = this[exp], store = id && data[id]
      if (store) $.each(names || store, function(key){
        delete store[names ? camelize(this) : key]
      })
    })
  }

  // Generate extended `remove` and `empty` functions
  ;['remove', 'empty'].forEach(function(methodName){
    var origFn = $.fn[methodName]
    $.fn[methodName] = function() {
      var elements = this.find('*')
      if (methodName === 'remove') elements = elements.add(this)
      elements.removeData()
      return origFn.call(this)
    }
  })
})(Zepto)
;
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));
(function() {
  _.mixin({
    required: function(obj, key) {
      return _.tap(obj[key], function(value) {
        if (!value) {
          return _.error("Parameter '" + key + "' is required for ", obj);
        }
      });
    },
    deleted: function(obj, key) {
      return _.tap(obj[key], function() {
        return delete obj[key];
      });
    },
    loadTemplate: function(path) {
      var template;
      if (template = $("[id='" + path + "']").html()) {
        JST[path] = _.template(template);
      }
      return _.required(JST, path);
    },
    renderTemplate: function(path, options) {
      if (options == null) {
        options = {};
      }
      return _.loadTemplate(path)(options);
    },
    setDebugLevel: function(debugLevel) {
      var DebugLevelMap, level, method, methods, _results;
      DebugLevelMap = {
        0: ['debug', 'time', 'timeEnd'],
        1: ['info', 'log'],
        2: ['warn'],
        3: ['error', 'assert']
      };
      _results = [];
      for (level in DebugLevelMap) {
        methods = DebugLevelMap[level];
        _results.push((function() {
          var _i, _len, _results1;
          _results1 = [];
          for (_i = 0, _len = methods.length; _i < _len; _i++) {
            method = methods[_i];
            if (debugLevel <= level && (console[method] != null)) {
              _results1.push(_[method] = _.bind(console[method], console));
            } else {
              _results1.push(_[method] = _.noop);
            }
          }
          return _results1;
        })());
      }
      return _results;
    }
  });

  _.setDebugLevel(0);

}).call(this);
//     Backbone.js 1.2.0

//     (c) 2010-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(factory) {

  // Establish the root object, `window` (`self`) in the browser, or `global` on the server.
  // We use `self` instead of `window` for `WebWorker` support.
  var root = (typeof self == 'object' && self.self == self && self) ||
            (typeof global == 'object' && global.global == global && global);

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore'), $;
    try { $ = require('jquery'); } catch(e) {}
    factory(root, exports, _, $);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var slice = array.slice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.2.0';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... this will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {};

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Iterates over the standard `event, callback` (as well as the fancy multiple
  // space-separated events `"change blur", callback` and jQuery-style event
  // maps `{event: callback}`), reducing them by manipulating `memo`.
  // Passes a normalized single event name and callback, as well as any
  // optional `opts`.
  var eventsApi = function(iteratee, memo, name, callback, opts) {
    var i = 0, names;
    if (name && typeof name === 'object') {
      // Handle event maps.
      for (names = _.keys(name); i < names.length ; i++) {
        memo = iteratee(memo, names[i], name[names[i]], opts);
      }
    } else if (name && eventSplitter.test(name)) {
      // Handle space separated event names.
      for (names = name.split(eventSplitter); i < names.length; i++) {
        memo = iteratee(memo, names[i], callback, opts);
      }
    } else {
      memo = iteratee(memo, name, callback, opts);
    }
    return memo;
  };

  // Bind an event to a `callback` function. Passing `"all"` will bind
  // the callback to all events fired.
  Events.on = function(name, callback, context) {
    return internalOn(this, name, callback, context);
  };

  // An internal use `on` function, used to guard the `listening` argument from
  // the public API.
  var internalOn = function(obj, name, callback, context, listening) {
    obj._events = eventsApi(onApi, obj._events || {}, name, callback, {
        context: context,
        ctx: obj,
        listening: listening
    });

    if (listening) {
      var listeners = obj._listeners || (obj._listeners = {});
      listeners[listening.id] = listening;
    }

    return obj;
  };

  // Inversion-of-control versions of `on`. Tell *this* object to listen to
  // an event in another object... keeping track of what it's listening to.
  Events.listenTo =  function(obj, name, callback) {
    if (!obj) return this;
    var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
    var listeningTo = this._listeningTo || (this._listeningTo = {});
    var listening = listeningTo[id];

    // This object is not listening to any other events on `obj` yet.
    // Setup the necessary references to track the listening callbacks.
    if (!listening) {
      var thisId = this._listenId || (this._listenId = _.uniqueId('l'));
      listening = listeningTo[id] = {obj: obj, objId: id, id: thisId, listeningTo: listeningTo, count: 0};
    }

    // Bind callbacks on obj, and keep track of them on listening.
    internalOn(obj, name, callback, this, listening);
    return this;
  };

  // The reducing API that adds a callback to the `events` object.
  var onApi = function(events, name, callback, options) {
    if (callback) {
      var handlers = events[name] || (events[name] = []);
      var context = options.context, ctx = options.ctx, listening = options.listening;
      if (listening) listening.count++;

      handlers.push({ callback: callback, context: context, ctx: context || ctx, listening: listening });
    }
    return events;
  };

  // Remove one or many callbacks. If `context` is null, removes all
  // callbacks with that function. If `callback` is null, removes all
  // callbacks for the event. If `name` is null, removes all bound
  // callbacks for all events.
  Events.off =  function(name, callback, context) {
    if (!this._events) return this;
    this._events = eventsApi(offApi, this._events, name, callback, {
        context: context,
        listeners: this._listeners
    });
    return this;
  };

  // Tell this object to stop listening to either specific events ... or
  // to every object it's currently listening to.
  Events.stopListening =  function(obj, name, callback) {
    var listeningTo = this._listeningTo;
    if (!listeningTo) return this;

    var ids = obj ? [obj._listenId] : _.keys(listeningTo);

    for (var i = 0; i < ids.length; i++) {
      var listening = listeningTo[ids[i]];

      // If listening doesn't exist, this object is not currently
      // listening to obj. Break out early.
      if (!listening) break;

      listening.obj.off(name, callback, this);
    }
    if (_.isEmpty(listeningTo)) this._listeningTo = void 0;

    return this;
  };

  // The reducing API that removes a callback from the `events` object.
  var offApi = function(events, name, callback, options) {
    // No events to consider.
    if (!events) return;

    var i = 0, length, listening;
    var context = options.context, listeners = options.listeners;

    // Delete all events listeners and "drop" events.
    if (!name && !callback && !context) {
      var ids = _.keys(listeners);
      for (; i < ids.length; i++) {
        listening = listeners[ids[i]];
        delete listeners[listening.id];
        delete listening.listeningTo[listening.objId];
      }
      return;
    }

    var names = name ? [name] : _.keys(events);
    for (; i < names.length; i++) {
      name = names[i];
      var handlers = events[name];

      // Bail out if there are no events stored.
      if (!handlers) break;

      // Replace events if there are any remaining.  Otherwise, clean up.
      var remaining = [];
      for (var j = 0; j < handlers.length; j++) {
        var handler = handlers[j];
        if (
          callback && callback !== handler.callback &&
            callback !== handler.callback._callback ||
              context && context !== handler.context
        ) {
          remaining.push(handler);
        } else {
          listening = handler.listening;
          if (listening && --listening.count === 0) {
            delete listeners[listening.id];
            delete listening.listeningTo[listening.objId];
          }
        }
      }

      // Update tail event if the list has any events.  Otherwise, clean up.
      if (remaining.length) {
        events[name] = remaining;
      } else {
        delete events[name];
      }
    }
    if (_.size(events)) return events;
  };

  // Bind an event to only be triggered a single time. After the first time
  // the callback is invoked, it will be removed. When multiple events are
  // passed in using the space-separated syntax, the event will fire once for every
  // event you passed in, not once for a combination of all events
  Events.once =  function(name, callback, context) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.off, this));
    return this.on(events, void 0, context);
  };

  // Inversion-of-control versions of `once`.
  Events.listenToOnce =  function(obj, name, callback) {
    // Map the event into a `{event: once}` object.
    var events = eventsApi(onceMap, {}, name, callback, _.bind(this.stopListening, this, obj));
    return this.listenTo(obj, events);
  };

  // Reduces the event callbacks into a map of `{event: onceWrapper}`.
  // `offer` unbinds the `onceWrapper` after it as been called.
  var onceMap = function(map, name, callback, offer) {
    if (callback) {
      var once = map[name] = _.once(function() {
        offer(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
    }
    return map;
  };

  // Trigger one or many events, firing all bound callbacks. Callbacks are
  // passed the same arguments as `trigger` is, apart from the event name
  // (unless you're listening on `"all"`, which will cause your callback to
  // receive the true name of the event as the first argument).
  Events.trigger =  function(name) {
    if (!this._events) return this;

    var length = Math.max(0, arguments.length - 1);
    var args = Array(length);
    for (var i = 0; i < length; i++) args[i] = arguments[i + 1];

    eventsApi(triggerApi, this._events, name, void 0, args);
    return this;
  };

  // Handles triggering the appropriate event callbacks.
  var triggerApi = function(objEvents, name, cb, args) {
    if (objEvents) {
      var events = objEvents[name];
      var allEvents = objEvents.all;
      if (events && allEvents) allEvents = allEvents.slice();
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, [name].concat(args));
    }
    return objEvents;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  // Proxy Underscore methods to a Backbone class' prototype using a
  // particular attribute as the data argument
  var addMethod = function(length, method, attribute) {
    switch (length) {
      case 1: return function() {
        return _[method](this[attribute]);
      };
      case 2: return function(value) {
        return _[method](this[attribute], value);
      };
      case 3: return function(iteratee, context) {
        return _[method](this[attribute], iteratee, context);
      };
      case 4: return function(iteratee, defaultVal, context) {
        return _[method](this[attribute], iteratee, defaultVal, context);
      };
      default: return function() {
        var args = slice.call(arguments);
        args.unshift(this[attribute]);
        return _[method].apply(_, args);
      };
    }
  };
  var addUnderscoreMethods = function(Class, methods, attribute) {
    _.each(methods, function(length, method) {
      if (_[method]) Class.prototype[method] = addMethod(length, method, attribute);
    });
  };

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId(this.cidPrefix);
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // The prefix is used to create the client id which is used to identify models locally.
    // You may want to override this if you're experiencing name clashes with model ids.
    cidPrefix: 'c',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Special-cased proxy to underscore's `_.matches` method.
    matches: function(attrs) {
      return !!_.iteratee(attrs, this)(this.attributes);
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0; i < changes.length; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server, merging the response with the model's
    // local attributes. Any changed attributes will trigger a "change" event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes, wait;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);
      wait = options.wait;

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = options.parse ? model.parse(resp, options) : resp;
        if (wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success.call(options.context, model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch' && !options.attrs) options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;
      var wait = options.wait;

      var destroy = function() {
        model.stopListening();
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (wait) destroy();
        if (success) success.call(options.context, model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      var xhr = false;
      if (this.isNew()) {
        _.defer(options.success);
      } else {
        wrapError(this, options);
        xhr = this.sync('delete', this, options);
      }
      if (!wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      var id = this.id || this.attributes[this.idAttribute];
      return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = { keys: 1, values: 1, pairs: 1, invert: 1, pick: 0,
      omit: 0, chain: 1, isEmpty: 1 };

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  addUnderscoreMethods(Model, modelMethods, 'attributes');

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analogous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models), removed;
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      removed = this._removeModels(models, options);
      if (!options.silent && removed) this.trigger('update', this, options);
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : models.slice();
      var id, model, attrs, existing, sort;
      var at = options.at;
      if (at != null) at = +at;
      if (at < 0) at += this.length + 1;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;
      var orderChanged = false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (var i = 0; i < models.length; i++) {
        attrs = models[i];

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(attrs)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge && attrs !== existing) {
            attrs = this._isModel(attrs) ? attrs.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);
          this._addReference(model, options);
        }

        // Do not add multiple models with the same `id`.
        model = existing || model;
        if (!model) continue;
        id = this.modelId(model.attributes);
        if (order && (model.isNew() || !modelMap[id])) {
          order.push(model);

          // Check to see if this is actually a new model at this index.
          orderChanged = orderChanged || !this.models[i] || model.cid !== this.models[i].cid;
        }

        modelMap[id] = true;
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (var i = 0; i < this.length; i++) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this._removeModels(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || orderChanged) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (var i = 0; i < toAdd.length; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (var i = 0; i < orderedModels.length; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        var addOpts = at != null ? _.clone(options) : options;
        for (var i = 0; i < toAdd.length; i++) {
          if (at != null) addOpts.index = at + i;
          (model = toAdd[i]).trigger('add', model, this, addOpts);
        }
        if (sort || orderChanged) this.trigger('sort', this, options);
        if (toAdd.length || toRemove.length) this.trigger('update', this, options);
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options = options ? _.clone(options) : {};
      for (var i = 0; i < this.models.length; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      var id = this.modelId(this._isModel(obj) ? obj.attributes : obj);
      return this._byId[obj] || this._byId[id] || this._byId[obj.cid];
    },

    // Get the model at the given index.
    at: function(index) {
      if (index < 0) index += this.length;
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      var matches = _.matches(attrs);
      return this[first ? 'find' : 'filter'](function(model) {
        return matches(model.attributes);
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success.call(options.context, collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      var wait = options.wait;
      if (!(model = this._prepareModel(model, options))) return false;
      if (!wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp, callbackOpts) {
        if (wait) collection.add(model, callbackOpts);
        if (success) success.call(callbackOpts.context, model, resp, callbackOpts);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models, {
        model: this.model,
        comparator: this.comparator
      });
    },

    // Define how to uniquely identify models in the collection.
    modelId: function (attrs) {
      return attrs[this.model.prototype.idAttribute || 'id'];
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (this._isModel(attrs)) {
        if (!attrs.collection) attrs.collection = this;
        return attrs;
      }
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method called by both remove and set. Does not trigger any
    // additional events. Returns true if anything was actually removed.
    _removeModels: function(models, options) {
      var i, l, index, model, removed = false;
      for (var i = 0, j = 0; i < models.length; i++) {
        var model = models[i] = this.get(models[i]);
        if (!model) continue;
        var id = this.modelId(model.attributes);
        if (id != null) delete this._byId[id];
        delete this._byId[model.cid];
        var index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        models[j++] = model;
        this._removeReference(model, options);
        removed = true;
      }
      // We only need to slice if models array should be smaller, which is
      // caused by some models not actually getting removed.
      if (models.length !== j) models = models.slice(0, j);
      return removed;
    },

    // Method for checking whether an object should be considered a model for
    // the purposes of adding to the collection.
    _isModel: function (model) {
      return model instanceof Model;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      var id = this.modelId(model.attributes);
      if (id != null) this._byId[id] = model;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (event === 'change') {
        var prevId = this.modelId(model.previousAttributes());
        var id = this.modelId(model.attributes);
        if (prevId !== id) {
          if (prevId != null) delete this._byId[prevId];
          if (id != null) this._byId[id] = model;
        }
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var collectionMethods = { forEach: 3, each: 3, map: 3, collect: 3, reduce: 4,
      foldl: 4, inject: 4, reduceRight: 4, foldr: 4, find: 3, detect: 3, filter: 3,
      select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 2,
      contains: 2, invoke: 2, max: 3, min: 3, toArray: 1, size: 1, first: 3,
      head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
      without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
      isEmpty: 1, chain: 1, sample: 3, partition: 3 };

  // Mix in each Underscore method as a proxy to `Collection#models`.
  addUnderscoreMethods(Collection, collectionMethods, 'models');

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    if (!_[method]) return;
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this._removeElement();
      this.stopListening();
      return this;
    },

    // Remove this view's element from the document and all event listeners
    // attached to it. Exposed for subclasses using an alternative DOM
    // manipulation API.
    _removeElement: function() {
      this.$el.remove();
    },

    // Change the view's element (`this.el` property) and re-delegate the
    // view's events on the new element.
    setElement: function(element) {
      this.undelegateEvents();
      this._setElement(element);
      this.delegateEvents();
      return this;
    },

    // Creates the `this.el` and `this.$el` references for this view using the
    // given `el`. `el` can be a CSS selector or an HTML string, a jQuery
    // context or an element. Subclasses can override this to utilize an
    // alternative DOM manipulation API and are only required to set the
    // `this.el` property.
    _setElement: function(el) {
      this.$el = el instanceof Backbone.$ ? el : Backbone.$(el);
      this.el = this.$el[0];
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;
        var match = key.match(delegateEventSplitter);
        this.delegate(match[1], match[2], _.bind(method, this));
      }
      return this;
    },

    // Add a single event listener to the view's element (or a child element
    // using `selector`). This only works for delegate-able events: not `focus`,
    // `blur`, and not `change`, `submit`, and `reset` in Internet Explorer.
    delegate: function(eventName, selector, listener) {
      this.$el.on(eventName + '.delegateEvents' + this.cid, selector, listener);
    },

    // Clears all callbacks previously bound to the view by `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      if (this.$el) this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // A finer-grained `undelegateEvents` for removing a single delegated event.
    // `selector` and `listener` are both optional.
    undelegate: function(eventName, selector, listener) {
      this.$el.off(eventName + '.delegateEvents' + this.cid, selector, listener);
    },

    // Produces a DOM element to be assigned to your view. Exposed for
    // subclasses using an alternative DOM manipulation API.
    _createElement: function(tagName) {
      return document.createElement(tagName);
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        this.setElement(this._createElement(_.result(this, 'tagName')));
        this._setAttributes(attrs);
      } else {
        this.setElement(_.result(this, 'el'));
      }
    },

    // Set attributes from a hash on this view's element.  Exposed for
    // subclasses using an alternative DOM manipulation API.
    _setAttributes: function(attributes) {
      this.$el.attr(attributes);
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // Pass along `textStatus` and `errorThrown` from jQuery.
    var error = options.error;
    options.error = function(xhr, textStatus, errorThrown) {
      options.textStatus = textStatus;
      options.errorThrown = errorThrown;
      if (error) error.call(options.context, xhr, textStatus, errorThrown);
    };

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if (router.execute(callback, args, name) !== false) {
          router.trigger.apply(router, ['route:' + name].concat(args));
          router.trigger('route', name, args);
          Backbone.history.trigger('route', router, name, args);
        }
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args, name) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      var path = this.location.pathname.replace(/[^\/]$/, '$&/');
      return path === this.root && !this.getSearch();
    },

    // Does the pathname match the root?
    matchRoot: function() {
      var path = this.decodeFragment(this.location.pathname);
      var root = path.slice(0, this.root.length - 1) + '/';
      return root === this.root;
    },

    // Unicode characters in `location.pathname` are percent encoded so they're
    // decoded for comparison. `%25` should not be decoded since it may be part
    // of an encoded parameter.
    decodeFragment: function(fragment) {
      return decodeURI(fragment.replace(/%25/g, '%2525'));
    },

    // In IE6, the hash fragment and search params are incorrect if the
    // fragment contains `?`.
    getSearch: function() {
      var match = this.location.href.replace(/#.*/, '').match(/\?.+/);
      return match ? match[0] : '';
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the pathname and search params, without the root.
    getPath: function() {
      var path = this.decodeFragment(
        this.location.pathname + this.getSearch()
      ).slice(this.root.length - 1);
      return path.charAt(0) === '/' ? path.slice(1) : path;
    },

    // Get the cross-browser normalized URL fragment from the path or hash.
    getFragment: function(fragment) {
      if (fragment == null) {
        if (this._usePushState || !this._wantsHashChange) {
          fragment = this.getPath();
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error('Backbone.history has already been started');
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._hasHashChange   = 'onhashchange' in window;
      this._useHashChange   = this._wantsHashChange && this._hasHashChange;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.history && this.history.pushState);
      this._usePushState    = this._wantsPushState && this._hasPushState;
      this.fragment         = this.getFragment();

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          var root = this.root.slice(0, -1) || '/';
          this.location.replace(root + '#' + this.getPath());
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot()) {
          this.navigate(this.getHash(), {replace: true});
        }

      }

      // Proxy an iframe to handle location events if the browser doesn't
      // support the `hashchange` event, HTML5 history, or the user wants
      // `hashChange` but not `pushState`.
      if (!this._hasHashChange && this._wantsHashChange && !this._usePushState) {
        var iframe = document.createElement('iframe');
        iframe.src = 'javascript:0';
        iframe.style.display = 'none';
        iframe.tabIndex = -1;
        var body = document.body;
        // Using `appendChild` will throw on IE < 9 if the document is not ready.
        this.iframe = body.insertBefore(iframe, body.firstChild).contentWindow;
        this.iframe.document.open().close();
        this.iframe.location.hash = '#' + this.fragment;
      }

      // Add a cross-platform `addEventListener` shim for older browsers.
      var addEventListener = window.addEventListener || function (eventName, listener) {
        return attachEvent('on' + eventName, listener);
      };

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._usePushState) {
        addEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        addEventListener('hashchange', this.checkUrl, false);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      // Add a cross-platform `removeEventListener` shim for older browsers.
      var removeEventListener = window.removeEventListener || function (eventName, listener) {
        return detachEvent('on' + eventName, listener);
      };

      // Remove window listeners.
      if (this._usePushState) {
        removeEventListener('popstate', this.checkUrl, false);
      } else if (this._useHashChange && !this.iframe) {
        removeEventListener('hashchange', this.checkUrl, false);
      }

      // Clean up the iframe if necessary.
      if (this.iframe) {
        document.body.removeChild(this.iframe.frameElement);
        this.iframe = null;
      }

      // Some environments will throw when clearing an undefined interval.
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();

      // If the user pressed the back button, the iframe's hash will have
      // changed and we should use that for comparison.
      if (current === this.fragment && this.iframe) {
        current = this.getHash(this.iframe);
      }

      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      // If the root doesn't match, no routes can match either.
      if (!this.matchRoot()) return false;
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      // Normalize the fragment.
      fragment = this.getFragment(fragment || '');

      // Don't include a trailing slash on the root.
      var root = this.root;
      if (fragment === '' || fragment.charAt(0) === '?') {
        root = root.slice(0, -1) || '/';
      }
      var url = root + fragment;

      // Strip the hash and decode for matching.
      fragment = this.decodeFragment(fragment.replace(pathStripper, ''));

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._usePushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getHash(this.iframe))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if (!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent` constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error.call(options.context, model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;

}));
(function() {
  Backbone.Template = (function() {
    function Template(options) {
      this.$el = $(_.required(options, "el"));
    }

    Template.prototype.render = function() {
      return this;
    };

    Template.prototype.remove = function() {
      return this.$el.remove();
    };

    return Template;

  })();

}).call(this);
(function() {
  var BaseView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Backbone.View.Extension = {};

  BaseView = Backbone.View;

  View = (function(_super) {
    __extends(View, _super);

    function View(options) {
      var extension, key, klass, _ref;
      if (options == null) {
        options = {};
      }
      this.extensions = [];
      _ref = Backbone.View.Extension;
      for (key in _ref) {
        klass = _ref[key];
        if ((this[key.toLowerCase()] != null) || klass.prototype.force) {
          extension = new klass(this, options);
          this.extensions.push(extension);
        }
      }
      BaseView.call(this, options);
    }

    View.prototype._runExtensionCallbacks = function(key, callbackArguments) {
      var extension, _i, _len, _ref, _ref1, _results;
      _ref = this.extensions;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        extension = _ref[_i];
        _results.push((_ref1 = extension[key]) != null ? _ref1.apply(extension, callbackArguments) : void 0);
      }
      return _results;
    };

    return View;

  })(BaseView);

  _.each(['Initialize', 'Render', 'Remove'], function(key) {
    var afterMethod, beforeMethod, method;
    method = key.toLowerCase();
    beforeMethod = "before" + key;
    afterMethod = "after" + key;
    return View.prototype[method] = function() {
      var callbackArguments;
      callbackArguments = Array.prototype.slice.call(arguments);
      callbackArguments.unshift(this);
      if (this[beforeMethod] != null) {
        this[beforeMethod].apply(this, arguments);
      }
      this._runExtensionCallbacks(beforeMethod, callbackArguments);
      this._runExtensionCallbacks(method, callbackArguments);
      this._runExtensionCallbacks(afterMethod, callbackArguments);
      if (this[afterMethod] != null) {
        this[afterMethod].apply(this, arguments);
      }
      return BaseView.prototype[method].apply(this, arguments);
    };
  });

  Backbone.View = View;

}).call(this);
(function() {
  var Binder, Model2ViewBinder, View2ModelBinder,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Binder = (function() {
    function Binder(model, $el, options) {
      this.model = arguments[0], this.$el = arguments[1];
      this.options = _.defaults(options, this.defaults);
      this.selector = _.required(options, 'selector');
      this.attribute = _.required(options, 'attribute');
    }

    return Binder;

  })();

  View2ModelBinder = (function(_super) {
    __extends(View2ModelBinder, _super);

    View2ModelBinder.prototype.defaults = {
      event: "change",
      accessor: "val",
      reverse: true,
      onSet: function($el, model, attr, event) {
        var accessor, value;
        accessor = this.options.accessor;
        if (_.isString(accessor)) {
          accessor = $el[accessor];
        }
        value = accessor.call($el);
        return model.set(attr, value);
      }
    };

    function View2ModelBinder() {
      View2ModelBinder.__super__.constructor.apply(this, arguments);
      if (this.options.reverse) {
        this.reverse = new Model2ViewBinder(this.model, this.$el, this.options);
      }
    }

    View2ModelBinder.prototype.on = function() {
      if (this.handler != null) {
        this.off();
      }
      this.handler = (function(_this) {
        return function(event) {
          var $selector;
          if (_this.reverse) {
            _this.reverse._pending = true;
          }
          $selector = _this.$el.find(_this.selector);
          return _this.options.onSet.call(_this, $selector, _this.model, _this.attribute, event);
        };
      })(this);
      this.$el.on(this.options.event, this.selector, this.handler);
      if (this.reverse) {
        return this.reverse.on();
      }
    };

    View2ModelBinder.prototype.off = function() {
      this.$el.off(this.options.event, this.selector, this.handler);
      if (this.reverse) {
        return this.reverse.off();
      }
    };

    return View2ModelBinder;

  })(Binder);

  Model2ViewBinder = (function(_super) {
    __extends(Model2ViewBinder, _super);

    function Model2ViewBinder() {
      return Model2ViewBinder.__super__.constructor.apply(this, arguments);
    }

    Model2ViewBinder.prototype.defaults = {
      accessor: "text",
      onGet: function($el, model, attr, value) {
        var accessor;
        accessor = this.options.accessor;
        if (_.isString(accessor)) {
          accessor = $el[accessor];
        }
        return accessor.call($el, value);
      }
    };

    Model2ViewBinder.prototype.on = function() {
      if (this.handler != null) {
        this.off();
      }
      this.handler = (function(_this) {
        return function(model, value) {
          var $selector;
          if (_this._pending) {
            return _this._pending = false;
          }
          $selector = _this.$el.find(_this.selector);
          return _this.options.onGet.call(_this, $selector, model, _this.attribute, value);
        };
      })(this);
      return this.model.on("change:" + this.attribute, this.handler);
    };

    Model2ViewBinder.prototype.off = function() {
      return this.model.off("change:" + this.attribute, this.handler);
    };

    return Model2ViewBinder;

  })(Binder);

  Backbone.View.Extension.Bindings = (function() {
    function Bindings() {}

    Bindings.prototype.initialize = function(view, options) {
      var $selector, binder, binding, key, model, tag, _ref, _results;
      if (view.model) {
        model = view.model;
        if (_.isFunction(model)) {
          model = model(options);
        }
      } else {
        model = _.required(options, "model");
      }
      view.binders = {};
      _ref = view.bindings;
      _results = [];
      for (key in _ref) {
        binding = _ref[key];
        if (_.isString(binding)) {
          binding = {
            attribute: binding
          };
        }
        if (binding.selector == null) {
          binding.selector = key;
        }
        $selector = view.$(binding.selector);
        tag = $selector.attr("tagName").toLowerCase();
        if (/input|textarea/.test(tag) || (binding.event != null)) {
          binder = new View2ModelBinder(model, view.$el, binding);
        } else {
          binder = new Model2ViewBinder(model, view.$el, binding);
        }
        binder.on();
        _results.push(view.binders[key] = binder);
      }
      return _results;
    };

    Bindings.prototype.remove = function(view) {
      var binder, _i, _len, _ref, _results;
      _ref = view.binders;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        binder = _ref[_i];
        _results.push(binder.off());
      }
      return _results;
    };

    return Bindings;

  })();

}).call(this);
(function() {
  var key;

  key = function(view) {
    return "" + view.cid + "(" + view.constructor.name + ")";
  };

  Backbone.View.Extension.Debug = (function() {
    function Debug() {}

    Debug.prototype.force = true;

    Debug.prototype.beforeInitialize = function(view) {
      _.debug("Create new Backbone.View: " + (key(view)));
      return _.time("Create " + (key(view)));
    };

    Debug.prototype.afterRender = function(view) {
      _.debug("Render Backbone.View: " + (key(view)));
      return _.timeEnd("Create " + (key(view)));
    };

    Debug.prototype.beforeRemove = function(view) {
      return _.debug("Remove Backbone.View: " + (key(view)));
    };

    return Debug;

  })();

}).call(this);
(function() {
  Backbone.View.Extension.Layout = (function() {
    function Layout() {}

    Layout.prototype.initialize = function(view, options) {
      return _.extend(view.layout, options.layout);
    };

    Layout.prototype.render = function(view) {
      var $selector, key, options, selector, template, templateOptions, _ref, _results;
      if (view.views != null) {
        this.remove(view);
      }
      view.views = {};
      _ref = view.layout;
      _results = [];
      for (key in _ref) {
        options = _ref[key];
        if (_.isString(options) || _.isFunction(options)) {
          selector = key;
          template = options;
        } else {
          selector = _.required(options, "selector");
          template = _.required(options, "template");
        }
        $selector = view.$(selector);
        if (_.isFunction(template)) {
          templateOptions = {
            el: $selector,
            parent: view
          };
          _.defaults(templateOptions, options.options);
          if (template.name !== "") {
            template = new template(templateOptions).render();
          } else {
            template = template(templateOptions);
            template = new Backbone.Template({
              el: template
            });
          }
        } else {
          template = new Backbone.Template({
            el: template
          });
        }
        _results.push(view.views[key] = template);
      }
      return _results;
    };

    Layout.prototype.remove = function(view) {
      var selector, template, _ref, _results;
      _ref = view.views;
      _results = [];
      for (selector in _ref) {
        template = _ref[selector];
        _results.push(template.remove());
      }
      return _results;
    };

    return Layout;

  })();

}).call(this);
(function() {
  Backbone.View.Extension.Params = (function() {
    function Params() {}

    Params.prototype.initialize = function(view, options) {
      var param, value, _i, _len, _ref, _ref1, _results;
      _ref = view.params.required;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        view[param] = _.required(options, param);
      }
      _ref1 = view.params.optional;
      _results = [];
      for (param in _ref1) {
        value = _ref1[param];
        _results.push(view[param] = options[param] || value);
      }
      return _results;
    };

    return Params;

  })();

}).call(this);
(function() {
  var Collection2ViewBinder;

  Collection2ViewBinder = (function() {
    Collection2ViewBinder.prototype.defaults = {
      onAdd: function(model, collection, options) {
        var template, templateOptions;
        template = this.template;
        if (_.isFunction(template)) {
          templateOptions = {
            model: model,
            collection: collection,
            parent: this.view
          };
          if (template.name !== "") {
            template = new template(templateOptions).render();
          } else {
            template = template(templateOptions);
            template = new Backbone.Template({
              el: template
            });
          }
        } else {
          template = new Backbone.Template({
            el: template
          });
        }
        template.$el.appendTo(this.$selector);
        return this.views[model.cid] = template;
      },
      onSort: function(collection, options) {
        var model, template, _i, _len, _ref, _results;
        _ref = collection.models;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          model = _ref[_i];
          template = this.views[model.cid];
          _results.push(template.$el.appendTo(this.$selector));
        }
        return _results;
      },
      onReset: function(collection, options) {
        var cid, model, template, _i, _len, _ref, _ref1, _results;
        _ref = this.views;
        for (cid in _ref) {
          template = _ref[cid];
          this.remove({
            cid: cid
          });
        }
        _ref1 = collection.models;
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          model = _ref1[_i];
          _results.push(this.add(model, collection));
        }
        return _results;
      },
      onRemove: function(model, options) {
        this.views[model.cid].remove();
        return delete this.views[model.cid];
      },
      onFilter: function(collection, attributes) {
        var eachTemplate;
        eachTemplate = (function(_this) {
          return function(models, callback) {
            var model, template, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = models.length; _i < _len; _i++) {
              model = models[_i];
              template = _this.views[model.cid];
              _results.push(callback(template.$el));
            }
            return _results;
          };
        })(this);
        if (attributes != null) {
          eachTemplate(collection.models, function(template) {
            return template.hide();
          });
          return eachTemplate(collection.where(attributes), function(template) {
            return template.show();
          });
        } else {
          return eachTemplate(collection.models, function(template) {
            return template.show();
          });
        }
      },
      infinite: {
        prefix: false,
        suffix: false,
        slice: 10,
        onReset: function(collection, options) {
          var cid, template, _ref;
          _ref = this.views;
          for (cid in _ref) {
            template = _ref[cid];
            (template.$el || template).hide();
          }
          this.$container.scrollTop(0);
          this.infinite.length = 0;
          this.infinite.models = this.infinite.attributes != null ? collection.where(this.infinite.attributes) : collection.models;
          return this.show(this.options.slice);
        },
        onFilter: function(collection, attributes) {
          this.infinite.attributes = attributes;
          return this.reset();
        },
        onSort: function(collection, options) {
          return this.reset();
        },
        onScroll: function() {
          var getHeight, _base;
          if (this.onScrollWorking) {
            return;
          }
          this.onScrollWorking = true;
          getHeight = (function(_this) {
            return function() {
              var height;
              height = _this.$container.attr("scrollHeight");
              height -= _this.$container.attr("scrollTop");
              height -= _this.$container.height();
              if (_this.$suffix != null) {
                height -= _this.$suffix.height();
              }
              return height;
            };
          })(this);
          (_base = this.infinite).height || (_base.height = this.$selector.height() / this.infinite.length);
          while (getHeight() < this.infinite.height * this.options.slice && this.infinite.length < this.infinite.models.length) {
            this.show(this.infinite.length + this.options.slice);
          }
          return this.onScrollWorking = false;
        },
        onShow: function(length) {
          var height, model, models, template, _i, _len;
          models = this.infinite.models.slice(this.infinite.length, length);
          this.infinite.length = length;
          for (_i = 0, _len = models.length; _i < _len; _i++) {
            model = models[_i];
            template = this.views[model.cid];
            if (template != null) {
              template.$el.appendTo(this.$selector);
              (template.$el || template).show();
            } else {
              this.add(model);
            }
          }
          if (this.$suffix != null) {
            height = (this.infinite.models.length - this.infinite.length) * this.infinite.height;
            height = height > 0 ? height : 0;
            return this.$suffix.height(height);
          }
        }
      }
    };

    function Collection2ViewBinder(collection, $el, options) {
      this.collection = arguments[0], this.$el = arguments[1];
      this.infinite = options.infinite;
      this.options = _.defaults(options, this.defaults);
      this.template = _.required(this.options, "template");
      this.$selector = this.$el.find(_.required(this.options, 'selector'));
      this.views = {};
      if (this.infinite != null) {
        this.options = _.extend(this.options, this.defaults.infinite, this.infinite);
      }
    }

    Collection2ViewBinder.prototype.on = function() {
      var event, handler, key, method, _i, _len, _ref;
      if (this.handlers != null) {
        this.off();
      }
      this.handlers = {};
      _ref = ['Add', 'Sort', 'Reset', 'Remove'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        event = key.toLowerCase();
        method = "on" + key;
        handler = this.options[method].bind(this);
        this.handlers[event] = handler;
        this.collection.on(event, handler);
      }
      this.handlers['filter'] = this.options['onFilter'].bind(this);
      if (this.infinite) {
        this.show = this.options["onShow"].bind(this);
        this.$container = this.$selector.closest(this.infinite.container);
        if (this.options.suffix) {
          this.$suffix = $("<div class=\"infinite-suffix\"></div>").appendTo(this.$container);
        }
        handler = this.options["onScroll"].bind(this);
        this.handlers['scroll'] = handler;
        return this.$container.on('scroll', handler);
      }
    };

    Collection2ViewBinder.prototype.off = function() {
      var event, handler, _ref, _results;
      _ref = this.handlers;
      _results = [];
      for (event in _ref) {
        handler = _ref[event];
        _results.push(this.collection.off(event, handler));
      }
      return _results;
    };

    Collection2ViewBinder.prototype.add = function(model) {
      return this.handlers["add"](model, this.collection);
    };

    Collection2ViewBinder.prototype.remove = function(model) {
      return this.handlers["remove"](model);
    };

    Collection2ViewBinder.prototype.reset = function(collection) {
      if (collection == null) {
        collection = this.collection;
      }
      return this.handlers["reset"](collection);
    };

    Collection2ViewBinder.prototype.filter = function(attributes) {
      if (_.isEmpty(attributes) && !_.isFunction(attributes)) {
        attributes = void 0;
      }
      return this.handlers["filter"](this.collection, attributes);
    };

    Collection2ViewBinder.prototype.sort = function(comparator) {
      this.collection.comparator = comparator;
      return this.collection.sort();
    };

    return Collection2ViewBinder;

  })();

  Backbone.View.Extension.Store = (function() {
    function Store() {}

    Store.prototype.initialize = function(view, options) {
      var collection;
      if (view.collection) {
        collection = view.collection;
        if (_.isFunction(collection)) {
          collection = collection(options);
        }
      } else {
        collection = _.required(options, "collection");
      }
      view.binder = new Collection2ViewBinder(collection, view.$el, view.store);
      return view.binder.on();
    };

    Store.prototype.render = function(view) {
      return view.binder.reset();
    };

    Store.prototype.remove = function(view) {
      return view.binder.off();
    };

    return Store;

  })();

}).call(this);
(function() {
  Backbone.View.Extension.Template = (function() {
    Template.prototype.force = true;

    function Template(view, options) {
      var $template, template;
      template = options.template || view.template;
      if (template != null) {
        if (_.isFunction(template)) {
          template = template(options);
        }
        $template = $(template);
        if (options.el) {
          $(options.el).html($template);
        } else {
          options.el = $template;
        }
      }
    }

    return Template;

  })();

}).call(this);


// Return models with matching attributes. Useful for simple cases of
// `filter`.
Backbone.Collection.prototype.where = function(attrs, first) {
  if (_.isEmpty(attrs)) return first ? void 0 : [];
  return this[first ? 'find' : 'filter'](function(model) {
    for (var key in attrs) {
      var filter = attrs[key],
        attr = model.get(key);
      if (_.isFunction(filter) && filter(attr)) continue;
      if (_.isArray(filter) && filter.indexOf(attr) >= 0) continue;
      if (filter === attr) continue;
      return false;
    }
    return true;
  });
};
(function() {
  window.Ratchet = {};

  window.App = {
    Bindings: {},
    Utils: {},
    Widgets: {},
    Views: {},
    Pages: {},
    Collections: {},
    Models: {},
    initialize: function() {
      _.setDebugLevel(2);
      this.main = new App.Views.Main({
        el: $('body')
      });
      this.main.render();
      this.router = new App.Router();
      return Backbone.history.start();
    }
  };

  $(function() {
    if (typeof AV !== "undefined" && AV !== null) {
      AV.initialize("ixeo5jke9wy1vvvl3lr06uqy528y1qtsmmgsiknxdbt2xalg", "hwud6pxjjr8s46s9vuix0o8mk0b5l8isvofomjwb5prqyyjg");
    }
    return App.initialize();
  });

}).call(this);
(function() {
  App.KeyMap = {
    title: "称号",
    name: "姓名",
    rare: "稀有度",
    country: "国家",
    gender: "性别",
    server: "服务器",
    age: "年龄",
    career: "职业",
    interest: "兴趣",
    nature: "性格",
    element: "元素",
    weapon: "武器类型",
    arms: "武器",
    type: "成长",
    skin: "皮肤",
    sarea: "溅射距离",
    parts: "部位",
    life: "初始生命",
    atk: "初始攻击",
    aarea: "攻距",
    anum: "攻数",
    aspd: "攻速",
    tenacity: "韧性",
    mspd: "移速",
    fire: "火",
    aqua: "水",
    wind: "风",
    light: "光",
    dark: "暗",
    story: "同伴故事",
    skill: "技能",
    sklcd: "技能CD",
    sklsp: "技能消耗",
  sklmax: "极限值",
    obtain: "获取方式",
    remark: "备注",
    hits: "多段攻击"
  };

}).call(this);
(function() {
  App.Bindings.Toggle = (function() {
    Toggle.prototype.event = "click";

    function Toggle(selector) {
      this.selector = selector;
    }

    Toggle.prototype.onSet = function($el, model, attr) {
      $el.toggleClass("active");
      return model.set(attr, $el.hasClass("active"));
    };

    return Toggle;

  })();

}).call(this);
(function() {
  App.Utils.SVG = {
    getPolygonPointsString: function(ps) {
      return _.map(ps, function(p) {
        return "" + p.x + "," + p.y;
      }).join(" ");
    },
    getBackgroundPolygonPointsString: function(l, r) {
      var c, ps;
      if (this.bgs && (this.bgs[r] != null)) {
        return this.bgs[r];
      }
      c = {
        x: l / 2,
        y: l / 2
      };
      ps = _.map([0, 1, 2, 3, 4], function(i) {
        var a;
        a = (i * 72 - 90) * (Math.PI * 2) / 360;
        return {
          x: c.x + Math.cos(a) * r,
          y: c.y + Math.sin(a) * r
        };
      });
      if (!this.bgs) {
        this.bgs = {};
      }
      return this.bgs[r] = App.Utils.SVG.getPolygonPointsString(ps);
    }
  };

}).call(this);
;(function($){
  $.fn.scrollToTop = function(){
    var $this = $(this),
      initialY = $this.scrollTop(),
      start = +new Date,
      speed = Math.min(750, Math.min(1500, initialY)),
      now,
      t, y

    if (initialY == 0) return

    function smooth(pos){
      if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5)
      return 0.5 * (Math.pow((pos-2),5) + 2)
    }

    requestAnimationFrame(function frame(){
      now = +new Date
      t = Math.min(1, Math.max((now - start)/speed, 0))
      y = initialY - initialY * smooth(t)
      if (y<0) y = 0
      $this.scrollTop(y)
      if (y>0) requestAnimationFrame(frame)
    })
  }
})($)
;
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Unit = (function(_super) {
    __extends(Unit, _super);

    function Unit() {
      return Unit.__super__.constructor.apply(this, arguments);
    }

    Unit.prototype.klass = "Unit";

    Unit.prototype.initialize = function(attributes, options) {
      this.origin = {
        atk: attributes.atk,
        life: attributes.life
      };
      this.setLevelMode("zero");
      this.origin.dps = this.get("dps");
      return this.origin.mdps = this.get("mdps");
    };

    Unit.prototype.calcF = function() {
      return this.f || (this.f = 1.8 + 0.1 * this.get("type"));
    };

    Unit.prototype.calcMaxLv = function(key) {
      var value;
      value = this.origin[key];
      return Math.floor(value * this.calcF());
    };

    Unit.prototype.calcMaxLvAndGrow = function(key) {
      var f, growPart, levelPart, rare, value;
      f = this.calcF();
      rare = this.get("rare");
      value = this.origin[key];
      levelPart = Math.floor(value * f);
      growPart = Math.floor(value * (f - 1) / (19 + 10 * rare)) * 5 * (rare === 1 ? 5 : 15);
      return levelPart + growPart;
    };

    Unit.prototype.calcMaxLvAndGrowDPS = function() {
      return this.calcMaxLvAndGrow("atk") / this.get("aspd");
    };

    Unit.prototype.calcMaxLvAndGrowMDPS = function() {
      return this.calcMaxLvAndGrowDPS() * this.get("anum");
    };

    Unit.prototype.setLevelMode = function(mode) {
      var atk, dps, life, mdps;
      switch (mode) {
        case "zero":
          atk = this.origin.atk;
          life = this.origin.life;
          break;
        case "mxlv":
          atk = this.calcMaxLv("atk");
          life = this.calcMaxLv("life");
          break;
        case "mxlvgr":
          atk = this.calcMaxLvAndGrow("atk");
          life = this.calcMaxLvAndGrow("life");
      }
      dps = atk / this.get("aspd");
      mdps = Math.round(dps * this.get("anum"));
      dps = Math.round(dps);
      this.set("atk", atk);
      this.set("life", life);
      this.set("dps", dps);
      return this.set("mdps", mdps);
    };

    Unit.prototype.imageUrl = function(type) {
      return "../data/units/" + type + "/" + this.id + ".png";
    };

    Unit.prototype.iconUrl = function() {
      return this.imageUrl("icon");
    };

    Unit.prototype.thumbnailUrl = function() {
      return this.imageUrl("thumbnail");
    };

    Unit.prototype.originalUrl = function() {
      return this.imageUrl("original");
    };

    Unit.prototype.getTitleString = function() {
      return "" + (this.get("title")) + " " + (this.get("name"));
    };

    Unit.prototype.getIndexString = function(strs, key) {
      return strs[this.get(key) - 1] || "暂缺";
    };

    Unit.prototype.getRareString = function() {
      return this.getIndexString(["★", "★★", "★★★", "★★★★", "★★★★★"], "rare");
    };

    Unit.prototype.getElementKey = function() {
      return this.getIndexString(["fire", "aqua", "wind", "light", "dark"], "element");
    };

    Unit.prototype.getElementString = function() {
      return this.getIndexString(["火", "水", "风", "光", "暗"], "element");
    };

    Unit.prototype.getWeaponString = function() {
      return this.getIndexString(["斩击", "突击", "打击", "弓箭", "魔法", "铳弹", "回复"], "weapon");
    };

    Unit.prototype.getTypeString = function() {
      return this.getIndexString(["早熟", "平均", "晚成"], "type");
    };

    Unit.prototype.getGenderString = function() {
      return this.getIndexString(["不明", "男", "女"], "gender");
    };

    Unit.prototype.getElementPercentString = function(element) {
      var value;
      value = this.get(element);
      if (_.isNumber(value)) {
        return "" + (Math.round(value * 100)) + "%";
      } else {
        return "暂缺";
      }
    };

    Unit.prototype.getAgeString = function() {
      var value;
      value = this.get("age");
      if (_.isNumber(value)) {
        return "" + value + "岁";
      } else {
        return "暂缺";
      }
    };

    Unit.prototype.getString = function(key) {
      return this.get(key) || "暂缺";
    };

    Unit.prototype.getFormatString = function(key) {
      return this.getString(key).replace(/ID(\d+)(\[[^\]]+\]\S+)?/g, function(text, id) {
        return "<a href=\"#units/" + id + "\">" + text + "</a>";
      });
    };

    Unit.prototype.getElementPolygonPointsString = function(l, r) {
      var c, es, ps;
      es = [this.get("fire"), this.get("aqua"), this.get("wind"), this.get("light"), this.get("dark")];
      c = {
        x: l / 2,
        y: l / 2
      };
      ps = _.map([0, 1, 2, 3, 4], function(i) {
        var a;
        a = (i * 72 - 90) * (Math.PI * 2) / 360;
        return {
          x: c.x + Math.cos(a) * r * es[i],
          y: c.y + Math.sin(a) * r * es[i]
        };
      });
      return App.Utils.SVG.getPolygonPointsString(ps);
    };

    return Unit;

  })(Backbone.Model);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Models.Monster = (function(_super) {
    __extends(Monster, _super);

    function Monster() {
      return Monster.__super__.constructor.apply(this, arguments);
    }

    Monster.prototype.klass = "Monster";

    Monster.prototype.initialize = function(attributes, options) {
      this.origin = {
        atk: attributes.atk,
        life: attributes.life
      };
      this.setLevelMode("sm");
      this.origin.dps = this.get('dps');
      this.origin.mdps = this.get('mdps');
      return this.set("skill-sc", this.getSkillShortString());
    };

    Monster.prototype.calcBySize = function(value, size, mode) {
      switch (mode) {
        case 1:
          return Math.floor(value * Math.pow(size, 2.36));
        case 2:
          return Math.floor(value * size);
        default:
          return value;
      }
    };

    Monster.prototype.setLevelMode = function(mode) {
      var atk, dps, life, mdps;
      switch (mode) {
        case "sm":
          atk = this.origin.atk;
          life = this.origin.life;
          break;
        case "md":
          atk = this.calcBySize(this.origin.atk, 1.35, 1);
          life = this.calcBySize(this.origin.life, 1.35, 2);
          break;
        case "lg":
          atk = this.calcBySize(this.origin.atk, 1.55, 1);
          life = this.calcBySize(this.origin.life, 1.55, 2);
          break;
        case "xl":
          atk = this.calcBySize(this.origin.atk, 1.7, 1);
          life = this.calcBySize(this.origin.life, 1.7, 2);
          break;
        case "xxl":
          atk = this.calcBySize(this.origin.atk, 1.8, 1);
          life = this.calcBySize(this.origin.life, 1.8, 2);
      }
      dps = atk / this.get("aspd");
      mdps = Math.round(dps * this.get("anum"));
      dps = Math.round(dps);
      this.set("atk", atk);
      this.set("life", life);
      this.set("dps", dps);
      return this.set("mdps", mdps);
    };

    Monster.prototype.imageUrl = function(type) {
      return "../data/monsters/" + type + "/" + this.id + ".png";
    };

    Monster.prototype.getTitleString = function() {
      return this.get("name");
    };

    Monster.prototype.getSkinString = function() {
      return this.getIndexString(["坚硬", "常规", "柔软", "极软", "极硬"], "skin");
    };
  
  Monster.prototype.getSklmaxString = function() {
      var value;
      value = this.get("sklmax");
      if (_.isNumber(value)) {
        return "" + (Math.round(value * 10) / 10) + "%";
      } else {
        return "暂缺";
      }
    };

    Monster.prototype.getSkillShortString = function() {
      return this.get("skill").split("：")[0].split(/\s/g)[0];
    };

    return Monster;

  })(App.Models.Unit);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Collections.Units = (function(_super) {
    __extends(Units, _super);

    function Units() {
      return Units.__super__.constructor.apply(this, arguments);
    }

    Units.prototype.url = "../data/units.json";

    Units.prototype.model = App.Models.Unit;

    Units.prototype.initialize = function() {
      return this.comparator = function(model) {
        return -model.get("rare");
      };
    };

    return Units;

  })(Backbone.Collection);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Collections.Monsters = (function(_super) {
    __extends(Monsters, _super);

    function Monsters() {
      return Monsters.__super__.constructor.apply(this, arguments);
    }

    Monsters.prototype.url = "../data/monsters.json";

    Monsters.prototype.model = App.Models.Monster;

    return Monsters;

  })(App.Collections.Units);

}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/main"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push(_.renderTemplate("templates/mobile/mirror_info"));
      
        __out.push('\n\n<view class="main">\n  ');
      
        __out.push(_.renderTemplate("templates/mobile/sidebar"));
      
        __out.push('\n\n  <container class="content container"></container>\n</view>\n\n<modal class="modal"></modal>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/mirror_info"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        if (!(location.href.indexOf("oschina") >= 0 || location.href.indexOf("merusuto") >= 0 || (typeof localStorage !== "undefined" && localStorage !== null ? localStorage["mirror-info-disabled"] : void 0))) {
          __out.push('\n  <div class="alert alert-dismissible fade in" id="mirror-alert">\n    <button type="button" class="close" data-dismiss="alert" id="mirror-dismiss-button"><span>×</span></button>\n    <h4>梅露可图鉴 国内镜像</h4>\n    <p>为保证服务质量，梅露可图鉴在国内服务器上部属了一份镜像网站，国内用户访问更快更稳定，避免网站偶尔由于不可抗力访问不到！</p>\n    <p>\n      <a href="http://rhym997.oschina.io/merusuto/mobile/" class="btn btn-primary">访问国内镜像</a>\n      <button type="button" class="btn" id="mirror-disable-button">不再显示这条消息</button>\n    </p>\n  </div>\n\n  <script type="text/javascript">\n    $("#mirror-disable-button").click(function() {\n      $("#mirror-alert").hide();\n      if (_.isObject(localStorage)) {\n        localStorage["mirror-info-disabled"] = true\n      }\n    })\n    $("#mirror-dismiss-button").click(function() {\n      $("#mirror-alert").hide();\n    })\n  </script>\n');
        }
      
        __out.push('\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/modals/disqus"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push('<div id="disqus_thread"></div>\n<script type="text/javascript">\n  /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */\n  var disqus_shortname = \'merusuto\';\n  var disqus_identifier = \'');
      
        __out.push(__sanitize(this.model.klass));
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('\';\n  var disqus_title = \'');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\';\n  var disqus_url = \'');
      
        __out.push(__sanitize(window.location.href.replace("#", "#!")));
      
        __out.push('/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('\';\n  var disqus_config = function () {\n    this.language = "zh";\n  };\n\n  if (typeof DISQUS === "undefined") {\n    /* * * DON\'T EDIT BELOW THIS LINE * * */\n    (function() {\n      var dsq = document.createElement(\'script\');\n      dsq.type = \'text/javascript\'; dsq.async = true;\n      dsq.src = \'http://\' + disqus_shortname + \'.disqus.com/embed.js\';\n      (document.getElementsByTagName(\'head\')[0] || document.getElementsByTagName(\'body\')[0]).appendChild(dsq);\n    })();\n  } else {\n    DISQUS.reset({\n      reload: true,\n      config: function () {\n        this.page.identifier = disqus_identifier;\n        this.page.title = disqus_title;\n        this.page.url = disqus_url;\n        this.language = "zh";\n      }\n    });\n  }\n</script>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/modals/header"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push('<a class="icon icon-close pull-right" sref="#close-modal"></a>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/modals/monsters/show"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push(_.renderTemplate("templates/mobile/modals/header"));
      
        __out.push('\n<div class="content">\n  <div class="slider">\n    <div class="slide-group">\n      <div class="slide">\n        <img class="image" src="');
      
        __out.push(__sanitize(this.model.originalUrl()));
      
        __out.push('">\n      </div>\n      <div class="slide media">\n        <div class="media-body">\n          <h4 class="media-title media-info-group">\n            ');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\n            <small>');
      
        __out.push(__sanitize(this.model.getRareString()));
      
        __out.push('</small>\n            <br>\n            <small>ID: ');
      
        __out.push(__sanitize(this.model.get("id")));
      
        __out.push('</small>\n          </h4>\n          <div class="media-info-group">\n            <p class="media-info">\n              攻距：');
      
        __out.push(__sanitize(this.model.getString("aarea")));
      
        __out.push('<br>\n              韧性：');
      
        __out.push(__sanitize(this.model.getString("tenacity")));
      
        __out.push('<br>\n              移速：');
      
        __out.push(__sanitize(this.model.getString("mspd")));
      
        __out.push('<br>\n              溅射距离：');
      
        __out.push(__sanitize(this.model.getString("sarea")));
      
        __out.push('<br>\n            </p>\n            <p class="media-info">\n              攻数：');
      
        __out.push(__sanitize(this.model.getString("anum")));
      
        __out.push('<br>\n              多段：');
      
        __out.push(__sanitize(this.model.getString("hits")));
      
        __out.push('<br>\n              皮肤：');
      
        __out.push(__sanitize(this.model.getSkinString()));
      
        __out.push('<br>\n              攻速：');
      
        __out.push(__sanitize(this.model.getString("aspd")));
      
        __out.push('<br>\n            </p>\n          </div>\n                   <div class="media-info-title">技能</div>\n          <p class="media-info">\n            ');
      
        __out.push(__sanitize(this.model.getString("skill")));
      
        __out.push('<br><br>\n            技能消耗：');
      
        __out.push(__sanitize(this.model.getString("sklsp")));
      
        __out.push('<br>\n            技能CD：');
      
        __out.push(__sanitize(this.model.getString("sklcd")));
      
        __out.push('<br>\n          </p>\n          <div class="media-info-title">获取方式</div>\n          <p class="media-info">\n            ');
      
        __out.push(__sanitize(this.model.getString('obtain')));
      
        __out.push('\n          </p>\n\n          ');
      
        if (this.model.get('remark')) {
          __out.push('\n            <div class="media-info-title">简介</div>\n            <p class="media-info">\n              ');
          __out.push(__sanitize(this.model.get("remark")));
          __out.push('\n            </p>\n          ');
        }
      
        __out.push('\n\n          ');
      
        if (this.model.get('contributors')) {
          __out.push('\n            <div class="media-info-title">数据提供者</div>\n            <p class="media-info">\n              ');
          __out.push(__sanitize(this.model.get('contributors').join("、")));
          __out.push('\n            </p>\n          ');
        }
      
        __out.push('\n\n          <a class="media-info" href="../desktop/#monsters/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('/edit">数据有误？点击这里</a>\n        </div>\n      </div>\n    </div>\n    <div class="slide-handler">\n      <span class="icon icon-right-nav slide-next"></span>\n      <span class="icon icon-left-nav slide-prev"></span>\n    </div>\n  </div>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/modals/units/show"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push(_.renderTemplate("templates/mobile/modals/header"));
      
        __out.push('\n<div class="content">\n  <div class="slider">\n    <div class="slide-group">\n      <div class="slide">\n        <img class="image" src="');
      
        __out.push(__sanitize(this.model.originalUrl()));
      
        __out.push('">\n      </div>\n      <div class="slide media">\n        <div class="media-body">\n          <h4 class="media-title media-info-group">\n            ');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\n            <small>');
      
        __out.push(__sanitize(this.model.getRareString()));
      
        __out.push('</small>\n            <br>\n            <small>ID: ');
      
        __out.push(__sanitize(this.model.getString("id")));
      
        __out.push('</small>\n          </h4>\n          <div class="media-info-group">\n            <p class="media-info">\n              初始生命：');
      
        __out.push(__sanitize(this.model.origin.life));
      
        __out.push('<br>\n              满级生命：');
      
        __out.push(__sanitize(this.model.calcMaxLv('life')));
      
        __out.push('<br>\n              满觉生命：');
      
        __out.push(__sanitize(this.model.calcMaxLvAndGrow('life')));
      
        __out.push('<br>\n              初始攻击：');
      
        __out.push(__sanitize(this.model.origin.atk));
      
        __out.push('<br>\n              满级攻击：');
      
        __out.push(__sanitize(this.model.calcMaxLv('atk')));
      
        __out.push('<br>\n              满觉攻击：');
      
        __out.push(__sanitize(this.model.calcMaxLvAndGrow('atk')));
      
        __out.push('<br>\n            </p>\n            <p class="media-info">\n              攻距：');
      
        __out.push(__sanitize(this.model.getString("aarea")));
      
        __out.push('<br>\n              攻数：');
      
        __out.push(__sanitize(this.model.getString("anum")));
      
        __out.push('<br>\n              攻速：');
      
        __out.push(__sanitize(this.model.getString("aspd")));
      
        __out.push('<br>\n              韧性：');
      
        __out.push(__sanitize(this.model.getString("tenacity")));
      
        __out.push('<br>\n              移速：');
      
        __out.push(__sanitize(this.model.getString("mspd")));
      
        __out.push('<br>\n              多段：');
      
        __out.push(__sanitize(this.model.getString("hits")));
      
        __out.push('<br>\n            </p>\n          </div>\n          <div class="media-info-group">\n            <p class="media-info">\n              初始DPS：');
      
        __out.push(__sanitize(Math.round(this.model.origin.dps)));
      
        __out.push('<br>\n              满级DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLv('dps'))));
      
        __out.push('<br>\n              满觉DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLvAndGrowDPS())));
      
        __out.push('<br>\n              初始总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.origin.mdps)));
      
        __out.push('<br>\n              满级总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLv('mdps'))));
      
        __out.push('<br>\n              满觉总DPS：');
      
        __out.push(__sanitize(Math.round(this.model.calcMaxLvAndGrowMDPS())));
      
        __out.push('<br>\n            </p>\n            <p class="media-info">\n              成长：');
      
        __out.push(__sanitize(this.model.getTypeString()));
      
        __out.push('<br>\n              火：');
      
        __out.push(__sanitize(this.model.getElementPercentString("fire")));
      
        __out.push('<br>\n              水：');
      
        __out.push(__sanitize(this.model.getElementPercentString("aqua")));
      
        __out.push('<br>\n              风：');
      
        __out.push(__sanitize(this.model.getElementPercentString("wind")));
      
        __out.push('<br>\n              光：');
      
        __out.push(__sanitize(this.model.getElementPercentString("light")));
      
        __out.push('<br>\n              暗：');
      
        __out.push(__sanitize(this.model.getElementPercentString("dark")));
      
        __out.push('<br>\n            </p>\n          </div>\n          <div class="media-info-group">\n            <p class="media-info">\n              国家：');
      
        __out.push(__sanitize(this.model.getString('country')));
      
        __out.push('<br>\n              性别：');
      
        __out.push(__sanitize(this.model.getGenderString()));
      
        __out.push('<br>\n              年龄：');
      
        __out.push(__sanitize(this.model.getString('age')));
      
        __out.push('<br>\n            </p>\n            <p class="media-info">\n              职业：');
      
        __out.push(__sanitize(this.model.getString('career')));
      
        __out.push('<br>\n              兴趣：');
      
        __out.push(__sanitize(this.model.getString('interest')));
      
        __out.push('<br>\n              性格：');
      
        __out.push(__sanitize(this.model.getString('nature')));
      
        __out.push('<br>\n            </p>\n          </div>\n\n          <div class="media-info-title">获取方式</div>\n          <p class="media-info">\n            ');
      
        __out.push(__sanitize(this.model.getString('obtain')));
      
        __out.push('\n          </p>\n\n          ');
      
        if (this.model.get('remark')) {
          __out.push('\n            <div class="media-info-title">备注</div>\n            <p class="media-info">\n              ');
          __out.push(__sanitize(this.model.get("remark")));
          __out.push('\n            </p>\n          ');
        }
      
        __out.push('\n\n          ');
      
        if (this.model.get('contributors')) {
          __out.push('\n            <div class="media-info-title">数据提供者</div>\n            <p class="media-info">\n              ');
          __out.push(__sanitize(this.model.get('contributors').join("、")));
          __out.push('\n            </p>\n          ');
        }
      
        __out.push('\n\n          <a class="media-info" href="../desktop/#units/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('/edit">数据有误？点击这里</a>\n        </div>\n      </div>\n      <!-- <div class="slide disqus">\n        ');
      
        __out.push('\n      </div> -->\n    </div>\n    <div class="slide-handler">\n      <span class="icon icon-right-nav slide-next"></span>\n      <span class="icon icon-left-nav slide-prev"></span>\n    </div>\n  </div>\n</div>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/page"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push('<page class="content page"></page>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/pages/monsters/header"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push('<header class="bar bar-nav">\n\n  <div class="input-icon input-search" style="display:none;">\n    <span class="icon icon-search"></span>\n    <input type="search" placeholder="Search">\n    <a class="icon icon-close pull-right search-close"></a>\n  </div>\n\n  <a class="icon icon-bars pull-left" sref="#toggle-sidebar"></a>\n  <a class="icon icon-search pull-right search-open"></a>\n  <div class="dropdown pull-right">\n    <a class="btn btn-link dropdown-toggle">\n      筛选\n    </a>\n    <ul class="dropdown-menu">\n      <li class="dropdown-submenu pull-left">\n        <a class="">稀有度</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="rare">全部</a></li>\n          <li><a class="filter" data-key="rare" data-value="1">★</a></li>\n          <li><a class="filter" data-key="rare" data-value="2">★★</a></li>\n          <li><a class="filter" data-key="rare" data-value="3">★★★</a></li>\n          <li><a class="filter" data-key="rare" data-value="4">★★★★</a></li>\n          <li><a class="filter" data-key="rare" data-value="[3,4]">★★★以上</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">元素</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="element">全部</a></li>\n          <li><a class="filter" data-key="element" data-value="1">火</a></li>\n          <li><a class="filter" data-key="element" data-value="2">水</a></li>\n          <li><a class="filter" data-key="element" data-value="3">风</a></li>\n          <li><a class="filter" data-key="element" data-value="4">光</a></li>\n          <li><a class="filter" data-key="element" data-value="5">暗</a></li>\n          <li><a class="filter" data-key="element" data-value="[1,2,3]">火/水/风</a></li>\n   </ul>\n      </li> <li class="dropdown-submenu pull-left">\n        <a class="">皮肤</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="skin">全部</a></li>\n          <li><a class="filter" data-key="skin" data-value="1">坚硬</a></li>\n          <li><a class="filter" data-key="skin" data-value="2">常规</a></li>\n          <li><a class="filter" data-key="skin" data-value="3">柔软</a></li>\n          <li><a class="filter" data-key="skin" data-value="4">极软</a></li>\n          <li><a class="filter" data-key="skin" data-value="5">极硬</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">技能</a>\n        <ul class="dropdown-menu" id="skill">\n          <li><a class="filter-reset" data-key="skill-sc">全部</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">新品上架</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="server">全部</a></li>\n          <li><a class="filter" data-key="server" data-value="1">日服</a></li>\n          <li><a class="filter" data-key="server" data-value="2">国服</a></li>\n        </ul>\n      </li>\n      <li class="divider"></li>\n      <li><a class="filter-reset">重置</a></li>\n    </ul>\n  </div>\n  <div class="dropdown pull-right">\n    <a class="btn btn-link dropdown-toggle">\n      排序\n    </a>\n    <ul class="dropdown-menu">\n      <li class="active"><a class="sort-mode" data-key="rare">稀有度</a></li>\n      <li><a class="sort-mode" data-key="dps">单体DPS</a></li>\n      <li><a class="sort-mode" data-key="mdps">多体DPS</a></li>\n      <li><a class="sort-mode" data-key="life">生命力</a></li>\n      <li><a class="sort-mode" data-key="atk">攻击</a></li>\n      <li><a class="sort-mode" data-key="aarea">攻击距离</a></li>\n      <li><a class="sort-mode" data-key="anum">攻击数量</a></li>\n      <li><a class="sort-mode" data-key="aspd">攻击速度</a></li>\n      <li><a class="sort-mode" data-key="tenacity">韧性</a></li>\n      <li><a class="sort-mode" data-key="mspd">移动速度</a></li>\n      <li><a class="sort-mode" data-key="sklmax">极限值</a></li>\n    </ul>\n  </div>\n  <h1 class="title">');
      
        __out.push(__sanitize(this.title));
      
        __out.push('</h1>\n</header>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/pages/monsters/index"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push(_.renderTemplate("templates/mobile/pages/monsters/header"));
      
        __out.push('\n<div class="content">\n  <ul class="table-view"></ul>\n</div>\n<a class="btn btn-lg scroll-to-top">\n  <span class="icon icon-up"></span>\n</a>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/pages/monsters/item"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        var key;
      
        __out.push('<li class="table-view-cell media unit">\n  <a href="#monsters/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('">\n    <img class="media-object pull-left" src="');
      
        __out.push(__sanitize(this.model.thumbnailUrl()));
      
        /*__out.push('">\n    <svg class="media-graphics element pull-right" width="80" height="80">\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(App.Utils.SVG.getBackgroundPolygonPointsString(80, 40)));
      
        __out.push('" class="element-background"/>\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(App.Utils.SVG.getBackgroundPolygonPointsString(80, 26.7)));
      
        __out.push('" class="element-background"/>\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(App.Utils.SVG.getBackgroundPolygonPointsString(80, 13.3)));
      
        __out.push('" class="element-background"/>\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(this.model.getElementPolygonPointsString(80, 20)));*/
      
        __out.push('" class="');
      
        if (key = this.model.getElementKey()) {
          __out.push(__sanitize("element-" + key));
        }
      
        __out.push('"/>\n    </svg>\n    <div class="media-body">\n      <h4 class="media-title">\n        ');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\n        <small>');
      
        __out.push(__sanitize(this.model.getRareString()));
      
        __out.push('</small>\n      </h4>\n      <div class="media-info-group"><p class="media-info"><span style="display: none;" id="life">');
      
        __out.push(__sanitize(this.model.get("life")));
      
        __out.push('</span><span style="display: none;" id="atk">');
      
        __out.push(__sanitize(this.model.get("atk")));
      
        __out.push('</span>          攻距：');

        __out.push(__sanitize(this.model.getString("aarea")));
    
    __out.push('<br>\n          韧性：');
      
        __out.push(__sanitize(this.model.getString("tenacity")));
      
        __out.push('<br>\n          移速：');
      
        __out.push(__sanitize(this.model.getString("mspd")));
      
        __out.push('<br>\n          溅射距离：');
      
        __out.push(__sanitize(this.model.getString("sarea")));
      
        __out.push('<br>\n        </p>\n        <p class="media-info">');
    
    __out.push('          攻数：');
      
        __out.push(__sanitize(this.model.getString("anum")));
      
    __out.push('<br>\n          多段：');
    
        __out.push(__sanitize(this.model.getString("hits")));
    
    __out.push('<br>\n          皮肤：');
    
        __out.push(__sanitize(this.model.getSkinString()));
    
    __out.push('<br>\n          攻速：');
    
        __out.push(__sanitize(this.model.getString("aspd")));
      
        __out.push('<br>\n        </p>\n        <p style="display: none;" class="media-info hidden-xs">\n          火：');
      
        __out.push(__sanitize(this.model.getElementPercentString("fire")));
      
        __out.push('<br>\n          水：');
      
        __out.push(__sanitize(this.model.getElementPercentString("aqua")));
      
        __out.push('<br>\n          风：');
      
        __out.push(__sanitize(this.model.getElementPercentString("wind")));
      
        __out.push('<br>\n          光：');
      
        __out.push(__sanitize(this.model.getElementPercentString("light")));
      
        __out.push('<br>\n        </p>\n        <p class="media-info hidden-sm">');
    
        //__out.push('          皮肤：');
      
        //__out.push(__sanitize(this.model.getSkinString()));
    
    __out.push('          极限值：');
      
        __out.push(__sanitize(this.model.getSklmaxString()));
    
        __out.push('<br>\n          技能：');
      
        __out.push(__sanitize(this.model.getString("skill-sc")));
    
    __out.push('<br>\n          技能CD：');
      
        __out.push(__sanitize(this.model.getString("sklcd")));
    
    __out.push('<br>\n          技能SP：');
      
        __out.push(__sanitize(this.model.getString("sklsp")));
      
        __out.push('<span style="display: none;" id="dps">');
      
        __out.push(__sanitize(this.model.get("dps")));
      
        __out.push('</span><span style="display: none;" id="mdps">');
      
        __out.push(__sanitize(this.model.get("mdps")));
      
        __out.push('</span><br>\n        </p>\n\n      </div>\n    </div>\n  </a>\n</li>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/pages/units/header"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push('<header class="bar bar-nav">\n\n  <div class="input-icon input-search" style="display:none;">\n    <span class="icon icon-search"></span>\n    <input type="search" placeholder="Search">\n    <a class="icon icon-close pull-right search-close"></a>\n  </div>\n\n  <a class="icon icon-bars pull-left" sref="#toggle-sidebar"></a>\n  <a class="icon icon-search pull-right search-open"></a>\n  <div class="dropdown pull-right">\n    <a class="btn btn-link dropdown-toggle">\n      筛选\n    </a>\n    <ul class="dropdown-menu">\n      <li class="dropdown-submenu pull-left">\n        <a class="">稀有度</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="rare">全部</a></li>\n          <li><a class="filter" data-key="rare" data-value="1">★</a></li>\n          <li><a class="filter" data-key="rare" data-value="2">★★</a></li>\n          <li><a class="filter" data-key="rare" data-value="3">★★★</a></li>\n          <li><a class="filter" data-key="rare" data-value="4">★★★★</a></li>\n          <li><a class="filter" data-key="rare" data-value="5">★★★★★</a></li>\n          <li><a class="filter" data-key="rare" data-value="[3,4,5]">★★★以上</a></li>\n          <li><a class="filter" data-key="rare" data-value="[4,5]">★★★★以上</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">元素</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="element">全部</a></li>\n          <li><a class="filter" data-key="element" data-value="1">火</a></li>\n          <li><a class="filter" data-key="element" data-value="2">水</a></li>\n          <li><a class="filter" data-key="element" data-value="3">风</a></li>\n          <li><a class="filter" data-key="element" data-value="4">光</a></li>\n          <li><a class="filter" data-key="element" data-value="5">暗</a></li>\n          <li><a class="filter" data-key="element" data-value="[1,2,3]">火/水/风</a></li>\n          <li><a class="filter" data-key="element" data-value="[4,5]">光/暗</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">武器</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="weapon">全部</a></li>\n          <li><a class="filter" data-key="weapon" data-value="1">斩击</a></li>\n          <li><a class="filter" data-key="weapon" data-value="2">突击</a></li>\n          <li><a class="filter" data-key="weapon" data-value="3">打击</a></li>\n          <li><a class="filter" data-key="weapon" data-value="4">弓箭</a></li>\n          <li><a class="filter" data-key="weapon" data-value="5">魔法</a></li>\n          <li><a class="filter" data-key="weapon" data-value="6">铳弹</a></li>\n          <li><a class="filter" data-key="weapon" data-value="7">回复</a></li>\n          <li><a class="filter" data-key="weapon" data-value="[1,2,3]">斩/突/打</a></li>\n          <li><a class="filter" data-key="weapon" data-value="[4,5,6]">弓/魔/铳</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">成长</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="type">全部</a></li>\n          <li><a class="filter" data-key="type" data-value="1">早熟</a></li>\n          <li><a class="filter" data-key="type" data-value="2">平均</a></li>\n          <li><a class="filter" data-key="type" data-value="3">晚成</a></li>\n        </ul>\n      </li>\n    <li class="dropdown-submenu pull-left">\n        <a class="">年龄</a>\n        <ul class="dropdown-menu" id="age">\n          <li><a class="filter-reset" data-key="age">全部</a></li>\n          <li><a class="filter" data-key="age" data-value="0-10">10岁以下</a></li>\n          <li><a class="filter" data-key="age" data-value="11-15">11至15岁</a></li>\n          <li><a class="filter" data-key="age" data-value="16-20">16至20岁</a></li>\n          <li><a class="filter" data-key="age" data-value="21-25">21至25岁</a></li>\n          <li><a class="filter" data-key="age" data-value="26-30">26至30岁</a></li>\n          <li><a class="filter" data-key="age" data-value="31-35">31至35岁</a></li>\n          <li><a class="filter" data-key="age" data-value="36-40">36至40岁</a></li>\n          <li><a class="filter" data-key="age" data-value="41-1000">40岁以上</a></li>\n        </ul>\n      </li>\n    <li class="dropdown-submenu pull-left">\n        <a class="">攻击距离</a>\n        <ul class="dropdown-menu" id="aarea">\n          <li><a class="filter-reset" data-key="aarea">全部</a></li>\n          <li><a class="filter" data-key="aarea" data-value="0-50">近程</a></li>\n          <li><a class="filter" data-key="aarea" data-value="50-150">中程</a></li>\n          <li><a class="filter" data-key="aarea" data-value="150-500">远程</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">攻击数量</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="anum">全部</a></li>\n          <li><a class="filter" data-key="anum" data-value="1">1体</a></li>\n          <li><a class="filter" data-key="anum" data-value="2">2体</a></li>\n          <li><a class="filter" data-key="anum" data-value="3">3体</a></li>\n          <li><a class="filter" data-key="anum" data-value="4">4体</a></li>\n          <li><a class="filter" data-key="anum" data-value="5">5体</a></li>\n          <li><a class="filter" data-key="anum" data-value="[2,3]">2/3体</a></li>\n          <li><a class="filter" data-key="anum" data-value="[4,5]">4/5体</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">性别</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="gender">全部</a></li>\n          <li><a class="filter" data-key="gender" data-value="1">不明</a></li>\n          <li><a class="filter" data-key="gender" data-value="2">男</a></li>\n          <li><a class="filter" data-key="gender" data-value="3">女</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">新品上架</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="server">全部</a></li>\n          <li><a class="filter" data-key="server" data-value="1">日服</a></li>\n          <li><a class="filter" data-key="server" data-value="2">国服</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">交换所</a>\n        <ul class="dropdown-menu">\n          <li><a class="filter-reset" data-key="exchange">全部</a></li>\n          <li><a class="filter" data-key="exchange" data-value="1">历代交换所人物</a></li>\n          <li><a class="filter" data-key="exchange" data-value="2">历代活动人物</a></li>\n        </ul>\n      </li>\n      <li class="dropdown-submenu pull-left">\n        <a class="">国别</a>\n        <ul class="dropdown-menu" id="country">\n          <li><a class="filter-reset" data-key="country">全部</a></li>\n        </ul>\n      </li>\n      <li class="divider"></li>\n      <li><a class="filter-reset">重置</a></li>\n    </ul>\n  </div>\n  <div class="dropdown pull-right">\n    <a class="btn btn-link dropdown-toggle">\n      排序\n    </a>\n    <ul class="dropdown-menu">\n      <li class="active"><a class="sort-mode" data-key="rare">稀有度</a></li>\n      <li><a class="sort-mode" data-key="dps">单体DPS</a></li>\n      <li><a class="sort-mode" data-key="mdps">多体DPS</a></li>\n      <li><a class="sort-mode" data-key="life">生命力</a></li>\n      <li><a class="sort-mode" data-key="atk">攻击</a></li>\n      <li><a class="sort-mode" data-key="aarea">攻击距离</a></li>\n      <li><a class="sort-mode" data-key="anum">攻击数量</a></li>\n      <li><a class="sort-mode" data-key="aspd">攻击速度</a></li>\n      <li><a class="sort-mode" data-key="tenacity">韧性</a></li>\n      <li><a class="sort-mode" data-key="mspd">移动速度</a></li>\n      <li><a class="sort-mode" data-key="hits">多段攻击</a></li>\n      <li><a class="sort-mode" data-key="sklmax">新品上架</a></li>\n    </ul>\n  </div>\n  <div class="dropdown pull-right">\n    <a class="btn btn-link dropdown-toggle">\n      等级\n    </a>\n    <ul class="dropdown-menu">\n      <li class="active"><a class="level-mode" data-key="zero">零觉零级</a></li>\n      <li><a class="level-mode" data-key="mxlv">零觉满级</a></li>\n      <li><a class="level-mode" data-key="mxlvgr">满觉满级</a></li>\n    </ul>\n  </div>\n  <h1 class="title">');
      
        __out.push(__sanitize(this.title));
      
        __out.push('</h1>\n</header>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/pages/units/index"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push(_.renderTemplate("templates/mobile/pages/units/header"));
      
        __out.push('\n<div class="content">\n  <ul class="table-view"></ul>\n</div>\n<a class="btn btn-lg scroll-to-top">\n  <span class="icon icon-up"></span>\n</a>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/pages/units/item"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        var key;
      
        __out.push('<li class="table-view-cell media unit">\n  <a href="#units/');
      
        __out.push(__sanitize(this.model.id));
      
        __out.push('">\n    <img class="media-object pull-left" src="');
      
        __out.push(__sanitize(this.model.thumbnailUrl()));
      
        __out.push('">\n    <svg class="media-graphics element pull-right" width="80" height="80">\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(App.Utils.SVG.getBackgroundPolygonPointsString(80, 40)));
      
        __out.push('" class="element-background"/>\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(App.Utils.SVG.getBackgroundPolygonPointsString(80, 26.7)));
      
        __out.push('" class="element-background"/>\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(App.Utils.SVG.getBackgroundPolygonPointsString(80, 13.3)));
      
        __out.push('" class="element-background"/>\n      <polygon xmlns="http://www.w3.org/2000/svg" points="');
      
        __out.push(__sanitize(this.model.getElementPolygonPointsString(80, 20)));
      
        __out.push('" class="');
      
        if (key = this.model.getElementKey()) {
          __out.push(__sanitize("element-" + key));
        }
      
        __out.push('"/>\n    </svg>\n    <div class="media-body">\n      <h4 class="media-title">\n        ');
      
        __out.push(__sanitize(this.model.getTitleString()));
      
        __out.push('\n        <small>');
      
        __out.push(__sanitize(this.model.getRareString()));
      
        __out.push('</small>\n      </h4>\n      <div class="media-info-group">\n        <p class="media-info">\n          生命：<span id="life">');
      
        __out.push(__sanitize(this.model.get("life")));
      
        __out.push('</span><br>\n          攻击：<span id="atk">');
      
        __out.push(__sanitize(this.model.get("atk")));
      
        __out.push('</span><br>\n          攻距：');
      
        __out.push(__sanitize(this.model.getString("aarea")));
      
        __out.push('<br>\n          攻数：');
      
        __out.push(__sanitize(this.model.getString("anum")));
      
        __out.push('<br>\n        </p>\n        <p class="media-info">\n          攻速：');
      
        __out.push(__sanitize(this.model.getString("aspd")));
      
        __out.push('<br>\n          韧性：');
      
        __out.push(__sanitize(this.model.getString("tenacity")));
      
        __out.push('<br>\n          移速：');
      
        __out.push(__sanitize(this.model.getString("mspd")));
      
        __out.push('<br>\n          多段：');
      
        __out.push(__sanitize(this.model.getString("hits")));
      
        __out.push('<br>\n        </p>\n        <p class="media-info hidden-xs">\n          成长：');
      
        __out.push(__sanitize(this.model.getTypeString()));
      
        __out.push('<br>\n          火：');
      
        __out.push(__sanitize(this.model.getElementPercentString("fire")));
      
        __out.push('<br>\n          水：');
      
        __out.push(__sanitize(this.model.getElementPercentString("aqua")));
      
        __out.push('<br>\n          风：');
      
        __out.push(__sanitize(this.model.getElementPercentString("wind")));
      
        __out.push('<br>\n        </p>\n        <p class="media-info hidden-sm">\n          光：');
      
        __out.push(__sanitize(this.model.getElementPercentString("light")));
      
        __out.push('<br>\n          暗：');
      
        __out.push(__sanitize(this.model.getElementPercentString("dark")));
      
        __out.push('<br>\n          DPS：<span id="dps">');
      
        __out.push(__sanitize(this.model.get("dps")));
      
        __out.push('</span><br>\n          总DPS：<span id="mdps">');
      
        __out.push(__sanitize(this.model.get("mdps")));
      
        __out.push('</span><br>\n        </p>\n\n      </div>\n    </div>\n  </a>\n</li>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() { this.JST || (this.JST = {}); this.JST["templates/mobile/sidebar"] = function(__obj) {
    if (!__obj) __obj = {};
    var __out = [], __capture = function(callback) {
      var out = __out, result;
      __out = [];
      callback.call(this);
      result = __out.join('');
      __out = out;
      return __safe(result);
    }, __sanitize = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else if (typeof value !== 'undefined' && value != null) {
        return __escape(value);
      } else {
        return '';
      }
    }, __safe, __objSafe = __obj.safe, __escape = __obj.escape;
    __safe = __obj.safe = function(value) {
      if (value && value.ecoSafe) {
        return value;
      } else {
        if (!(typeof value !== 'undefined' && value != null)) value = '';
        var result = new String(value);
        result.ecoSafe = true;
        return result;
      }
    };
    if (!__escape) {
      __escape = __obj.escape = function(value) {
        return ('' + value)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      };
    }
    (function() {
      (function() {
        __out.push('<sidebar class="content sidebar">\n  <ul class="table-view">\n    <li class="table-view-cell media">\n      <a class="navigate-right" href="#units">\n        <span class="media-object pull-left icon icon-person"></span>\n        <div class="media-body">\n          同伴\n        </div>\n      </a>\n    </li>\n    <li class="table-view-cell media">\n      <a class="navigate-right" href="#monsters">\n        <span class="media-object pull-left icon icon-gear"></span>\n        <div class="media-body">\n          魔宠\n        </div>\n      </a>\n    </li>\n  </ul>\n  <ul class="table-view">\n    <li class="table-view-cell media">\n      <a class="navigate-right" href="../gacha/">\n        <span class="media-object pull-left icon icon-pages"></span>\n        <div class="media-body">\n          模拟抽卡\n        </div>\n      </a>\n    </li>\n    <li class="table-view-cell media">\n      <a class="navigate-right" href="../desktop/">\n        <span class="media-object pull-left icon icon-home"></span>\n        <div class="media-body">\n          桌面版\n        </div>\n      </a>\n    </li>\n    <li class="table-view-cell media">\n      <a class="navigate-right" href="../download/">\n        <span class="media-object pull-left icon icon-download"></span>\n        <div class="media-body">\n          客户端下载\n        </div>\n      </a>\n    </li>\n    <li class="table-view-cell media">\n      <a class="navigate-right" href="../jump/about.html">\n        <span class="media-object pull-left icon icon-info"></span>\n        <div class="media-body">\n          帮助\n        </div>\n      </a>\n    </li>\n  </ul>\n</sidebar>\n');
      
      }).call(this);
      
    }).call(__obj);
    __obj.safe = __objSafe, __obj.escape = __escape;
    return __out.join('');
  };
}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.UnitsItem = (function(_super) {
    __extends(UnitsItem, _super);

    function UnitsItem() {
      return UnitsItem.__super__.constructor.apply(this, arguments);
    }

    UnitsItem.prototype.template = _.loadTemplate("templates/mobile/pages/units/item");

    UnitsItem.prototype.bindings = {
      "#life": "life",
      "#atk": "atk",
      "#dps": "dps",
      "#mdps": "mdps"
    };

    return UnitsItem;

  })(Backbone.View);

  App.Pages.UnitsIndex = (function(_super) {
    __extends(UnitsIndex, _super);

    function UnitsIndex() {
      return UnitsIndex.__super__.constructor.apply(this, arguments);
    }

    UnitsIndex.prototype.template = _.loadTemplate("templates/mobile/pages/units/index");

    UnitsIndex.prototype.store = {
      selector: ".table-view",
      template: App.Pages.UnitsItem,
      infinite: {
        container: ".content",
        suffix: true
      }
    };

    UnitsIndex.prototype.events = {
      "click .dropdown-toggle": "toggleDropdown",
      "click .dropdown-submenu > a": "triggerHover",
      "click .filter-reset": "resetFilter",
      "click .filter": "setFilter",
      "click .sort-mode": "setSortMode",
      "click .level-mode": "setLevelMode",
      "click .search-open": "openSearch",
      "click .search-close": "closeSearch"
    };

    UnitsIndex.prototype.afterRender = function() {
      var $content, $scroll;
      this.filters = {};
      this.binder.filter(this.filters);
      $content = this.$el.filter(".content");
      $scroll = this.$el.filter(".scroll-to-top");
      $scroll.click(function() {
        return $content.scrollToTop();
      });
      this.$el.scroll(function(event) {
        if (event.target.scrollTop > 1000) {
          return $scroll.addClass("in");
        } else {
          return $scroll.removeClass("in");
        }
      });
      return this.appendFilters();
    };

    UnitsIndex.prototype.appendFilters = function() {
      var $age, $aarea, $country, appendCountryFilter;
    
    $age = this.$("#age");
      $age.find(".filter").each(function() {
        var $target, max, min, original;
        $target = $(this);
        original = $target.data("value").split("-");
        min = parseInt(original[0]);
        max = parseInt(original[1]);
        return $target.data("value", function(value) {
          if (min > value) {
            return false;
          }
          if (max < value) {
            return false;
          }
      if ("暂缺" == value || "??" == value || "" == value || undefined == value) {
            return false;
          }
          return true;
        });
      });
    
      $aarea = this.$("#aarea");
      $aarea.find(".filter").each(function() {
        var $target, max, min, original;
        $target = $(this);
        original = $target.data("value").split("-");
        min = parseInt(original[0]);
        max = parseInt(original[1]);
        return $target.data("value", function(value) {
          if (min > value) {
            return false;
          }
          if (max < value) {
            return false;
          }
          return true;
        });
      });
      $country = this.$("#country");
      appendCountryFilter = function(collection) {
        var countries, country, _i, _len, _results;
        countries = collection.map(function(model) {
          return model.get("country");
        });
        countries = _.uniq(countries);
        _results = [];
        for (_i = 0, _len = countries.length; _i < _len; _i++) {
          country = countries[_i];
          _results.push($country.append("<li><a class=\"filter\" data-key=\"country\" data-value=\"" + country + "\">" + country + "</a></li>"));
        }
        return _results;
      };
      if ($country.length > 0) {
        if (this.collection.length === 0) {
          return this.collection.once("reset", (function(_this) {
            return function(collection) {
              return appendCountryFilter(collection);
            };
          })(this));
        } else {
          return appendCountryFilter(this.collection);
        }
      }
    };

    UnitsIndex.prototype.triggerHover = function(event) {
      $(event.target).trigger('hover');
      return event.stopPropagation();
    };

    UnitsIndex.prototype.toggleDropdown = function(event) {
      var $dropdown;
      $dropdown = $(event.target).parent(".dropdown");
      if ($dropdown.hasClass("active")) {
        $dropdown.removeClass("active");
      } else {
        $(".dropdown.active").removeClass("active");
        $dropdown.addClass("active");
      }
      $dropdown.closest(".container").one("click", function() {
        return $dropdown.removeClass("active");
      });
      return event.stopPropagation();
    };

    UnitsIndex.prototype.openSearch = function(event) {
      var $children, $input, $search;
      $children = $(event.target).closest("header").children();
      $search = $children.filter(".input-search");
      $children.not($search).hide();
      $search.show();
      $input = $search.children("input");
      $input.trigger("focus").val("");
      return this.searchInterval = setInterval((function(_this) {
        return function() {
          var query;
          query = $input.val();
          return _this.search(query);
        };
      })(this), 200);
    };

    UnitsIndex.prototype.closeSearch = function(event) {
      var $children, $search;
      this.binder.filter(this.filters);
      if (this.searchInterval) {
        clearInterval(this.searchInterval);
      }
      $children = $(event.target).closest("header").children();
      $search = $children.filter(".input-search");
      $children.not($search).show();
      return $search.hide();
    };

    UnitsIndex.prototype.search = function(query) {
      if (query !== this.searchQuery) {
        this.binder.filter((function(_this) {
          return function(collection) {
            var models;
            models = _.isEmpty(_this.filters) ? collection.models : collection.where(_this.filters);
            if (query !== "") {
              models = _.filter(models, function(model) {
                var key, value, _i, _len, _ref;
                _ref = ["id", "name", "title"];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  key = _ref[_i];
                  value = model.get(key);
                  if (value && value.toString().indexOf(query) >= 0) {
                    return true;
                  }
                }
                return false;
              });
            }
            return models;
          };
        })(this));
        return this.searchQuery = query;
      }
    };

    UnitsIndex.prototype.resetFilter = function(event) {
      var $target, key;
      $target = $(event.target);
      this.removeAllActive($target);
      if (key = $target.data("key")) {
        delete this.filters[key];
      } else {
        this.filters = {};
      }
      return this.binder.filter(this.filters);
    };

    UnitsIndex.prototype.removeAllActive = function($target) {
      return $target.closest('.dropdown-menu').find('.active').removeClass('active');
    };

    UnitsIndex.prototype.setActive = function($target) {
      this.removeAllActive($target);
      return $target.parent('li').toggleClass("active");
    };

    UnitsIndex.prototype.setFilter = function(event) {
      var $target, filters, key, value;
      $target = $(event.target);
      this.setActive($target);
      key = $target.data("key");
      value = $target.data("value");
      filters = {};
      filters[key] = value;
      this.filters[key] = value;
      return this.binder.filter(this.filters);
    };

    UnitsIndex.prototype.setSortMode = function(event) {
      var $target, key;
      $target = $(event.target);
      this.setActive($target);
      key = $target.data("key");
      return this.binder.sort(function(model) {
        var value;
        value = model.get(key);
        if ((value != null ? value.toString() : void 0) === "NaN" || (value == null)) {
          return 0;
        } else {
          return -value;
        }
      });
    };

    UnitsIndex.prototype.setLevelMode = function(event) {
      var $target, key;
      $target = $(event.target);
      this.setActive($target);
      key = $target.data("key");
      return this.binder.collection.each(function(model) {
        return model.setLevelMode(key);
      });
    };

    return UnitsIndex;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.MonstersItem = (function(_super) {
    __extends(MonstersItem, _super);

    function MonstersItem() {
      return MonstersItem.__super__.constructor.apply(this, arguments);
    }

    MonstersItem.prototype.template = _.loadTemplate("templates/mobile/pages/monsters/item");

    MonstersItem.prototype.bindings = {
      "#life": "life",
      "#atk": "atk",
      "#dps": "dps",
      "#mdps": "mdps"
    };

    return MonstersItem;

  })(Backbone.View);

  App.Pages.MonstersIndex = (function(_super) {
    __extends(MonstersIndex, _super);

    function MonstersIndex() {
      return MonstersIndex.__super__.constructor.apply(this, arguments);
    }

    MonstersIndex.prototype.template = _.loadTemplate("templates/mobile/pages/monsters/index");

    MonstersIndex.prototype.store = _.extend({}, App.Pages.UnitsIndex.prototype.store, {
      template: App.Pages.MonstersItem
    });

    MonstersIndex.prototype.appendFilters = function() {
      var $skill, appendSkillFilter;
      $skill = this.$("#skill");
      appendSkillFilter = function(collection) {
        var skill, skills, _i, _len, _results;
        skills = collection.map(function(model) {
          return model.get("skill-sc");
        });
        skills = _.uniq(skills);
        _results = [];
        for (_i = 0, _len = skills.length; _i < _len; _i++) {
          skill = skills[_i];
          _results.push($skill.append("<li><a class=\"filter\" data-key=\"skill-sc\" data-value=\"" + skill + "\">" + skill + "</a></li>"));
        }
        return _results;
      };
      if ($skill.length > 0) {
        if (this.collection.length === 0) {
          return this.collection.once("reset", (function(_this) {
            return function(collection) {
              return appendSkillFilter(collection);
            };
          })(this));
        } else {
          return appendSkillFilter(this.collection);
        }
      }
    };

    return MonstersIndex;

  })(App.Pages.UnitsIndex);

}).call(this);
/* ========================================================================
 * Ratchet: sliders.js v2.0.2
 * http://goratchet.com/components#sliders
 * ========================================================================
   Adapted from Brad Birdsall's swipe
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */


!(function () {
  'use strict';

  var pageX;
  var pageY;
  var slider;
  var deltaX;
  var deltaY;
  var offsetX;
  var lastSlide;
  var startTime;
  var resistance;
  var sliderWidth;
  var slideNumber;
  var isScrolling;
  var scrollableArea;

  var getSlider = function (target) {
    var i;
    var sliders = document.querySelectorAll('.slider > .slide-group');

    for (; target && target !== document; target = target.parentNode) {
      for (i = sliders.length; i--;) {
        if (sliders[i] === target) {
          return target;
        }
      }
    }
  };

  var getScroll = function () {
    if ('webkitTransform' in slider.style) {
      var translate3d = slider.style.webkitTransform.match(/translate3d\(([^,]*)/);
      var ret = translate3d ? translate3d[1] : 0;
      return parseInt(ret, 10);
    }
  };

  var setSlideNumber = function (offset) {
    var round = offset ? (deltaX < 0 ? 'ceil' : 'floor') : 'round';
    slideNumber = Math[round](getScroll() / (scrollableArea / slider.children.length));
    slideNumber += offset;
    slideNumber = Math.min(slideNumber, 0);
    slideNumber = Math.max(-(slider.children.length - 1), slideNumber);
  };

  var onTouchStart = function (e) {
    slider = getSlider(e.target);

    if (!slider) {
      return;
    }

    var firstItem  = slider.querySelector('.slide');

    scrollableArea = firstItem.offsetWidth * slider.children.length;
    isScrolling    = undefined;
    sliderWidth    = slider.offsetWidth;
    resistance     = 1;
    lastSlide      = -(slider.children.length - 1);
    startTime      = +new Date();
    pageX          = e.touches[0].pageX;
    pageY          = e.touches[0].pageY;
    deltaX         = 0;
    deltaY         = 0;

    setSlideNumber(0);

    slider.style['-webkit-transition-duration'] = 0;
  };

  var onTouchMove = function (e) {
    if (e.touches.length > 1 || !slider) {
      return; // Exit if a pinch || no slider
    }

    deltaX = e.touches[0].pageX - pageX;
    deltaY = e.touches[0].pageY - pageY;
    pageX  = e.touches[0].pageX;
    pageY  = e.touches[0].pageY;

    if (typeof isScrolling === 'undefined') {
      isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
    }

    if (isScrolling) {
      return;
    }

    offsetX = (deltaX / resistance) + getScroll();

    e.preventDefault();

    resistance = slideNumber === 0         && deltaX > 0 ? (pageX / sliderWidth) + 1.25 :
                 slideNumber === lastSlide && deltaX < 0 ? (Math.abs(pageX) / sliderWidth) + 1.25 : 1;

    slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
  };

  var onTouchEnd = function (e) {
    if (!slider || isScrolling) {
      return;
    }

    setSlideNumber(
      (+new Date()) - startTime < 1000 && Math.abs(deltaX) > 15 ? (deltaX < 0 ? -1 : 1) : 0
    );

    offsetX = slideNumber * sliderWidth;

    slider.style['-webkit-transition-duration'] = '.2s';
    slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';

    e = new CustomEvent('slide', {
      detail: { slideNumber: Math.abs(slideNumber) },
      bubbles: true,
      cancelable: true
    });

    slider.parentNode.dispatchEvent(e);
  };

  window.Ratchet.Sliders = {
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd
  };

}());
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Widgets.Slider = (function(_super) {
    __extends(Slider, _super);

    function Slider() {
      return Slider.__super__.constructor.apply(this, arguments);
    }

    Slider.prototype.events = {
      "touchstart": "onTouchStart",
      "touchmove": "onTouchMove",
      "touchend": "onTouchEnd",
      "mousedown": "onMouseDown",
      "mousemove": "onMouseMove",
      "mouseup": "onMouseUp",
      "mouseup .slide-next": "slideToNext",
      "mouseup .slide-prev": "slideToPrev"
    };

    Slider.prototype.afterRender = function() {
      this.slider = this.$(".slide-group").get(0);
      return this.slideNumber = 0;
    };

    Slider.prototype.getScroll = function() {
      var offsetX, translate3d;
      if (this.slider.style.webkitTransform != null) {
        translate3d = this.slider.style.webkitTransform.match(/translate3d\(([^,]*)/);
        offsetX = translate3d ? translate3d[1] : 0;
        return parseInt(offsetX, 10);
      }
    };

    Slider.prototype.setSlideNumber = function(offset) {
      var round, slideNumber;
      round = offset ? (this.deltaX < 0 ? 'ceil' : 'floor') : 'round';
      slideNumber = Math[round](this.getScroll() / (this.scrollableArea / this.slider.children.length));
      slideNumber += offset;
      slideNumber = Math.min(slideNumber, 0);
      slideNumber = Math.max(-(this.slider.children.length - 1), slideNumber);
      return this.slideNumber = slideNumber;
    };

    Slider.prototype.onTouchStart = function(event) {
      var firstItem;
      firstItem = this.$('.slide').get(0);
      this.scrollableArea = firstItem.offsetWidth * this.slider.children.length;
      this.isScrolling = void 0;
      this.sliderWidth = this.slider.offsetWidth;
      this.resistance = 1;
      this.lastSlide = -(this.slider.children.length - 1);
      this.startTime = +new Date();
      this.pageX = event.touches[0].pageX;
      this.pageY = event.touches[0].pageY;
      this.deltaX = 0;
      this.deltaY = 0;
      this.setSlideNumber(0);
      return this.slider.style['-webkit-transition-duration'] = 0;
    };

    Slider.prototype.onTouchMove = function(event) {
      var offsetX;
      if (event.touches.length > 1) {
        return;
      }
      this.deltaX = event.touches[0].pageX - this.pageX;
      this.deltaY = event.touches[0].pageY - this.pageY;
      this.pageX = event.touches[0].pageX;
      this.pageY = event.touches[0].pageY;
      this.isScrolling || (this.isScrolling = Math.abs(this.deltaY) > Math.abs(this.deltaX));
      if (this.isScrolling) {
        return;
      }
      offsetX = (this.deltaX / this.resistance) + this.getScroll();
      event.preventDefault();
      this.resistance = this.slideNumber === 0 && this.deltaX > 0 ? (this.pageX / this.sliderWidth) + 1.25 : this.slideNumber === this.lastSlide && this.deltaX < 0 ? (Math.abs(this.pageX) / this.sliderWidth) + 1.25 : 1;
      return this.slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
    };

    Slider.prototype.onTouchEnd = function(event) {
      var offset, offsetX;
      if (this.isScrolling) {
        return;
      }
      offset = (+new Date()) - this.startTime < 1000 && Math.abs(this.deltaX) > 15 ? (this.deltaX < 0 ? -1 : 1) : 0;
      this.setSlideNumber(offset);
      offsetX = this.slideNumber * this.sliderWidth;
      this.slider.style['-webkit-transition-duration'] = '.2s';
      this.slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
      event = new CustomEvent('slide', {
        detail: {
          slideNumber: Math.abs(this.slideNumber)
        },
        bubbles: true,
        cancelable: true
      });
      return this.slider.parentNode.dispatchEvent(event);
    };

    Slider.prototype.slideTo = function(event, slideNumber) {
      var offsetX;
      offsetX = slideNumber * this.sliderWidth;
      this.slider.style['-webkit-transition-duration'] = '.2s';
      return this.slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
    };

    Slider.prototype.slideToNext = function(event) {
      this.setSlideNumber(-1);
      this.slideTo(event, this.slideNumber);
      event.stopPropagation();
      return event.preventDefault();
    };

    Slider.prototype.slideToPrev = function(event) {
      this.setSlideNumber(1);
      this.slideTo(event, this.slideNumber);
      event.stopPropagation();
      return event.preventDefault();
    };

    Slider.prototype._imitateTouchEvent = function(event) {
      event.touches || (event.touches = [_.pick(event, "pageX", "pageY")]);
      return event;
    };

    Slider.prototype.onMouseDown = function(event) {
      if (this.mouseIsDown) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.mouseIsDown = true;
      return this.onTouchStart(this._imitateTouchEvent(event));
    };

    Slider.prototype.onMouseMove = function(event) {
      if (this.mouseIsDown) {
        return this.onTouchMove(this._imitateTouchEvent(event));
      }
    };

    Slider.prototype.onMouseUp = function(event) {
      this.mouseIsDown = false;
      return this.onTouchEnd(this._imitateTouchEvent(event));
    };

    return Slider;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.UnitsShow = (function(_super) {
    __extends(UnitsShow, _super);

    function UnitsShow() {
      return UnitsShow.__super__.constructor.apply(this, arguments);
    }

    UnitsShow.prototype.template = _.loadTemplate("templates/mobile/modals/units/show");

    UnitsShow.prototype.layout = {
      ".slider": App.Widgets.Slider
    };

    UnitsShow.prototype.events = {
      "click #disqus_thread": "stopPropagation"
    };

    UnitsShow.prototype.stopPropagation = function(event) {
      return event.stopPropagation();
    };

    UnitsShow.prototype.afterRender = function() {
      var $image, resize;
      $image = this.$(".slider .image");
      resize = function() {
        if (window.innerWidth < window.innerHeight) {
          $image.width("100%");
          return $image.height("auto");
        } else {
          $image.width("auto");
          return $image.height("100%");
        }
      };
      _.defer(resize);
      return $(window).resize(resize);
    };

    return UnitsShow;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Pages.MonstersShow = (function(_super) {
    __extends(MonstersShow, _super);

    function MonstersShow() {
      return MonstersShow.__super__.constructor.apply(this, arguments);
    }

    MonstersShow.prototype.template = _.loadTemplate("templates/mobile/modals/monsters/show");

    return MonstersShow;

  })(App.Pages.UnitsShow);

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.Container = (function(_super) {
    __extends(Container, _super);

    function Container() {
      this.onClickSidebarActive = __bind(this.onClickSidebarActive, this);
      return Container.__super__.constructor.apply(this, arguments);
    }

    Container.prototype.template = void 0;

    Container.prototype.afterRender = function(view, reverse) {
      if (reverse == null) {
        reverse = false;
      }
      if (view != null) {
        if (this.lastPage != null) {
          this.lastPage.remove();
        }
        this.lastPage = this.currPage;
        this.currPage = new App.Views.Page().render(view);
        this.currPage.$el.appendTo(this.$el);
        if (this.lastPage != null) {
          this.lastPage.hide();
          return this.currPage.show();
        }
      }
    };

    Container.prototype.onClickSidebarActive = function(event) {
      this.toggleSidebar();
      event.stopImmediatePropagation();
      return event.preventDefault();
    };

    Container.prototype.toggleSidebar = function() {
      this.$el.toggleClass("sidebar-active");
      if (this.$el.hasClass("sidebar-active")) {
        return this.$el.on("click", this.onClickSidebarActive);
      } else {
        return this.$el.off("click", this.onClickSidebarActive);
      }
    };

    Container.prototype.openSidebar = function() {
      this.$el.addClass("sidebar-active");
      return this.$el.on("click", this.onClickSidebarActive);
    };

    Container.prototype.closeSidebar = function() {
      this.$el.removeClass("sidebar-active");
      return this.$el.off("click", this.onClickSidebarActive);
    };

    return Container;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.Page = (function(_super) {
    __extends(Page, _super);

    function Page() {
      return Page.__super__.constructor.apply(this, arguments);
    }

    Page.prototype.template = _.loadTemplate("templates/mobile/page");

    Page.prototype.afterRender = function(view) {
      if (view != null) {
        if (this.view != null) {
          this.view.remove();
        }
        this.view = view;
        return this.$el.html(view.$el);
      }
    };

    Page.prototype.afterRemove = function() {
      if (this.view != null) {
        return this.view.remove();
      }
    };

    Page.prototype.show = function() {
      this.$el.addClass("sliding right");
      return _.defer((function(_this) {
        return function() {
          _this.el.offsetWidth;
          return _this.$el.removeClass("right");
        };
      })(this));
    };

    Page.prototype.hide = function() {
      return this.$el.addClass("left");
    };

    return Page;

  })(Backbone.View);

}).call(this);
(function() {
  var MAX_CLICK_DISTANCE, MAX_CLICK_DURATION,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  MAX_CLICK_DURATION = 200;

  MAX_CLICK_DISTANCE = 5;

  App.Views.Modal = (function(_super) {
    __extends(Modal, _super);

    function Modal() {
      return Modal.__super__.constructor.apply(this, arguments);
    }

    Modal.prototype.template = void 0;

    Modal.prototype.events = {
      "touchstart": "onTouchStart",
      "touchend": "onTouchEnd",
      "mousedown": "onMouseDown",
      "mouseup": "onMouseUp"
    };

    Modal.prototype.onTouchStart = function(event) {
      return this.onMouseDown(this._imitateMouseEvent(event));
    };

    Modal.prototype.onTouchEnd = function(event) {
      return this.onMouseUp(this._imitateMouseEvent(event));
    };

    Modal.prototype._imitateMouseEvent = function(event) {
      event.pageX = event.touches[0].pageX;
      event.pageY = event.touches[0].pageY;
      return event;
    };

    Modal.prototype.onMouseDown = function(event) {
      return this.lastClick = {
        timestamp: Date.now(),
        pageX: event.pageX,
        pageY: event.pageY
      };
    };

    Modal.prototype.onMouseUp = function(event) {
      var distance, duration;
      duration = Date.now() - this.lastClick.timestamp;
      distance = Math.sqrt(Math.pow(event.pageX - this.lastClick.pageX, 2) + Math.pow(event.pageY - this.lastClick.pageY, 2));
      if (duration < MAX_CLICK_DURATION && distance < MAX_CLICK_DISTANCE) {
        event.stopPropagation();
        event.preventDefault();
        return this.hide();
      }
    };

    Modal.prototype.show = function() {
      return this.$el.addClass("active");
    };

    Modal.prototype.hide = function() {
      return this.$el.removeClass("active");
    };

    return Modal;

  })(App.Views.Page);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Views.Main = (function(_super) {
    __extends(Main, _super);

    function Main() {
      return Main.__super__.constructor.apply(this, arguments);
    }

    Main.prototype.template = _.loadTemplate("templates/mobile/main");

    Main.prototype.layout = {
      "container": App.Views.Container,
      "modal": App.Views.Modal
    };

    Main.prototype.events = {
      "click a[sref]": "loadState",
      "click a[href^='#']": "closeSidebar"
    };

    Main.prototype.loadState = function(event) {
      var url;
      url = $(event.currentTarget).attr("sref");
      Backbone.history.loadUrl(url);
      return event.preventDefault();
    };

    Main.prototype.toggleSidebar = function() {
      return this.views["container"].toggleSidebar();
    };

    Main.prototype.openSidebar = function() {
      return this.views["container"].openSidebar();
    };

    Main.prototype.closeSidebar = function() {
      return this.views["container"].closeSidebar();
    };

    Main.prototype.openModal = function(view) {
      return this.views["modal"].render(view).show();
    };

    Main.prototype.closeModal = function() {
      return this.views["modal"].hide();
    };

    Main.prototype.openPage = function(view) {
      return this.views["container"].render(view);
    };

    return Main;

  })(Backbone.View);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      "toggle-sidebar": "toggleSidebar",
      "close-modal": "closeModal",
      "units": "openUnitsIndexPage",
      "units/:id": "openUnitsShowPage",
      "monsters": "openMonstersIndexPage",
      "monsters/:id": "openMonstersShowPage",
      "!*otherwise": "removeExclamationMark",
      "*otherwise": "index"
    };

    Router.prototype.toggleSidebar = function() {
      return App.main.toggleSidebar();
    };

    Router.prototype.closeModal = function() {
      return App.main.closeModal();
    };

    Router.prototype.index = function() {
      return this.navigate("#units", true);
    };

    Router.prototype.removeExclamationMark = function(path) {
      return this.navigate(path, true);
    };

    Router.prototype.openCollectionPage = function(key, collection, page) {
      var view;
      if (App[key] == null) {
        App[key] = new App.Collections[collection]();
        App[key].fetch({
          reset: true
        });
      }
      view = new App.Pages[page]({
        collection: App[key]
      });
      App.main.openPage(view.render());
      return this.track();
    };

    Router.prototype.openModelPage = function(key, collection, page, id) {
      var model, view;
      if (App[key] == null) {
        return this.navigate("#" + key, true);
      }
      model = App[key].get(id);
      view = new App.Pages[page]({
        model: model
      });
      App.main.openModal(view.render());
      return this.track();
    };

    Router.prototype.openUnitsIndexPage = function() {
      return this.openCollectionPage("units", "Units", "UnitsIndex");
    };

    Router.prototype.openUnitsShowPage = function(id) {
      return this.openModelPage("units", "Units", "UnitsShow", id);
    };

    Router.prototype.openMonstersIndexPage = function() {
      return this.openCollectionPage("monsters", "Monsters", "MonstersIndex");
    };

    Router.prototype.openMonstersShowPage = function(id) {
      return this.openModelPage("monsters", "Monsters", "MonstersShow", id);
    };

    Router.prototype.track = function() {
      var url;
      if (typeof ga !== "undefined" && ga !== null) {
        url = Backbone.history.getFragment();
        if (!/^\//.test(url)) {
          url = '/' + url;
        }
        return ga('send', {
          hitType: 'pageview',
          page: url
        });
      }
    };

    return Router;

  })(Backbone.Router);

}).call(this);
















