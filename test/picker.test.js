jasmine.getFixtures().fixturesPath = 'base/test/fixtures';

describe("Picker initialization", function () {

    it("container creation", function () {
        loadFixtures("single.fixture.html");

        $("#test").picker();

        expect($(".container")).toContainElement("div.picker");
    })

});