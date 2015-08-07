var global = {};

global.ajax_url = "http://ui-8408.ryanyu.sandbox.tubemogul.info/parkmogul/";

// Parking Lot to update.
global.real_time_parking_lot_id = 0;

// activate real time (refresh) requests?
global.real_time_on = false;

// ms between api requests
global.real_time_interval = 3000;

// Each Menu Item
var menuItem = flight.component(function() {
        this.after('initialize', function() {
                this.on("click", function() {
                        if (this.$node.hasClass("expanded")) return false;
                        var parkingLotId = this.$node.data("choice");
                        $('.info').trigger('update');
                        $('.menu div:not([data-choice="'+parkingLotId+'"])').find('.expandable').slideUp(function() { $(this).html("") }).parent().removeClass("expanded").removeClass("spaces-available").removeClass("few-spaces-left").removeClass("no-spaces-left");
                        this.$node.addClass("expanded");
                        var expandable = this.$node.find('.expandable');
                        expandable.hide();
                        expandable.append($('.info').html());
                        expandable.parent().removeClass("spaces-available").removeClass("few-spaces-left").removeClass("no-spaces-left");
                        if ($('.info').hasClass("spaces-available")) expandable.parent().addClass("spaces-available");
                        if ($('.info').hasClass("few-spaces-left")) expandable.parent().addClass("few-spaces-left");
                        if ($('.info').hasClass("no-spaces-left")) expandable.parent().addClass("no-spaces-left");
                        expandable.slideDown();
                        global.real_time_parking_lot_id = parkingLotId;
                        global.real_time_on = true;
                });
        });
});

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
                        $('.menu').append("<div class='selection' data-choice='"+n.parkingLotId+"'><div class='title'>" + n.parkingLotName + "</div><div class='expandable'></div></div>");
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
            if (global.real_time_parking_lot_id>0) {
                $('.menu div[data-choice="'+global.real_time_parking_lot_id+'"]').find('.expandable').find('.available_spaces').html(availableSpaces);
            }
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
                //this.on("click", function() { $('.menu').trigger("show"); });
                this.on("show", this.show);
                this.on("hide", this.hide);
                this.on("update", this.update);
        });
});

// Start up initialization.
$(document).ready(function() {
        menu.attachTo(".menu");
        info.attachTo(".info");
        menuItem.attachTo('.menu div.selection');
        window.setInterval(function() {
                if (global.real_time_on)
                        $('.info').trigger("update");
        },3000);
});
