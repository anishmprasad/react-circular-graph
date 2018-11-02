"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _defaultsDeep = require("lodash/fp/defaultsDeep");

var _defaultsDeep2 = _interopRequireDefault(_defaultsDeep);

var _isEqual = require("lodash/isEqual");

var _isEqual2 = _interopRequireDefault(_isEqual);

var _differenceWith = require("lodash/differenceWith");

var _differenceWith2 = _interopRequireDefault(_differenceWith);

var _uuid = require("uuid");

var _uuid2 = _interopRequireDefault(_uuid);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

// require('zone.js/dist/zone-node.js');


// var _data = require('./data.json');

// var _data2 = _interopRequireDefault(_data);

// var _config = require('./config');

// var _utilsService = require('./utils-service');

// var _deeplinkService = require('./deeplink-service');

// var _selectedNode = require('./selected-node');

// var _selectedNode2 = _interopRequireDefault(_selectedNode);


function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Vector math helper class for 2d animation.
 */
var Vector = function () {
  function Vector(x, y, z) {
    _classCallCheck(this, Vector);

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }

  _createClass(Vector, [{
    key: 'copy',
    value: function copy() {
      return new Vector(this.x, this.y, this.z);
    }
  }, {
    key: 'mag',
    value: function mag() {
      return Math.sqrt(this.magSq());
    }
  }, {
    key: 'magSq',
    value: function magSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
  }, {
    key: 'normalize',
    value: function normalize() {
      this.div(this.mag());
      return this;
    }
  }, {
    key: 'add',
    value: function add(p) {
      this.x += p.x;
      this.y += p.y;
      this.z += p.z;
      return this;
    }
  }, {
    key: 'sub',
    value: function sub(p) {
      this.x -= p.x;
      this.y -= p.y;
      this.z -= p.z;
      return this;
    }
  }, {
    key: 'mult',
    value: function mult(n) {
      this.x *= n;
      this.y *= n;
      this.z *= n;
      return this;
    }
  }, {
    key: 'div',
    value: function div(n) {
      this.x /= n;
      this.y /= n;
      this.z /= n;
      return this;
    }
  }]);

  return Vector;
}();


/**
 * Animation class for the individual projects displayed by the explore canvas
 * view.  (
 *
 * This controls the "particle physics simulation" of the small circles,
 * attempting to keep them going in a ring, as they are affected by
 * "forces" triggered by mouse actions and clicks.
 */


var ProjectNode = function () {
  function ProjectNode(data) {
    var _this2 = this;

    _classCallCheck(this, ProjectNode);

    this.data = data;

    this.RING_RADIUS = 265;
    this.MAX_LINK_LENGTH = 290;
    this.MOUSE_HOVER_DIST = 120;
    this.CLICKABLE_RADIUS_ADD = 0;
    this.IDLE_DRAG = 0.02;
    this.ACTIVE_DRAG = 0.5;
    this.ACTIVE_RADIUS = 175;
    this.STROKE_WIDTH = 10;

    var startAngle = Math.random() * Math.PI * 2;
    var startRadius = Math.random() * 20;
    var fallbackImg = 'https://opensource.google.com/assets/images/alphabet/' + this.data.startsWith + '.gif';

    if (!this.data.lame && !this.data.small) {
      this.IDLE_RADIUS = 30;
    } else if (!this.data.lame && !this.active && this.data.small) {
      this.IDLE_RADIUS = 7;
      this.STROKE_WIDTH = 6;
    } else {
      this.STROKE_WIDTH = 5 - Math.floor(Math.random() * (3 - 0 + 1)) + 0;
      this.IDLE_RADIUS = 25 - (Math.floor(Math.random() * (22 - 17 + 1)) + 17);
    }

    this.emptyVector = new Vector(0, 0, 0);
    this.hoverState = 0;
    this.fadeCount = 0;
    this.start = new Date();
    this.age = 0;
    this.pos = new Vector(Math.cos(startAngle), Math.sin(startAngle), 0);
    this.pos = this.pos.mult(startRadius);
    this.vel = new Vector(0, 0, 0);
    this.acc = new Vector(0, 0, 0);
    this.radius = this.IDLE_RADIUS;
    this.center = new Vector(0, 0, 0);
    this.active = false;
    this.thumbImg = document.createElement('img');

    if (typeof this.data.iconUrlSmall !== 'undefined' && !this.data.lame) {
      this.thumbImg.src = this.data.iconUrlSmall;
    } else if (this.data.startsWith) {
      this.thumbImg.src = fallbackImg;
    }

    this.thumbImg.addEventListener('error', function () {
      _this2.thumbImg.src = fallbackImg;
    });
  }

  _createClass(ProjectNode, [{
    key: 'getAge',
    value: function getAge() {
      return new Date().getTime() - this.start;
    }
  }, {
    key: 'applyForces',
    value: function applyForces() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc = new Vector(0, 0, 0);
    }
  }, {
    key: 'update',
    value: function update(hovered) {
      if (this.active) {
        this.STROKE_WIDTH = 10;
      } else if (!this.data.lame && this.data.small) {
        this.STROKE_WIDTH = 6;
      }

      this.age += 1;
      this.applyForces();
      this.updateLerps();
      this.drag(this.active ? this.ACTIVE_DRAG : this.IDLE_DRAG);

      if (!this.active) {
        if (!hovered) {
          this.jitter(0.15);
          this.keepInRing(this.RING_RADIUS, 0.00007);
          this.rotate(0.002);
        }
      } else {
        this.moveToCenter();
      }

      this.updateLink();
    }
  }, {
    key: 'moveToCenter',
    value: function moveToCenter() {
      this.pos.mult(0.85).add(this.center.mult(0.15));
    }
  }, {
    key: 'updateMousePos',
    value: function updateMousePos(mousePos) {
      if (!mousePos || this.data.lame) {
        return;
      }
      var diff = this.pos.copy().sub(mousePos);

      this.hoverState = Math.max((this.MOUSE_HOVER_DIST - diff.mag()) / this.MOUSE_HOVER_DIST, 0);
      this.hoverState *= Math.max(0, Math.min(1, (this.getAge() - 1000) / 5000));
    }
  }, {
    key: 'updateLerps',
    value: function updateLerps() {
      var targetRadius = this.active ? this.ACTIVE_RADIUS : this.IDLE_RADIUS;
      this.radius = targetRadius * 0.1 + this.radius * 0.9;
    }
  }, {
    key: 'hitTest',
    value: function hitTest(x, y) {
      return new Vector(x, y, 0).sub(this.pos).mag() < this.getDisplayRadius() + this.CLICKABLE_RADIUS_ADD;
    }
  }, {
    key: 'onClick',
    value: function onClick() {
      if (this.active) {
        this.deactivate();
      } else {
        this.activate();
      }
    }
  }, {
    key: 'activate',
    value: function activate() {
      if (!this.data.lame) {
        this.active = true;
      }
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      this.active = false;
    }
  }, {
    key: 'getDisplayRadius',
    value: function getDisplayRadius() {
      var r = this.radius;
      if (!this.active && !this.data.lame) {
        if (this.data.small) {
          r += (this.hoverState || 0) * 26;
        } else {
          r += (this.hoverState || 0) * 10;
        }
      }
      return r;
    }
  }, {
    key: 'keepInRing',
    value: function keepInRing(radius, amt) {
      var diff = this.pos.copy();
      var mag = diff.mag();
      var force = amt * (radius - mag);
      // avoid divide by zero. #jitter() should take care of moving it off the
      // origin
      if (mag != 0) {
        diff.normalize().mult(force);
      }
      if (mag < 80) {
        diff.mult(10); // push out faster from center on load
      }
      this.acc.add(diff);
    }
  }, {
    key: 'jitter',
    value: function jitter(amt) {
      var force = new Vector(Math.random() - 0.5, Math.random() - 0.5, 0);
      force.mult(amt);
      this.acc.add(force);
    }
  }, {
    key: 'drag',
    value: function drag(amt) {
      this.vel.mult(1 - amt);
    }
  }, {
    key: 'rotate',
    value: function rotate(amt) {
      var force = this.pos.copy();
      var _ref = [-force.y, force.x];
      force.x = _ref[0];
      force.y = _ref[1];

      force.mult(amt);
      this.pos.add(force);
    }
  }, {
    key: 'render',
    value: function render(ctx) {
      var r = this.getDisplayRadius();
      var alpha = this.data.small && !this.data.focus ? .65 : .5;

      ctx.save();
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, r, 0, Math.PI * 2, true);
      ctx.fillStyle = this.data.lame ? '#ececec' : 'rgba(' + this.data.RGB.r + ',' + this.data.RGB.g + ',' + this.data.RGB.b + ',' + alpha + ')';

      ctx.fill();
      this.renderWhiteFill(ctx);

      if (!this.data.small || this.active || this.data.lame || this.data.focus) {
        // Wait a tick before drawing the logo
        if (!this.active && !this.data.lame && this.fadeCount >= .5) {
          this.renderLogo(ctx);
        }
      }
      ctx.closePath();
      ctx.restore();
    }
  }, {
    key: 'renderWhiteFill',
    value: function renderWhiteFill(ctx) {
      var r = this.getDisplayRadius();
      r = this.getDisplayRadius() > this.STROKE_WIDTH / 2 ? r - this.STROKE_WIDTH / 2 : r;

      ctx.globalAlpha = this.active ? 1 : this.fadeCount;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, r, 0, Math.PI * 2, true);
      ctx.fillStyle = 'white';
      ctx.fill();

      if (this.fadeCount < 1) {
        this.fadeCount += .05;
      }
    }
  }, {
    key: 'renderLogo',
    value: function renderLogo(ctx) {
      var logoSize = this.getDisplayRadius() / 1.05;
      var logoPos = {
        x: this.pos.x - logoSize / 2,
        y: this.pos.y - logoSize / 2
      };

      ctx.globalAlpha = this.fadeCount <= .9 ? this.fadeCount : .9;
      ctx.drawImage(this.thumbImg, logoPos.x, logoPos.y, logoSize, logoSize);

      // Colorize fallback logo on non-IE browsers
      if (typeof this.data.iconUrlSmall == 'undefined' && navigator.userAgent.indexOf('MSIE') == -1) {
        ctx.globalCompositeOperation = 'lighten';
        ctx.fillStyle = this.data.fallbackColor;
        ctx.fillRect(logoPos.x, logoPos.y, logoSize, logoSize);
      }
    }
  }, {
    key: 'getLineStart',
    value: function getLineStart() {
      return new Vector(this.pos.x, this.pos.y, 0);
    }
  }, {
    key: 'getLineEnd',
    value: function getLineEnd() {
      return new Vector(this.link.pos.x, this.link.pos.y, 0);
    }
  }, {
    key: 'getDotAlpha',
    value: function getDotAlpha() {
      return Math.min(1, this.age / 10);
    }
  }, {
    key: 'getLinkAlpha',
    value: function getLinkAlpha() {
      var distance = this.pos.copy().sub(this.link.pos).mag();
      return Math.max(0, (this.MAX_LINK_LENGTH - distance) / this.MAX_LINK_LENGTH);
    }
  }, {
    key: 'renderLink',
    value: function renderLink(ctx, filter) {
      if (this.link != null && !this.data.lame) {
        ctx.save();
        ctx.beginPath();
        this.doLinkPath(ctx);
        ctx.strokeStyle = '#ececec';
        ctx.globalAlpha = this.getLinkAlpha();
        ctx.lineWidth = this.STROKE_WIDTH - 8;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
      }
    }
  }, {
    key: 'doLinkPath',
    value: function doLinkPath(ctx) {
      var start = this.getLineStart();
      var end = this.getLineEnd();

      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
    }
  }, {
    key: 'updateLink',
    value: function updateLink() {
      var ref = void 0;
      if (((ref = this.link) != null ? ref.pos.copy().sub(this.pos).mag() : void 0) > this.MAX_LINK_LENGTH) {
        this.killLink();
      }
    }
  }, {
    key: 'linkTo',
    value: function linkTo(node) {
      if (!node.data.lame) {
        this.linkStartTime = new Date();
        this.link = node;
      }
    }
  }, {
    key: 'killLink',
    value: function killLink() {
      this.link = null;
    }
  }]);

  return ProjectNode;
}();


// ProjectExplore.prototype.onDestroy = function () {
//   this.done = true;
// };

var ReactCircularGraph = function (_Component) {
  _inherits(ReactCircularGraph, _Component);

  function ReactCircularGraph(props) {
    _classCallCheck(this, ReactCircularGraph);

    var _this = _possibleConstructorReturn(this, (ReactCircularGraph.__proto__ || Object.getPrototypeOf(ReactCircularGraph)).call(this, props));
    var _this = this;
    this.AMBIENCE_RANDOM_ACTION_INTERVAL = 1000;
    this.AMBIENCE_WAIT_AFTER_USER_INPUT = 7000;
    this.LAME_NODE_COUNT = 25;
    this.canvas;
    this.done = false;
    this.timer = window.requestAnimationFrame;
    this.frameCount = 0;
    this.nodes = [];
    this.activeNode;
    this.hoveredNode;
    this.nextActionTime;
    this.formVisible;
    this.mousePos;
    this.globalMousePos;
    this.hovered = false;
    this.pauseInteraction = false;
    this.selected_project = {};
    this.selected_project_changed = false;
    this.hovered_project = {};
    this.projects_subscription;
    this.config_service = this.props.config;
    this.canvas_width = this.props.width;
    this.canvas_height = this.props.height;
    return _this;
  }

  _createClass(ReactCircularGraph, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.updateCanvas();
    }
  }, {
    key: "updateCanvas",
    value: function updateCanvas() {

      var _this4 = this;

      if (window.innerWidth < this.props.config.MOBILE_WIDTH) {
        this.navigateToListView();
      } else {
        window.addEventListener('resize', function () {
          if (window.innerWidth < _this4.config_service.MOBILE_WIDTH && _this4.router.url.indexOf('explore') > 0) {
            _this4.navigateToListView();
          }
        });
      }

      var dpi = 1;
      // this.canvas = document.getElementById("canvasEL");
      // Size the canvas based on device dpi
      this.refs.canvas.width = this.canvas_width * dpi;
      this.refs.canvas.height = this.canvas_height * dpi;

      // Set 2d rendering context
      this.context = this.refs.canvas.getContext('2d');
      this.context.scale(dpi, dpi);

      this.done = false;

      // Reset language filters
      // this.languages_service.selectedLanguages = [];

      // Listen for projects to come back from API

      this.selectNone();
      this.loadProjects(this.props.data);
      this.doRandomAction();
      this.refs.canvas.dispatchEvent(new Event('mousemove'));

      this.refs.canvas.addEventListener('mousemove', (event) => {
        console.log('mousemove')
        this.moveHandler(event)
      })
      this.refs.canvas.addEventListener('click', (event) => {
        this.clickHandler(event)
      })
      this.refs.canvas.addEventListener('mouseover', (event) => {
        this.pauseInteraction = true;
      })
      this.refs.canvas.addEventListener('mouseout', (event) => {
        this.pauseInteraction = false;
      })
      // return setInterval(() => {this.update()}, 1000/60)
      return requestAnimationFrame(this.update.bind(this));
    }
  }, {
    /**
   * Gets projects from `projects_service` and creates a new `ProjectNode` for
   * each.
   */
    key: "loadProjects",
    value: function loadProjects(p) {
      var projects = p.slice();
      var lame_node = { lame: true };
      var _that = this;
      _that.nodes = [];
      var lame_index = 0;

      while (lame_index < this.LAME_NODE_COUNT) {
        projects.push(lame_node);
        lame_index++;
      }

      projects.forEach(function (project, index) {
        if (index > 15 && !project.lame) {
          project.small = true;
        }
        _that.nodes.push(new ProjectNode(project));
      });
    }
  }, {
    /**
   * Activates a random node.
   *
   * This method controls which nodes end up in the center, and for how
   * long (unless overridden by user input.)
   */
    key: "doRandomAction",
    value: function doRandomAction() {
      var node = void 0;
      var filteredNodes = this.filterLames();
      if (this.pauseInteraction) {
        return;
      }

      if (this.getActiveNodes().length) {
        // make the current node leave the center and schedule the next
        // action.
        this.setNextActionDelay(this.AMBIENCE_RANDOM_ACTION_INTERVAL);
        return this.selectNone();
      } else {
        // pick a random node to display in the center
        node = filteredNodes[Math.floor(Math.random() * filteredNodes.length)];
        if (node != null) {
          this.setNextActionDelay(this.AMBIENCE_WAIT_AFTER_USER_INPUT);
          node.activate();
          this.selectProject(node);
        }
      }
    }
  }, {
    /**
   * Filters out the grey (lame) nodes.
   */
    key: "filterLames",
    value: function filterLames() {
      return this.nodes.filter(function (node) {
        return !node.data.lame;
      });
    }
  }, {
    /**
 * Filters nodes by `active` attribute.
 */
    key: "getActiveNodes",
    value: function getActiveNodes() {
      return this.nodes.filter(function (n) {
        return n.active;
      });
    }
  }, {
    /**
 * Sets `nextActionTime` Date object.
 * @param offset  in milliseconds
 */
    key: "setNextActionDelay",
    value: function setNextActionDelay(offset) {
      this.nextActionTime = new Date(new Date().getTime() + offset);
    }
  }, {
    /**
 * Sets `nextActionTime` Date object and selects active node.
 */
    key: "userActionOccurred",
    value: function userActionOccurred() {
      this.setNextActionDelay(this.AMBIENCE_WAIT_AFTER_USER_INPUT);
      this.activeNode = this.getActiveNodes()[0];
    }


  }, {
    /**
 * Selects active node.
 */
    key: "ambientActionOccurred",
    value: function ambientActionOccurred() {
      this.activeNode = this.getActiveNodes()[0];
    }
  }, {
    /**
     * Gets `nextActionTime` Date object minus current time.
     */
    key: "timeUntilNextAction",
    value: function timeUntilNextAction() {
      return this.nextActionTime - new Date().getTime();
    }
  }, {

    /**
     * Does random action when `timeUntilNextAction` gets to 0.
     */
    key: "updateAmbience",
    value: function updateAmbience() {
      if (this.timeUntilNextAction() < 0) {
        this.doRandomAction();
        return this.ambientActionOccurred();
      }
    }
  }, {
    /**
      * Global click handler. Determines coordinates of click, whether a node was
      * clicked, and routes the action accordingly.
      * @param evt  click event.
      */
    key: "clickHandler",
    value: function clickHandler(evt) {
      var box = this.refs.canvas.getBoundingClientRect();
      var coords = {
        x: evt.pageX - box.left - window.pageXOffset,
        y: evt.pageY - box.top - window.pageYOffset
      };
      var clicked_node = this.getNodeUnder(coords.x - this.canvas_width / 2, coords.y - this.canvas_height / 2);
      if (clicked_node) {
        if (clicked_node.active) {
          clicked_node.onClick();
        } else {
          this.selectNone();
          clicked_node.onClick();
          this.selectProject(clicked_node);
        }
        // this.utils_service.trackEvent(
        //     'Projects_Explore', 'Click', 'Bubble ' + clicked_node.data.name);
      } else {
        this.selectNone();
      }
      this.userActionOccurred();
    }
  }, {

    /*
    * Navigate to the list view.
    */
    key: "navigateToListView",
    value: function navigateToListView() {
      this.projects_service.requestParams.page_size = this.config_service.LIST_PAGE_SIZE;
      // this.router.navigate(['/list', 'featured']);
    }
  }, {

    /**
     * Global mouse move handler. Determines coordinates of mouse and updates the
     * `globalMousePos` and `mousePos` objects.
     * @param evt  mouse move event.
     */
    key: "moveHandler",
    value: function moveHandler(evt) {
      this.hoveredNode = this.mousePos ? this.getNodeUnder(this.mousePos.x, this.mousePos.y) : null;

      var box = this.refs.canvas.getBoundingClientRect();
      this.globalMousePos = {
        x: evt.pageX - box.left - window.pageXOffset,
        y: evt.pageY - box.top - window.pageYOffset
      };
      this.mousePos = new Vector(this.globalMousePos.x - this.canvas_width / 2, this.globalMousePos.y - this.canvas_height / 2, 0);
      evt.preventDefault();
      evt.stopPropagation();
    }

  }, {
    /**
     * Figures out which node (project) was hovered.
     * @param evt  click event.
     */
    key: "hoverHandler",
    value: function hoverHandler() {
      if (!this.mousePos) {
        return;
      }
      var new_hovered_node = this.getNodeUnder(this.mousePos.x, this.mousePos.y);
      this.clearHoverStyles();

      if (this.hoveredNode && new_hovered_node) {
        this.setHoverStyles(new_hovered_node);
      }

      if (!this.hovered && this.hoveredNode && this.hoveredNode.data.small) {
        this.hoveredNode.fadeCount = 0;
      }
    }
  }, {
    /**
     * Sets styles when a node is hovered.
     * @param new_hovered_node  project node being hovered.
     */
    key: "setHoverStyles",
    value: function setHoverStyles(new_hovered_node) {
      this.refs.canvas.style.cursor = 'pointer';
      this.hovered_project = new_hovered_node;

      if (new_hovered_node.data.name != this.hoveredNode.data.name && this.hoveredNode.small) {
        new_hovered_node.data.focus = true;
        new_hovered_node.fadeCount = 0;
        this.hoveredNode.data.focus = false;
      } else {
        new_hovered_node.data.focus = false;
        this.hoveredNode.data.focus = true;
      }
      this.hovered = true;
    }
  }, {
    /**
     * Modulo function
     * @param a  dividend
     * @param b  divisor
     * @returns Remainder of quotient a / b.
     */
    key: "modulo",
    value: function modulo(a, b) {
      return (+a % (b = +b) + b) % b;
    }
  }, {
    /**
     * Carousel algorithm to next/back through projects.
     * @param direction  iterator to go up or down `+1` or `-1`.
     * @param $event  mouse event.
     */
    key: "clickedArrow",
    value: function clickedArrow(direction, $event) {
      var currentIndex = 0;
      var newIndex;
      var chosen;
      var filteredNodes = this.filterLames();

      filteredNodes.forEach(function (node, index) {
        if (node.active) {
          currentIndex = index;
        }
      });

      newIndex = this.modulo(currentIndex + direction, filteredNodes.length);
      this.selectNone();
      chosen = filteredNodes[newIndex];
      chosen.activate();
      this.selectProject(chosen);
      this.userActionOccurred();

      // this.utils_service.trackEvent(
      // 'Projects_Explore', 'Click', 'Cycle ' + direction);

      $event.stopPropagation();
    }
  }, {
    /**
     * Navigate to a project's details page.
     * @param evt  mouse event.
     */
    key: "loadProjectDetails",
    value: function loadProjectDetails(evt) {
      this.projects_service.cachedColor = this.selected_project.fallbackColor || this.selected_project.primaryColor;

      // this.router.navigate(['/', this.selected_project.id]);

      // this.utils_service.trackEvent(
      //     'Projects_Explore', 'Click', 'View ' + this.selected_project.name);
      evt.preventDefault();
      evt.stopPropogation;
    }
  }, {
    /**
     * Select the node under a specific x, y coordinate.
     * @param x  x coord.
     * @param y  y coord.
     */
    key: "getNodeUnder",
    value: function getNodeUnder(x, y) {
      var nodes = [];
      var chosen = null;

      for (var i = this.nodes.length - 1; i >= 0; i += -1) {
        var n = this.nodes[i];
        if (n.hitTest(x, y) && !n.data.lame) {
          nodes.push(n);
        }
      }
      nodes.forEach(function (node) {
        if (!node.data.small) {
          chosen = node;
        }
      });
      return nodes.length && !chosen ? nodes[0] : chosen;
    }
  }, {
    /**
      * Draws lines from/to random project nodes.
      */
    key: "createLinks",
    value: function createLinks() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var n = _step.value;

          if (n.link != null) {
            continue;
          }
          // # continue if Math.random() > 0.9
          n.linkTo(this.nodes[Math.floor(Math.random() * this.nodes.length)]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    /**
     * Removes styles when a node is NOT hovered.
     */
    key: "clearHoverStyles",
    value: function clearHoverStyles() {
      this.refs.canvas.style.cursor = 'default';
      this.nodes.forEach(function (node) {
        node.data.focus = false;
      });
      this.hovered = false;
    }
  }, {

    /**
     * Selects a given node (project).
     * @param node  the project object to be selected.
     */
    key: "selectProject",
    value: function selectProject(node) {
      var _this3 = this;
      this.props.selectedNode && this.props.selectedNode(node)
      this.selected_project = node.data;
      setTimeout(function () {
        _this3.selected_project_changed = true;
      }, 200);
    }
  }, {
    /**
     * Deselects all nodes.
     */
    key: "selectNone",
    value: function selectNone() {
      this.selected_project = {};
      this.selected_project_changed = false;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var n = _step2.value;

          n.deactivate();
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    /**
     * update is the body of the animation loop. Controls canvas rendering.
     * Called once every timer tick.
     */
    key: "update",
    value: function update() {
      if (this.done) {
        return;
      }
      this.canvasrender(this.context);
      this.hoverHandler();

      if (this.nodes.length) {
        this.frameCount += 1;
      }

      if (this.frameCount == 1) {
        this.ambientActionOccurred();
      }

      this.createLinks();

      this.nodes.forEach(function (node) {
        node.updateMousePos(this.mousePos);
        node.update(this.hoveredNode == node);
      }.bind(this));

      this.updateAmbience();
      // return setInterval(()=>{this.update()},1000/60)
      return requestAnimationFrame(this.update.bind(this));
    }
  }, {
    /**
     * The canvas renderer. Everything is drawn into the canvas here.
     */
    key: "canvasrender",
    value: function canvasrender(ctx) {
      ctx.clearRect(0, 0, this.canvas_width, this.canvas_height);
      ctx.save();
      ctx.translate(this.canvas_width / 2, this.canvas_height / 2);

      // Lines on bottom
      // FF Can't deal with stroked shapes
      if ("chrome" !== 'Firefox') {
        this.nodes.forEach(function (node, index) {
          node.renderLink(ctx);
        });
      }

      // Lame (gray non-interactive) nodes next
      this.nodes.forEach(function (node, index) {
        if (node.data.lame && !node.active) {
          node.render(ctx);
        }
      });

      // Then small colored project nodes
      this.nodes.forEach(function (node, index) {
        if (!node.data.lame && !node.active && node.data.small) {
          node.render(ctx);
        }
      });

      // Then large colored project nodes with logo
      this.nodes.forEach(function (node, index) {
        if (!node.data.lame && !node.active && !node.data.small && !node.data.focus) {
          node.render(ctx);
        }
      });

      // Hovered next
      this.nodes.forEach(function (node, index) {
        if (!node.data.lame && !node.active && node.data.focus) {
          node.render(ctx);
        }
      });

      // Selected node on top
      this.nodes.forEach(function (node, index) {
        if (!node.data.lame && node.active) {
          node.render(ctx);
        }
      });

      ctx.restore();
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {

    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {

    }
  }, {
    key: "render",
    value: function render() {
      var width = this.props.width;
      var height = this.props.height;

      return _react2.default.createElement('canvas', { ref: 'canvas', width: width, height: height });
    }
  }]);

  return ReactCircularGraph;
}(_react.Component);

ReactCircularGraph.defaultProps = {
  width: 720,
  height: 720,
  data: [
    {
      "id": "science-journal-arduino",
      "name": "science-journal-arduino",
      "summary": "Science Journal Arduino Firmware",
      "startsWith": "s",
      "fallbackColor": "#EA4335",
      "RGB": {
        "r": 234,
        "g": 67,
        "b": 53
      }
    },
  ]
};
ReactCircularGraph.propTypes = {
  width: _propTypes2.default.number,
  height: _propTypes2.default.number,
  data: _propTypes2.default.array.isRequired,
  config: _propTypes2.default.object,
  selectedNode: _propTypes2.default.func
};

exports.default = ReactCircularGraph;