'use strict';
jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

var fillOptions = function (id, count) {
    var $elem = (id instanceof jQuery ? id : $(id));

    for (var i = 0; i < count; i++) {
        $elem.append($("<option value='" + i + "'>" + i + "</option>"));
    }
};

var createRandomArray = function (length, start, end) {
    var arr = [];
    while (arr.length < length) {
        var randomNumber = Math.floor(Math.random() * (end - start + 1)) + start;
        var found = false;
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == randomNumber) {
                found = true;
                break;
            }
        }
        if (!found)arr[arr.length] = randomNumber;
    }

    return arr;
};

describe("Single Picker - ", function () {
    beforeEach(function () {
        loadFixtures("document.fixture.html");
    });

    it("Standard init", function () {
        var $select = $("#test");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker();

        expect($select).toBeHidden();
        expect($container).toContainElement("div.picker");
        expect($container).toContainElement("span.pc-select");
        expect($container).toContainElement("span.pc-list");
        expect($container).toContainElement("span.pc-element.pc-trigger");
        expect($container.find(".picker > .pc-select > .pc-list > ul > li").length).toEqual(5);
        expect($container.find(".pc-element").text()).toBe($select.find("option").first().text());
    });

    it("No options init", function () {
        var $select = $("#test");
        var $container = $(".container");
        $select.picker();

        expect($select).toBeVisible();
        expect($container).not.toContainElement("div.picker");
    });

    it("Big number of choices init", function () {
        var $select = $("#test");
        fillOptions($select, 1000);
        var $container = $(".container");
        $select.picker();

        expect($select).toBeHidden();
        expect($container).toContainElement("div.picker");
        expect($container.find(".picker > .pc-select > .pc-list > ul > li").length).toEqual(1000);
    });

    it("List building", function () {
        var $select = $("#test");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker();

        var $options = $container.find(".picker > .pc-select > .pc-list > ul > li");
        expect($options.length).toEqual(5);
        $options.each(function () {
            var selectOptionText = $select.find("option[value='" + $(this).data('id') +"']").text();
            expect($(this).text()).toBe(selectOptionText);
        });
    });

    //it("List opening/closing", function () {
    //    var $select = $("#test");
    //    fillOptions($select, 5);
    //    var $container = $(".container");
    //    $select.picker();
    //
    //    expect($container.find(".pc-list")).toBeHidden();
    //    $container.find(".pc-trigger").click();
    //    expect($container.find(".pc-list")).toBeVisible();
    //});

    it("Select option", function () {
        var $select = $("#test");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker();

        var $options = $container.find(".picker > .pc-select > .pc-list > ul > li");
        $options.each(function () {
            $(this).click();
            expect($container.find(".pc-element").text()).toBe($(this).text());
            expect($select.find("option[value='" + $(this).data('id') +"']")).toHaveAttr("selected");
        });

    });

    it("Hidden attribute", function () {
        var $select = $("#test");
        $select.append($("<option value='' disabled hidden>Placeholder</option>"));
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker();

        expect($container.find(".pc-element").text()).toBe("Placeholder");
        expect($container.find(".picker > .pc-select > .pc-list > ul > li").length).toEqual(5);
        expect($container.find(".pc-list li:contains('Placeholder')").length).toEqual(0);
    });

});

describe("Multi-selection Picker - ", function () {
    beforeEach(function () {
        loadFixtures("document.fixture.html");
    });

    it("Init", function () {
        var $select = $("#test");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker({
            multiple: true,
            texts: {
                trigger: "Random"
            }
        });


        expect($select).toBeHidden();
        expect($container).toContainElement("div.picker");
        expect($container).toContainElement("span.pc-select");
        expect($container).toContainElement("span.pc-list");
        expect($container).toContainElement("span.pc-element.pc-trigger");
        expect($container.find(".picker > .pc-select > .pc-list > ul > li").length).toEqual(5);
        expect($container.find(".pc-trigger")).toHaveText("Random");
    });

    it("Select one value", function () {
        var $select = $("#test");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker({multiple: true});

        var $option = $container.find(".picker > .pc-select > .pc-list > ul > li").first();
        $option.click();
        expect($select.find("option[value='" + $option.data('id') +"']")).toHaveAttr("selected");
        expect($option[0]).not.toBeInDOM();
        expect($container.find(".picker li[data-id='" + $option.data('id') +"']")).not.toExist();

        var $selectedOption = $container.find(".pc-element[data-id='" + $option.data('id') + "']");
        expect($selectedOption[0]).toExist();

        $selectedOption.find('.pc-close').click();
        expect($container.find(".pc-element[data-id='" + $option.data('id') + "']")).not.toExist();
        expect($select.find("option[value='" + $option.data('id') +"']")).not.toHaveAttr("selected");
        expect($container.find(".picker li[data-id='" + $option.data('id') +"']")).toExist();

    });

    it("Selecting all values", function () {
        var $select = $("#test");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker({multiple: true});

        var $options = $container.find(".picker > .pc-select > .pc-list > ul > li");
        $options.each(function () {
            var $this = $(this);
            $this.click();
            expect($select.find("option[value='" + $this.data('id') +"']")).toHaveAttr("selected");
            expect(this).not.toBeInDOM();
            expect($container.find(".picker li[data-id='" + $this.data('id') +"']")).not.toExist();
        });

        expect($container.find(".pc-trigger")).toBeHidden();

        var $option = $container.find(".pc-element:not(.pc-trigger)").first();
        $option.find('.pc-close').click();
        expect($container.find(".pc-element[data-id='" + $option.data('id') + "']")).not.toExist();
        expect($select.find("option[value='" + $option.data('id') +"']")).not.toHaveAttr("selected");
        expect($container.find(".picker li[data-id='" + $option.data('id') +"']")).toExist();

        expect($container.find(".pc-trigger")).toBeVisible();

        $container.find(".pc-element:not(.pc-trigger)").each(function () {
            var $this = $(this);
            $this.find('.pc-close').click();
            expect($container.find(".pc-element[data-id='" + $this.data('id') + "']")).not.toExist();
            expect($select.find("option[value='" + $this.data('id') +"']")).not.toHaveAttr("selected");
            expect($container.find(".picker li[data-id='" + $this.data('id') +"']")).toExist();
        });
    });

    it("Respecting original order of options", function () {
        var testLength = 100;
        var $select = $("#test");
        fillOptions($select, testLength);
        var $container = $(".container");
        $select.picker({multiple: true});

        //////////////////////////////
        // Helpers
        var shuffleArray = function(o){
            for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
            return o;
        };

        var checkOrder = function () {
            var options = $container.find(".pc-list li");

            if(options.length == 1) {
                return
            }

            var currentVal, previousVal, nextVal;
            for(var i = 1; i < options.length - 1; i++) {
                currentVal = parseInt($(options[i]).data("id"));

                if(i == (options.length - 1) && currentVal < parseInt($(options[i-1]).data("id"))) {
                    fail("Order is not matching!");
                    return;
                }

                previousVal = parseInt($(options[i-1]).data("id"));
                nextVal = parseInt($(options[i+1]).data("id"));

                if(currentVal < previousVal || currentVal > nextVal) {
                    fail("Order is not matching!");
                }
            }
        };
        //////////////////////////////

        var selectArray = shuffleArray(Array.apply(null, {length: testLength}).map(Number.call, Number));
        for(var i = 0; i < testLength; i++) {
            $container.find(".pc-list li[data-id='" + selectArray[i] + "']").click();
        }

        expect($container.find(".pc-trigger")).toBeHidden();
        var returnArray = shuffleArray(selectArray);

        for(i = 0; i < testLength; i++) {
            $container.find(".pc-element[data-id='" + returnArray[i] + "'] .pc-close").click();
            checkOrder();
        }

    });

    it("Data loading", function () {
        var $select = $("#test");
        fillOptions($select, 50);
        var $container = $(".container");

        var selectedOptions = createRandomArray(20, 0, 49);
        selectedOptions.forEach(function (elem) {
            $container.find("option[value='" + elem + "']").attr("selected", "selected");
        });

        $select.picker({multiple: true});

        selectedOptions.forEach(function (elem) {
            expect($container).toContainElement(".pc-element[data-id='" + elem + "']");
        });
    });

});