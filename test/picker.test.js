'use strict';
jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

var fillOptions = function (id, count) {
    var $elem = (id instanceof jQuery ? id : $(id));

    for (var i = 0; i < count; i++) {
        $elem.append($("<option value='" + i + "'>" + i + "</option>"));
    }
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
    
});