var mockData = {};
mockData.parkingLots = [
        {"parkingLotId": 1, "parkingLotName": "Main"},
        {"parkingLotId": 2, "parkingLotName": "Spur"},
        {"parkingLotId": 3, "parkingLotName": "Winterfell"},
        {"parkingLotId": 4, "parkingLotName": "Gate"}];
mockData.availableSpaces = {"availableSpaces": 10};

var menuItem = flight.component(function() {
        this.after('initialize', function() {
                this.on("click", function() {
                        var parkingLotId = this.$node.data("choice");
                        $('.menu').trigger("hide");
                        $('.info').trigger("show");
                });
        });
});

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

var info = flight.component(function() {
        this.getAvailableSpaces = function(parkingLotId) {
                availableSpaces = parseInt(mockData.availableSpaces.availableSpaces);
                return availableSpaces;
        };
        this.show = function() {
                this.update();
                $('.info').fadeIn(function() {
                        $(this).removeClass("hidden");
                });
        };
        this.hide = function() {
                $('.info').fadeOut(function() {
                        $(this).addClass("hidden");
                });
        };
        this.update = function() {
                var availableSpaces = this.getAvailableSpaces();
                $('.info .available_spaces').html(availableSpaces);
                $('.info').removeClass("spaces-available").removeClass("few-spaces-left").removeClass("no-spaces");
                if (availableSpaces == 0) $('.info').addClass("no-spaces-left");
                if (availableSpaces >= 1 && availableSpaces <= 3) $('.info').addClass("few-spaces-left");
                if (availableSpaces >=4) $('.info').addClass("spaces-available");
        }
        this.after('initialize', function() {
                this.update();
                this.on("click", function() { $('.menu').trigger("show"); });
                this.on("show", this.show);
                this.on("hide", this.hide);
        });
});

$(document).ready(function() {
        menu.attachTo(".menu");
        info.attachTo(".info");
                menuItem.attachTo('.menu div');

});
