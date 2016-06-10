(function ($) {
    var localFn = {
        setProperties: function (cont, config) {
            // Add classes to set default css of container
            // "mnc-image" class sets the appropriate css for background image rendering
            // "mnc-taggable" class sets the appropriate css for cursor styles
            cont.addClass("mnc-image mnc-taggable");
            if (typeof config === "object") {
                if (config.theme) {
                    cont.addClass("mnc-" + config.theme); // Adds a class specific to theme selected by user
                }
                // Set html5 attributes to the div for later use
                if (config.src) {
                    cont.attr("data-src", config.src);
                }
            }
        },
        getOriginalDimensions: function (src) {
            var tmp = document.createElement("img");
            tmp.src = src;
            return {
                width: tmp.width,
                height: tmp.height
            };
        },
        getComputedDimensions: function (od, factor) {
            return (od / factor);
        },
        setBackground: function (cont, config) {
            if (typeof config === "object") {
                if (config.src) {
                    // Get original image dimensions
                    var originalDimensions = this.getOriginalDimensions(config.src),
                        computedDimensions = {
                            width: cont.width(),
                            height: this.getComputedDimensions(cont.height())
                        };
                    
                    cont.css("background-image", config.src);

                }
            }
        }
    }, cache = {};

    $.fn.mark = function (config) {
        if (!config) {
            return;
        }
        localFn.setProperties(this, config);
        localFn.setBackground(this, config);
        localFn.bindListeners(this);
    };

    $.fn.crop = function (config) {
        // TODO
    };
})(window.jQuery);