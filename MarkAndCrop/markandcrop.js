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
        }
    };

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