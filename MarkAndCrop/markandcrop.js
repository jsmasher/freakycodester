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
                } else {
                    cont.addClass("mnc-normal");
                }
                // Set html5 attributes to the div for later use
                if (config.src) {
                    cont.attr("data-src", config.src);
                }
            }
        },
        getComputedDimensions: function (od, factor) {
            return (od / factor);
        },
        setBackground: function (cont, config) {
            if (typeof config === "object") {
                var self = this;
                if (config.src) {
                    // Wait for image load
                    var taggableImage = new Image();
                    taggableImage.src = config.src;
                    $(taggableImage).on("load", function () {
                        // Get original and computed image dimensions
                            computedDimensions = {
                                width: cont.width() || this.width,
                                height: self.getComputedDimensions(cont.width(), (this.width / this.height)) || this.height
                            };
                        // Set container css properties
                        cont.css({
                            "width": computedDimensions.width,
                            "height": computedDimensions.height,
                            "background-image": "url(" + config.src + ")",
                            "background-size": computedDimensions.width + "px " + computedDimensions.height + "px"
                        });
                        cont.trigger("imageloaded", [{
                            dimensions: {
                                original: {
                                    width: this.width,
                                    height: this.height
                                },
                                computed: {
                                    width: computedDimensions.width,
                                    height: computedDimensions.height
                                }
                            }
                        }]);
                    })
                }
            }
        },
        bindListeners: function (cont, config) {
            cont.on("imageloaded", function (evt, imageProps) {
                var markCount = 0,
                    markZIndex = 0,
                    markData = null;
                // Set default mark properties
                config.markProperties = config.markProperties || {
                    drawable: true,
                    resizable: false,
                    draggable: false
                };
                $(this).addClass((config.markProperties.drawable ? "cursor-draw" : "cursor-drop"));
                // On mousedown drop a new div element that can be drawn or resized
                $(this).on("mousedown", function (evt) {
                    evt.preventDefault();
                    // Insert a drawable div inside the container
                    var drawable = $("<div>").addClass("mnc-drawable");
                    drawable.appendTo(this);
                    markCount += 1;
                    markZIndex += 1;
                    markData = {
                        x: evt.pageX - $(this).offset().left,
                        y: evt.pageY - $(this).offset().top,
                        width: 0,
                        height: 0,
                        docx: evt.pageX,
                        docy: evt.pageY
                    };
                    if (config.markProperties.drawable) {
                        // Set position of drawable w.r.t parent
                        drawable.css({
                            "position": "absolute",
                            "top": markData.y,
                            "left": markData.x,
                            "z-index": markZIndex
                        });
                        cont.trigger("markadded", [drawable, imageProps]);
                        $(this).off("mousemove").on("mousemove", function (evt) {
                            // Set width and height of drawable if dimensions are positive, else change the position
                            if ((evt.pageX - markData.docx) >= 0) {
                                drawable.css("width", Math.abs((evt.pageX - markData.docx)));
                            } else {
                                // change x position along with width
                                drawable.css({
                                    "left": evt.pageX - $(this).offset().left,
                                    "width": Math.abs((evt.pageX - markData.docx))
                                });
                            }
                            if ((evt.pageY - markData.docy) >= 0) {
                                drawable.css("height", Math.abs((evt.pageY - markData.docy)));
                            } else {
                                // change y position along with height
                                drawable.css({
                                    "top": evt.pageY - $(this).offset().top,
                                    "height": Math.abs((evt.pageY - markData.docy))
                                });
                            }
                        });
                    } else {

                    }
                });
                $(this).on("mouseup", function () {
                    if (config.markProperties.drawable) {
                        $(this).off("mousemove");
                    }
                });
            });
        }
    }, cache = {};

    $.fn.mark = function (config) {
        if (!config) {
            return;
        }
        localFn.setProperties(this, config);
        localFn.setBackground(this, config);
        localFn.bindListeners(this, config);
    };

    $.fn.crop = function (config) {
        // TODO
    };
})(window.jQuery);