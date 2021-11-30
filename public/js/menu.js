//
// global
//
var gMenu = null;

//
// WebMenu
//
$.WebMenu = function(menu, cfg) {
    this.menu = menu;
    this.cfg = cfg;
}

$.WebMenu.prototype = {
    //
    // public functions
    //
    open: function(){
        this._initStyle();
        this._initUI();
        this._registry();
    },
    hideAllSubMenu: function() {
        // hide all submenu
        for (const [k1, v1] of Object.entries(this.cfg.menu)) {
            $('.submenu-' + k1).prop('hidden', true);
        }
    },
    setSubMenuVisible: function(menu, submenu, visible) {
        if (this.cfg.menu == null)
            return;
        for (const [k1, v1] of Object.entries(this.cfg.menu)) {
            if (menu != k1)
                continue;
            for (const [k2, v2] of Object.entries(v1)) {
                if (k2 != submenu)
                    continue;
                this.cfg.menu[k1][k2].visible = visible;
            }
        }
        
        $('#' + this.cfg.id).empty();
        this.open();
    },
    //
    // private functions
    //
    _initStyle: function() {
        var style = `
            <style class'menu-style'>
                #menu{padding: 10px;background-color: #4f5a63;z-index: 1030;}
                .menu-item{font-size: 20px;color: white;font-weight: bold;padding: 0 20px 0 20px;text-decoration: none;z-index: 1030;}
                .menu-item:hover{color: white;cursor: pointer;}
                .submenu-ul{list-style: none;padding-inline-start: 2px;}
                .submenu-item{font-size: 18px;color: white;padding-top: 6px;}
                .submenu-item:hover{color: white;cursor: pointer;}
                .submenu-item-panel{position: absolute;background-color:#4f5a63;top:48px;border: 1px solid black;padding:10px;z-index: 1030;border-radius: 6px;opacity: 0.85;}
            </style>
        `;
        this.menu.append(style);
    },
    _initUI: function() {
        for (const [menu, submenu] of Object.entries(this.cfg.menu)) {
            this._initMenu(menu);
            this._initSubMenu(menu, submenu);
        }
    },
    _initMenu: function(menu) {
        var html = `
            <a class='menu-item' data-menu='{0}'>{0}</a>
        `.format(menu);
        
        this.menu.append(html);
    },
    _initSubMenu: function(menu, submenu) {
        var menuObj = $('[data-menu=' + menu + ']');
        var position = menuObj.position();
        var leftPadding = position.left + (menuObj.innerWidth() - menuObj.width())/2;
        var html = `
            <div class='submenu-item-panel submenu-{1}' style='left:{0}px;'>
                <ul class='submenu-ul'>
        `.format(leftPadding, menu);
        
        for (const [name, item] of Object.entries(submenu)) {
            if (item.visible == false)
                continue;
            html += `
                <li class='submenu-item' data-menu='{1}' data-submenu='{0}'>
                    {0}
                </li>
            `.format(name, menu);
        }
        
        html += `
                </ul>
            </div>
        `;
        this.menu.append(html);
        
        $('.submenu-' + menu).prop('hidden', true);
    },
    _registry: function() {
        var _this = this;
        $('.menu-item').on('click', function(){
            _this._toggleSubMenu($(this).data('menu'));
        });
        $('.submenu-item').on('click', function(){
            var subMenuFunc = _this._getSubMenuFunc($(this).data('menu'), $(this).data('submenu'));
            subMenuFunc();
            _this.hideAllSubMenu();
        });
    },
    _toggleSubMenu: function(menu) {
        for (const [k1, v1] of Object.entries(this.cfg.menu)) {
            var hidden = true;
            if (k1 == menu) {
                var hidden = !$('.submenu-' + k1).prop('hidden');
            }
            $('.submenu-' + k1).prop('hidden', hidden);
        }
        if (gEditor != null && 
                gEditor.editorController != null &&
                gEditor.editorController.editor != null)
            gEditor.editorController.editor.close();
    },
    _getSubMenu: function(menuItem) {
        var menu = null;
        for (const [k1, v1] of Object.entries(this.cfg.menu)) {
            if (k1 == menuItem) {
                menu = v1;
            }// if
        }// for
        return menu;
    },
    _getSubMenuFunc: function(menuItem, subMenuItem) {
        var submenu = null;
        for (const [k1, v1] of Object.entries(this.cfg.menu)) {
            if (k1 == menuItem) {
                for (const [k2, v2] of Object.entries(v1)) {
                    if (k2 == subMenuItem) {
                        submenu = v2;
                    }
                }// for
            }// if
        }// for
        return submenu.action;
    },
}

var initMenu = function(cfg) {
    var menu = $('#' + cfg.id);
    if (menu.length == 0)
        return;
        
    gMenu = new $.WebMenu($(menu), cfg);
    gMenu.open();  
}
