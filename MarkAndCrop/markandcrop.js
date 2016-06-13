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
        createCopy: function (obj) {
            return JSON.parse(JSON.stringify(obj));
        },
        checkBoundaryConditions: function (cont, markData) {
            
        },
        bindListeners: function (cont, config) {
            var self = this;
            cont.on("imageloaded", function (evt, imageProps) {
                var markCount = 0,
                    markZIndex = 0,
                    imageData = null,
                    markData = null,
                    dropSize = config.markProperties.dropSize = config.markProperties.dropSize || [50, 50];
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
                    imageData = self.createCopy(imageProps);
                    imageData.markData = markData = {
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
                        $(this).trigger("markadded", [drawable, imageData]);
                        $(this).off("mousemove").on("mousemove", function (evt) {
                            // Set width and height of drawable if dimensions are positive, else change the position
                            if ((evt.pageX - markData.docx) >= 0) {
                                markData.width = Math.abs((evt.pageX - markData.docx));
                                self.checkBoundaryConditions(this, markData);
                                drawable.css("width", markData.width);
                            } else {
                                // change x position along with width
                                markData.x = evt.pageX - $(this).offset().left;
                                markData.width = Math.abs((evt.pageX - markData.docx));
                                self.checkBoundaryConditions(this, markData);
                                drawable.css({
                                    "left": markData.x,
                                    "width": markData.width
                                });
                            }
                            if ((evt.pageY - markData.docy) >= 0) {
                                markData.height = Math.abs((evt.pageY - markData.docy));
                                self.checkBoundaryConditions(this, markData);
                                drawable.css("height", markData.height);
                            } else {
                                // change y position along with height
                                markData.y = evt.pageY - $(this).offset().top;
                                markData.height = Math.abs((evt.pageY - markData.docy));
                                self.checkBoundaryConditions(this, markData);
                                drawable.css({
                                    "top": markData.y,
                                    "height": markData.height
                                });
                            }
                            $(this).trigger("markdraw", [this, imageData]);
                        });
                    } else {
                        // Set drawable width, height and position
                        markData.x -= dropSize[0] / 2;
                        markData.y -= dropSize[1] / 2;
                        markData.width = dropSize[0];
                        markData.height = dropSize[1];
                        self.checkBoundaryConditions(this, markData);
                        drawable.css({
                            "position": "absolute",
                            "top": markData.y,
                            "left": markData.x,
                            "width": markData.width,
                            "height": markData.height
                        });
                    }
                    $(this).trigger("markstart", [this, imageData]);
                });
                $(this).on("mouseup", function () {
                    if (config.markProperties.drawable) {
                        $(this).off("mousemove");
                    }
                    $(this).trigger("markend", [this, imageData]);
                    imageData = markData = null;
                });
            });
        }
    };

    $.fn.mark = function (config) {
        if (!config) {
            return;
        }
        localFn.setProperties(this, config);
        localFn.setBackground(this, config);
        localFn.bindListeners(this, config);
        return this;
    };

    $.fn.crop = function (config) {
        // TODO
    };
})(window.jQuery);