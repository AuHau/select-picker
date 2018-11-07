'use strict';
jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

/**
 * Function which will fill select tag with options
 * @param id
 * @param count
 */
var fillOptions = function (id, count) {
    var $elem = (id instanceof jQuery ? id : $(id));

    for (var i = 0; i < count; i++) {
        $elem.append($("<option value='" + i + "'>" + i + "</option>"));
    }
};

/**
 * Function which will return array filled with random integers in specified range without duplications.
 * @param length
 * @param start
 * @param end
 * @param [toString] defines if the numbers should be converted to string
 * @returns {Array}
 */
var createRandomArray = function (length, start, end, toString) {
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
        if (!found)arr[arr.length] = (toString ? randomNumber + '' : randomNumber);
    }

    return arr;
};

describe("Single Picker - ", function () {
    beforeEach(function () {
        loadFixtures("single.fixture.html");
    });

    it("Standard init", function () {
        var $select = $("#test");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker({texts: { trigger : "aaa", noResult : "bbb", search : "ccc" }});

        expect($select).toBeHidden();
        expect($container).toContainElement("div.picker");
        expect($container).toContainElement("span.pc-select");
        expect($container).toContainElement("span.pc-list");
        expect($container).toContainElement("span.pc-element.pc-trigger");
        expect($container.find(".picker > .pc-select > .pc-list > ul > li")).toHaveLength(5);
        expect($container.find(".pc-element")).toContainText($select.find('option:eq(0)').text());
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
        expect($container.find(".picker > .pc-select > .pc-list > ul > li")).toHaveLength(1000);
    });

    it("List building", function () {
        var $select = $("#test");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker();

        var $options = $container.find(".picker > .pc-select > .pc-list > ul > li");
        expect($options).toHaveLength(5);
        $options.each(function () {
            var selectOptionText = $select.find("option[value='" + $(this).data('id') +"']").text();
            expect($(this)).toContainText(selectOptionText);
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
            expect($container.find(".pc-element")).toContainText($(this).text());
            expect($select.find("option[value='" + $(this).data('id') +"']")).toHaveAttr("selected");
        });

    });

    it("Hidden attribute", function () {
        var $select = $("#test");
        $select.append($("<option value='' disabled hidden>hidden</option>"));
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker();

        expect($container.find(".picker > .pc-select > .pc-list > ul > li")).toHaveLength(5);
        expect($container).not.toContainElement(".pc-list li:contains('Placeholder')");
    });

});

describe("Multi-selection Picker - ", function () {
    beforeEach(function () {
        loadFixtures("multiple.fixture.html");
    });

    it("Init", function () {
        var $select = $("#test");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker({
            texts: {
                trigger: "Random"
            }
        });


        expect($select).toBeHidden();
        expect($container).toContainElement("div.picker");
        expect($container).toContainElement("span.pc-select");
        expect($container).toContainElement("span.pc-list");
        expect($container).toContainElement("span.pc-element.pc-trigger");
        expect($container.find(".picker > .pc-select > .pc-list > ul > li")).toHaveLength(5);
        expect($container.find(".pc-trigger")).toHaveText($select.find('option:eq(0)').text());
    });

    it("Auto init", function () {
        var $select = $("#test");
        $select.attr("multiple", "multiple");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker();

        $container.find(".pc-list li").first().click();
        expect($container).toContainElement(".pc-element:not(.pc-trigger)");
    });

    it("Select one value", function () {
        var $select = $("#test");
        fillOptions($select, 5);
        var $container = $(".container");
        $select.picker();

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
        $select.picker();

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
        $select.picker();

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

        $select.picker();

        selectedOptions.forEach(function (elem) {
            expect($container).toContainElement(".pc-element[data-id='" + elem + "']");
        });
    });


    it("Limited options", function () {
        var $select = $("#test");
        fillOptions($select, 50);
        var $container = $(".container");
        $select.picker({limit: 10});

        createRandomArray(10, 0, 49).forEach(function (elem) {
            $container.find(".pc-list ul li[data-id='" + elem + "']").click();
        });

        expect($container.find(".pc-trigger")).toBeHidden();
        $container.find(".pc-element:not(.pc-trigger) .pc-close").first().click();
        expect($container.find(".pc-trigger")).toBeVisible();
    });

});

describe("Picker configuration - ", function () {
    beforeEach(function () {
        loadFixtures("single.fixture.html");
    });

    it("container class", function () {
        var $select = $("#test");
        fillOptions($select, 10);
        var $container = $(".container");
        $select.picker({containerClass: "testClass"});

        expect($container).toContainElement(".testClass.picker");

    });

    it("container width", function () {
        var $select = $("#test");
        fillOptions($select, 10);
        var $container = $(".container");
        $select.picker({containerWidth: 100});

        expect($container.find(".picker").width()).toEqual(100);
        expect($container.find(".picker")).toHaveAttr("style");

    });

    it("list width", function () {
        var $select = $("#test");
        fillOptions($select, 10);
        var $container = $(".container");
        $select.picker({width: 100});

        expect($container.find(".picker .pc-list").attr("style")).toMatch("width:100px;");
    });

    it("texts", function () {
        var $select = $("#test");
        fillOptions($select, 10);
        var $container = $(".container");
        $select.picker({
            search: true,
            texts: { trigger : "aaa", noResult : "bbb", search : "ccc" }
        });

        var $input = $container.find(".pc-list input[type='search']");
        expect($container.find(".pc-trigger")).toContainText($select.find('option:eq(0)').text());
        expect($input.attr("placeholder")).toBe("ccc");

        $input.val("asd");
        $input.trigger("input");
        expect($container.find("li.not-found")).toContainText("bbb");
    })
});

describe("Picker API - ", function () {
    it("destroy", function () {
        loadFixtures("single.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        var $container = $(".container");
        $select.picker();

        expect($container).toContainElement(".picker");
        $select.picker("destroy");
        expect($container).not.toContainElement(".picker");
    });

    it("get (single)", function () {
        loadFixtures("single.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        var $container = $(".container");
        $select.picker();

        var option = $($container.find(".pc-list li")[3]);
        option.click();

        // Change needs to propagate through the DOM
        setTimeout(function(){
            expect($select.picker("get")).toBe(option.data("id") + '');
        }, 200);
    });

    it("get (multiple) - one item", function () {
        loadFixtures("multiple.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        var $container = $(".container");
        $select.picker();

        var option = $($container.find(".pc-list li")[3]);
        option.click();
        expect($select.picker("get")).toEqual([option.data("id") + '']);
    });

    it("get (multiple) - several items", function () {
        loadFixtures("multiple.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        var $container = $(".container");
        $select.picker();

        var listOptions = $container.find(".pc-list li");
        var selectArray = createRandomArray(4, 0, 9);
        selectArray.forEach(function(item){
            $(listOptions[item]).click();
        });

        selectArray.sort();

        expect($select.picker("get")).toEqual(selectArray.map(function(item){
            return item + '';
        }));
    });

    it("set (single)", function () {
        loadFixtures("single.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        $select.picker();

        $select.picker("set", 4);

        // Change needs to propagate through the DOM
        setTimeout(function(){
            expect($select.picker("get")).toBe('4');
        }, 200);
    });


    it("set (multiple)", function () {
        loadFixtures("multiple.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        $select.picker();

        $select.picker("set", 2);
        $select.picker("set", 4);
        $select.picker("set", 6);

        expect($select.picker("get")).toEqual(['2', '4', '6']);
    });

    it("remove - after natural click", function () {
        loadFixtures("multiple.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        var $container = $(".container");
        $select.picker();

        var listOptions = $container.find(".pc-list li");
        var selectArray = [2, 4, 7, 8, 9];
        selectArray.forEach(function(item){
            $(listOptions[item]).click();
        });
        selectArray.sort();

        expect($select.picker("get")).toEqual(selectArray.map(function(item){ return item + ''}));
        $select.picker("remove", 8);
        expect($select.picker("get")).toEqual(['2', '4', '7', '9']);
    });

    it("remove - after using 'set'", function () {
        loadFixtures("multiple.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        $select.picker();

        $select.picker("set", 2);
        $select.picker("set", 4);
        $select.picker("set", 6);

        expect($select.picker("get")).toEqual(['2', '4', '6']);
        $select.picker("remove", 6);
        expect($select.picker("get")).toEqual(['2', '4']);
    });
});

describe("Picker Events - ", function () {
    it("sp-change event - single mode", function(){
        loadFixtures("single.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        $select.picker();

        var spChangeEvent = spyOnEvent('#test', 'sp-change');
        var $option = $(".container").find(".picker > .pc-select > .pc-list > ul > li").first();
        $option.click();
        expect(spChangeEvent).toHaveBeenTriggered();
    });

    it("sp-change event - multiple mode", function(){
        loadFixtures("multiple.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        $select.picker();
        var $container = $(".container");

        var spChangeEvent = spyOnEvent('#test', 'sp-change');
        var $options = $container.find(".picker > .pc-select > .pc-list > ul > li");

        // Adding all
        $options.each(function () {
            $(this).click();
            expect(spChangeEvent).toHaveBeenTriggered();
            spChangeEvent.reset();
        });

        // Removing all
        $container.find(".pc-element:not(.pc-trigger)").each(function () {
            $(this).find('.pc-close').click();
            expect(spChangeEvent).toHaveBeenTriggered();
            spChangeEvent.reset();
        });
    });

    it("sp-change event - API set/remove", function(){
        loadFixtures("multiple.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        $select.picker();

        var spChangeEvent = spyOnEvent('#test', 'sp-change');

        $select.picker('set', 1);
        expect(spChangeEvent).toHaveBeenTriggered();
        spChangeEvent.reset();

        $select.picker('remove', 1);
        expect(spChangeEvent).toHaveBeenTriggered();
    });


    it("sp-open/sp-close event", function(){
        loadFixtures("single.fixture.html");
        var $select = $("#test");
        fillOptions($select, 10);
        $select.picker();

        var spOpenEvent = spyOnEvent('#test', 'sp-open');
        var spCloseEvent = spyOnEvent('#test', 'sp-close');
        var $trigger = $('.container .pc-element.pc-trigger');
        $trigger.click();
        expect(spOpenEvent).toHaveBeenTriggered();
        $trigger.click();
        expect(spCloseEvent).toHaveBeenTriggered();

    });

});