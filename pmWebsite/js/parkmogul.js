// Each Menu Item
var menuItem = flight.component(function() {
        this.after('initialize', function() {
                this.on("click", function() {
                        var parkingLotId = this.$node.data("choice");
                        $('.menu').trigger("hide");
                        $('.info').trigger("show");
                });
        });
});

var global = {};
global.ajax_url = "http://ui-8408.ryanyu.sandbox.tubemogul.info/parkmogul/";
global.real_time_on = false;
global.real_time_interval = 3000;

// Menu
var menu = flight.component(function() {
        this.show = function() {
                $('.menu').removeClass("hidden");
                $('.info').trigger("hide");
                $('.menu').slideDown();
        }

        this.hide = function() {
                $('.menu').slideUp(function() {
                        $(this).addClass("hidden");
                });
        }
        this.update = function() {
                $('.menu').html("");
                _.forEach(mockData.parkingLots, function( n, key ) {
                        $('.menu').append("<div data-choice='"+n.parkingLotId+"'>" + n.parkingLotName + "</div>");
                });
        }
        this.after('initialize', function() {
                this.update();
                this.on("show", this.show);
                this.on("update", this.update);
                this.on("hide", this.hide);
        });
});

// Info Popup
var info = flight.component(function() {
        this.populateAvailableSpaces = function(availableSpaces) {
            $('.info .available_spaces').html(availableSpaces);
            $('.info').removeClass("spaces-available").removeClass("few-spaces-left").removeClass("no-spaces-left");
            if (availableSpaces == 0) $('.info').addClass("no-spaces-left");
            if (availableSpaces >= 1 && availableSpaces <= 3) $('.info').addClass("few-spaces-left");
            if (availableSpaces >=4) $('.info').addClass("spaces-available");
        };
        this.getAvailableSpaces = function(parkingLotId) {
                var scope = this;
                $.ajax({
                        url: global.ajax_url+"get-available-spots",
                        success: function(res) {
                                var availableSpaces = parseInt(res);
                                scope.populateAvailableSpaces(availableSpaces);
                        }
                });
        };
        this.show = function() {
                this.update();
                $('.info').fadeIn(function() {
                        $(this).removeClass("hidden");
                });
                global.real_time_on = true;
        };
        this.hide = function() {
                $('.info').fadeOut(function() {
                        $(this).addClass("hidden");
                });
                global.real_time_on = false;
        };
        this.update = function() {
                this.getAvailableSpaces();
        }
        this.after('initialize', function() {
                this.update();
                this.on("click", function() { $('.menu').trigger("show"); });
                this.on("show", this.show);
                this.on("hide", this.hide);
                this.on("update", this.update);
        });
});

// Start up initialization.
$(document).ready(function() {
        menu.attachTo(".menu");
        info.attachTo(".info");
        menuItem.attachTo('.menu div');

        // Real time updates (refresh)
        window.setInterval(function() {
                if (global.real_time_on)
                        $('.info').trigger("update");
        },global.real_time_interval);
});
