/*!
*
* ColorPick jQuery plugin
* https://github.com/philzet/ColorPick.js
*
* Copyright (c) 2017 Phil Zet (a.k.a. Philipp Zakharchenko)
* Licensed under the MIT License
*
*/

(function( $ ) {
 
    $.fn.colorPick = function(config) {
 
        return this.each(function() {
            new $.colorPick(this, config || {});
        });
 
    };
    
    $.colorPick = function (element, options) {
        options = options || {};
        this.options = $.extend({}, $.fn.colorPick.defaults, options);
        if(options.str) {
            this.options.str = $.extend({}, $.fn.colorpickr.defaults.str, options.str);
        }
        this.color   = this.options.initialColor;
        this.onChange   = this.options.onChange;
        this.element = $(element);
        return this.element.hasClass(this.options.pickrclass) ? this : this.init();
    };
    
    $.fn.colorPick.defaults = {
        'initialColor': 'transparent',
        'allowRecent': false,
        'recentMax': 10,
        'palette': [
            "transparent", "#ffffff",
            "#EDEDED", "#D4D4D4", "#A1A1A1", "#6E6E6E", "#3B3B3B", "#000000",
            "#B20000", "#E60000", "#FF4545", "#FFABAB", "#FFBFBF", "#800000", 
            "#FFF3DE", "#FFCF78", "#FFAC12", "#CC8500", "#996400", "#805300",
            "#FFFFE8", "#FFFF82", "#FFFF1C", "#E6E600", "#B2B200", "#808000", 
            "#DEFFDE", "#ABFFAB", "#45FF45", "#00E600", "#00B200", "#008000",
            "#DEFFFF", "#ABFFFF", "#45FFFF", "#00E6E6", "#00B2B2", "#008080",
            "#D6D6FF", "#A3A3FF", "#3B3BFF", "#0000E6", "#0000B2", "#000099",
            "#F1DEFF", "#DBABFF", "#B045FF", "#8400E6", "#6400B2", "#4A0080",
            "#FFDEFF", "#FFABFF", "#FF45FF", "#E600E5", "#B200B2", "#800080",
        ],
        'onColorSelected': function() {
            this.element.css({'backgroundColor': this.color, 'color': this.color});
            if (this.onChange != null) {
                this.onChange(this.color);
            }
        }
    };
    
    $.colorPick.prototype = {
        
        init : function(){
            var self = this;
            var o = this.options;
            
            $.proxy($.fn.colorPick.defaults.onColorSelected, this)();
            
            this.element.click(function(event) {
                event.preventDefault();
                var x = event.pageX - 100;
                if (x < 0)
                    x = 0;
                self.show(x, event.pageY + 20);
                
                $('.colorPickButton').click(function(event) {
					self.color = $(event.target).attr('hexValue');
					self.appendToStorage($(event.target).attr('hexValue'));
					self.hide();
					$.proxy(self.options.onColorSelected, self)();
					return false;
            	});
                
                return false;
            }).blur(function() {
                self.element.val(self.color);
                $.proxy(self.options.onColorSelected, self)();
                self.hide();
                return false;
            });
            
            $(document).click(function(event) {
                self.hide();
                return true;
            });
            
            return this;
        },
        
        appendToStorage: function(color) {
	        if ($.fn.colorPick.defaults.allowRecent === true) {
	        	var storedColors = JSON.parse(localStorage.getItem("colorPickRecentItems"));
				if (storedColors == null) {
		     	    storedColors = [];
	        	}
				if ($.inArray(color, storedColors) == -1) {
		    	    storedColors.unshift(color);
					storedColors = storedColors.slice(0, $.fn.colorPick.defaults.recentMax)
					localStorage.setItem("colorPickRecentItems", JSON.stringify(storedColors));
	        	}
	        }
        },
        
        show: function(left, top) {
            if ($("#colorPick").length == 0) {
    	        $("body").append('<div id="colorPick" style="display:none;top:' + top + 'px;left:' + left + 'px"></div>');
	            jQuery.each($.fn.colorPick.defaults.palette, (index, item) => {
	                if (item == 'transparent')
	                    $("#colorPick").append('<div class="colorPickButton" hexValue="' + item + '" style="background:' + item + '; border: 1px solid #FFF;"></div>');
	                else
    		            $("#colorPick").append('<div class="colorPickButton" hexValue="' + item + '" style="background:' + item + '"></div>');
	    		});
    			if ($.fn.colorPick.defaults.allowRecent === true) {
			    	$("#colorPick").append('<span style="margin-top:5px">Recent:</span>');
		    		if (JSON.parse(localStorage.getItem("colorPickRecentItems")) == null || JSON.parse(localStorage.getItem("colorPickRecentItems")) == []) {
	    				$("#colorPick").append('<div class="colorPickButton colorPickDummy"></div>');
    				} else {
				    	jQuery.each(JSON.parse(localStorage.getItem("colorPickRecentItems")), (index, item) => {
		            		$("#colorPick").append('<div class="colorPickButton" hexValue="' + item + '" style="background:' + item + '"></div>');
		    			});
	    			}
    			}                
            }
            else {
                $("#colorPick").css({top: top + 'px', left: left + 'px'});
            }
	        $("#colorPick").fadeIn(200);
	    },
	    
	    hide: function() {
		    $( "#colorPick" ).fadeOut(200, function() {
			    $("#colorPick").remove();
			    return this;
			});
        },
        
    };
 
}( jQuery ));
 
