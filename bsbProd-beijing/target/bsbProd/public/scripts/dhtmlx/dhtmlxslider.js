

function dhtmlxSlider(parentNod, size, skin, vertical, min, max, value, step) {
    if (_isIE)
        try {
            document.execCommand("BackgroundImageCache", false, true)
        } catch (e) {
        };
    if (!parentNod) {
        var z = "slider_div_" + (new Date()).valueOf() + Math.random(1000);
        var parentNod = document.createElement("div");
        parentNod.setAttribute("id", z);
        var child = document.body.lastChild;
        while (child.lastChild && child.lastChild.nodeType == 1)
            child = child.lastChild;
        child.parentNode.insertBefore(parentNod, child)
    } else if (typeof(parentNod) != "object")
        parentNod = document.getElementById(parentNod);
    if (typeof(size) == "object") {
        skin = size.skin;
        min = size.min;
        max = size.max;
        step = size.step;
        vertical = size.vertical;
        value = size.value;
        size = size.size
    };
    this.size = size;
    this.value = value || 0;
    this.vMode = vertical || false;
    this.skin = dhtmlx.skin || skin || "default";
    this.parent = parentNod;
    this.isInit = false;
    this.disabled = false;
    this.value = value || min || 0;
    this.inputPriority = true;
    this.stepping = false;
    this.imgURL = window.dhx_globalImgPath || dhtmlx.image_path || "";
    this._skinsImgs = {
        "default" : {
            ls : 1,
            lz : 1,
            rz : 1,
            rs : 1
        },
        ball : {
            ls : 1,
            lz : 1,
            rz : 1,
            rs : 1
        },
        zipper : {
            bg : 1,
            lz : 1,
            rz : 1
        },
        arrow : {
            bg : 1,
            ls : 1,
            rs : 1
        },
        arrowgreen : {
            bg : 1,
            ls : 1,
            rs : 1
        },
        simplesilver : {
            lz : 1,
            ls : 1,
            rs : 1,
            rz : 1
        },
        simplegray : {
            lz : 1,
            ls : 1,
            rs : 1,
            rz : 1
        },
        bar : {
            bg : 1,
            ls : 1,
            rs : 1
        },
        dhx_skyblue : {
            bg : 1,
            ls : 1,
            rs : 1
        }
    };
    this._def = [min, max, step, value, size];
    dhtmlxEventable(this);
    return this
};
dhtmlxSlider.prototype.createStructure = function() {
    if (this.con) {
        this.con.parentNode.removeChild(this.con);
        this.con = null
    };
    if (this.vMode) {
        this._sW = "height";
        this._sH = "width";
        this._sL = "top";
        this._sT = "left";
        var skinImgPath = this.imgURL + "skins/" + this.skin + "/vertical/"
    } else {
        this._sW = "width";
        this._sH = "height";
        this._sL = "left";
        this._sT = "top";
        var skinImgPath = this.imgURL + "skins/" + this.skin + "/"
    };
    this.con = document.createElement("DIV");
    this.con.onselectstart = function() {
        return false
    };
    this.con._etype = "slider";
    this.con.className = "dhtmlxSlider" + (this.skin != 'default' ? "_" + this.skin : "");
    if (this._skinsImgs[this.skin]['bg'])
        this.con.style.backgroundImage = "url(" + skinImgPath + "bg.gif)";
    this.drag = document.createElement("DIV");
    this.drag._etype = "drag";
    this.drag.className = "selector";
    this.drag.style.backgroundImage = "url(" + skinImgPath + "selector.gif)";
    var leftSide = document.createElement("DIV");
    leftSide.className = "leftSide";
    if (this._skinsImgs[this.skin]['ls'])
        leftSide.style.background = "url(" + skinImgPath + "leftside_bg.gif)";
    this.leftZone = document.createElement("DIV");
    this.leftZone.className = "leftZone";
    if (this._skinsImgs[this.skin]['lz'])
        this.leftZone.style.background = "url(" + skinImgPath + "leftzone_bg.gif)";
    this.leftZone.style.width = this.value + 'px';
    var rightSide = document.createElement("DIV");
    rightSide.className = "rightSide";
    if (this._skinsImgs[this.skin]['rs'])
        rightSide.style.background = "url(" + skinImgPath + "rightside_bg.gif)";
    this.rightZone = document.createElement("DIV");
    this.rightZone.className = "rightZone";
    if (this._skinsImgs[this.skin]['rz'])
        this.rightZone.style.background = "url(" + skinImgPath + "rightzone_bg.gif)";
    this.con.appendChild(leftSide);
    this.con.appendChild(this.leftZone);
    this.con.appendChild(this.rightZone);
    this.con.appendChild(rightSide);
    this.con.appendChild(this.drag);
    this.parent.appendChild(this.con);
    if (!this.parent.parentNode || !this.parent.parentNode.tagName)
        document.body.appendChild(this.parent);
    if (this.vMode) {
        this._sW = "height";
        this._sH = "width";
        this._sL = "top";
        this._sT = "left";
        this.con.style.width = this.con.offsetHeight + 'px';
        for (var i = 0; i < this.con.childNodes.length; i++) {
            this.con.childNodes[i].style.fontSize = "0";
            var tmp = this.con.childNodes[i].offsetWidth;
            this.con.childNodes[i].style.width = this.con.childNodes[i].offsetHeight + 'px';
            this.con.childNodes[i].style.height = tmp + 'px';
            tmp = this.con.childNodes[i].offsetLeft;
            this.con.childNodes[i].style.left = this.con.childNodes[i].offsetTop + 'px';
            this.con.childNodes[i].style.top = tmp + 'px'
        };
        rightSide.style.top = this.size - rightSide.offsetHeight + 'px';
        this.zoneSize = this.size - rightSide.offsetHeight;
        this.dragLeft = this.drag.offsetTop;
        this.dragWidth = this.drag.offsetHeight;
        this.rightZone.style.height = this.zoneSize + 'px'
    } else {
        this.zoneSize = this.size - rightSide.offsetWidth;
        this.dragLeft = this.drag.offsetLeft;
        this.dragWidth = this.drag.offsetWidth;
        this.rightZone.style.width = this.zoneSize + 'px'
    };
    this.con.style[this._sW] = this.size + "px";
    this.con.onmousedown = this._onMouseDown;
    this.con.onmouseup = this.con.onmouseout = function() {
        clearInterval(this.that._int)
    };
    this.con.that = this;
    this._aCalc(this._def)
};
dhtmlxSlider.prototype._aCalc = function(def) {
    if (!this.isInit)
        return;
    this.shift = def[0] || 0;
    this.limit = (def[1] || 100) - this.shift;
    this._mod = (def[4] - this.dragLeft * 2 - this.dragWidth) / this.limit;
    this._step = (def[2] || 1);
    this.step = this._step * this._mod;
    this._xlimit = def[4] - this.dragLeft * 2 - this.dragWidth;
    if (!this.posX)
        this.posX = this._xlimit * ((def[3] || 0) - this.shift) / this.limit;
    this._applyPos(true);
    return this
};
dhtmlxSlider.prototype.setMin = function(val) {
    this._def[0] = val;
    this._aCalc(this._def)
};
dhtmlxSlider.prototype.setMax = function(val) {
    this._def[1] = val;
    this._aCalc(this._def)
};
dhtmlxSlider.prototype.setStep = function(val) {
    this._def[2] = val;
    this._aCalc(this._def)
};
dhtmlxSlider.prototype._applyPos = function(skip) {
    if (!this.isInit)
        return;
    if (this.step != 1)
        this.posX = Math.round(this.posX / this.step) * this.step;
    if (this.posX < 0)
        this.posX = 0;
    if (this.value < (this._def[0] || 0))
        this.value = this._def[0] || 0;
    if (this.value < this._def[3])
        this.value = this._def[3];
    if (this.value > this._def[1])
        this.value = this._def[1];
    if (this.posX > this._xlimit)
        this.posX = this._xlimit;
    var a_old = this.drag.style[this._sL];
    this.drag.style[this._sL] = this.posX + this.dragLeft * 1 + "px";
    this.leftZone.style[this._sW] = this.posX + this.dragLeft * 1 + "px";
    this.rightZone.style[this._sL] = this.posX + this.dragLeft * 1 + 1 + "px";
    this.rightZone.style[this._sW] = this.zoneSize - (this.posX + this.dragLeft * 1) + "px";
    var nw = this.getValue();
    if (this._link) {
        if (this._linkBoth)
            this._link.value = nw;
        else
            this._link.innerHTML = nw
    };
    if (!skip && a_old != this.drag.style[this._sL])
        this.callEvent("onChange", [nw, this]);
    this.value = this.getValue();
    if (!this._dttp)
        this._setTooltip(nw)
};
dhtmlxSlider.prototype._setTooltip = function(nw) {
    this.con.title = nw
};
dhtmlxSlider.prototype.setSkin = function(skin) {
    this.skin = skin || "default";
    if (this.isInit)
        this.createStructure()
};
dhtmlxSlider.prototype.startDrag = function(e) {
    if (this._busy)
        return;
    if ((e.button === 0) || (e.button === 1)) {
        this.drag_mx = e.clientX;
        this.drag_my = e.clientY;
        this.drag_cx = this.posX;
        this.d_b_move = document.body.onmousemove;
        this.d_b_up = document.body.onmouseup;
        var _c = this;
        document.body.onmouseup = function(e) {
            _c.stopDrag(e || event);
            _c = null
        };
        document.body.onmousemove = function(e) {
            _c.onDrag(e || event)
        };
        this._busy = true
    }
};
dhtmlxSlider.prototype.onDrag = function(e) {
    if (this._busy) {
        if (!this.vMode)
            this.posX = this.drag_cx + e.clientX - this.drag_mx;
        else
            this.posX = this.drag_cx + e.clientY - this.drag_my;
        this._applyPos()
    }
};
dhtmlxSlider.prototype.stopDrag = function(e) {
    document.body.onmousemove = this.d_b_move ? this.d_b_move : null;
    document.body.onmouseup = this.d_b_up ? this.d_b_up : null;
    this.d_b_move = this.d_b_up = null;
    this._busy = false;
    this.callEvent("onSlideEnd", [this.getValue()])
};
dhtmlxSlider.prototype.getValue = function() {
    if ((!this._busy) && (this.inputPriority))
        return (Math.round(this.value / this._step) * this._step).toFixed(6) - 0;
    return Math.round((Math.round((this.posX / this._mod) / this._step) * this._step + this.shift * 1) * 10000) / 10000
};
dhtmlxSlider.prototype.setValue = function(val, skip) {
    this.value = val;
    this.posX = (Math.round(((val || 0) - this.shift) * this._mod));
    this._applyPos(skip == null ? true : skip)
};
dhtmlxSlider.prototype._getActionElement = function(nod) {
    if (nod._etype)
        return nod;
    if (nod.parentNode)
        return this._getActionElement(nod.parentNode);
    return null
};
dhtmlxSlider.prototype._onMouseDown = function(e) {
    if (this.that.disabled)
        return;
    e = e || event;
    var that = this.that;
    var nod = that._getActionElement(_isIE ? e.srcElement : e.target);
    switch (nod._etype) {
        case "slider" :
            if (that.vMode)
                var z = e.clientY - (getAbsoluteTop(that.con) - document.body.scrollTop);
            else
                var z = e.clientX - (getAbsoluteLeft(that.con) - document.body.scrollLeft);
            var posX = that.posX;
            that.posX = z - that.dragLeft - that.dragWidth / 2;
            that.direction = that.posX > posX ? 1 : -1;
            if (that.stepping) {
                clearInterval(that._int);
                that.setValue(that.value + that._step * that.direction, false);
                that._int = setInterval(function() {
                            that.setValue(that.value + that._step * that.direction, false)
                        }, 600)
            } else {
                that._busy = true;
                that._applyPos();
                that._busy = false
            }
            ;
            break;
        case "drag" :
            that.startDrag(e || event);
            break
    };
    return false
};
dhtmlxSlider.prototype.setOnChangeHandler = function(func) {
    this.attachEvent("onChange", func)
};
dhtmlxSlider.prototype._linkFrom = function() {
    if (this.disabled)
        return;
    this.setValue(parseFloat(this._link.value), false)
};
dhtmlxSlider.prototype.linkTo = function(obj) {
    obj = (typeof(obj) != "object") ? document.getElementById(obj) : obj;
    this._link = obj;
    var name = obj.tagName.toString().toLowerCase();
    this._linkBoth = (((name == "input") || (name == "select") || (name == "textarea")) ? 1 : 0);
    if (this._linkBoth) {
        var self = this;
        var f = function() {
            if (this._nextSlider)
                window.clearTimeout(this._nextSlider);
            this._nextSlider = window.setTimeout(function() {
                        self._linkFrom()
                    }, 500)
        };
        obj.onblur = obj.onkeypress = obj.onchange = f
    };
    this._applyPos()
};
dhtmlxSlider.prototype.enableTooltip = function(mode) {
    this._dttp = (!convertStringToBoolean(mode));
    this._setTooltip(this._dttp ? "" : this.getValue())
};
dhtmlxSlider.prototype.setImagePath = function(path) {
    this.imgURL = path
};
dhtmlxSlider.prototype.init = function() {
    this.isInit = true;
    this.createStructure()
};
dhtmlxSlider.prototype.setInputPriority = function(mode) {
    this.inputPriority = mode
};
dhtmlxSlider.prototype.setSteppingMode = function(mode) {
    this.stepping = mode
};
dhtmlxSlider.prototype.disable = function(mode) {
    this.disabled = mode
};
(function() {
    dhtmlx.extend_api("dhtmlxSlider", {
                _init : function(obj) {
                    return [obj.parent, obj.size, obj.skin, obj.vertical, obj.min, obj.max, obj.value, obj.step]
                },
                link : "linkTo"
            }, {})
})();