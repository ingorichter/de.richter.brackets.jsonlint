/*global require*/
/*jshint -W097 */

"use strict";

/*global expect, describe, it, require */
var jsonlinter = require('../../jsonlint-main.js');

describe("JSONLint", function () {
    describe("Error messages", function () {
        it("should give a better error message when semicolon is missing between key and value", function () {
            var testData = "{\"Key1\": \"Value1\",\"Key2Key2\" \"Value2\"}",
                res = jsonlinter.lintOneFile(testData);

            expect(res).toBeDefined();
            expect(res.errors.length).toEqual(1);
            expect(res.errors[0].message).toEqual("Probably missing a semi colon, comma or }/]");
        });

        it("should give a better error message when semicolon is missing between key and value", function () {
            var testData = "{\"Key1\": \"Value1\", \"Key2Key2\" \"Value2\"}",
                res = jsonlinter.lintOneFile(testData);

            expect(res).toBeDefined();
            expect(res.errors.length).toEqual(1);
            expect(res.errors[0].message).toEqual("Probably missing a semi colon, comma or }/]");
        });

        it("should give a better error message when comma is missing between key and value", function () {
            var testData = "{\"Key1Key\": \"Value1\" \"Key2Key2\": \"Value2\"}",
                res = jsonlinter.lintOneFile(testData);

            expect(res).toBeDefined();
            expect(res.errors.length).toEqual(1);
            expect(res.errors[0].message).toEqual("Probably missing a semi colon, comma or }/]");
            expect(res.errors[0].pos.line).toEqual(0);
            expect(res.errors[0].pos.ch).toEqual(21);
        });

        it("should give a better error message when semicolon is missing between key and value", function () {
            var testData = "{\n  \"Key1Key\": \"Value1\",\n  \"Key2Key2\" \"Value2\"}",
                res = jsonlinter.lintOneFile(testData);

            expect(res).toBeDefined();
            expect(res.errors.length).toEqual(1);
            expect(res.errors[0].message).toEqual("Probably missing a semi colon, comma or }/]");
            expect(res.errors[0].pos.line).toEqual(2);
            expect(res.errors[0].pos.ch).toEqual(13);
        });

        it("should give a better error message when semi colon is missing between key and value", function () {
            var testData = "{    \"grunt\" \"~0.4.4\",\n     \"grunt-mocha\": \"~0.4.11\"}",
                res = jsonlinter.lintOneFile(testData);

            expect(res).toBeDefined();
            expect(res.errors.length).toEqual(1);
            expect(res.errors[0].message).toEqual("Probably missing a semi colon, comma or }/]");
            expect(res.errors[0].pos.line).toEqual(0);
            expect(res.errors[0].pos.ch).toEqual(13);
        });
    });

    describe("Partial Match", function () {
        it("should find no match", function () {
            var res = jsonlinter.closestMatch("This is a test with a string", "nomatch");

            expect(res).toEqual(-1);
        });

        it("should find the closest match", function () {
            var res = jsonlinter.closestMatch("This is a test with a string", "test");

            expect(res).toEqual(10);
        });

        it("should find the 2nd match", function () {
            var res = jsonlinter.closestMatch("This is test1 with a test2 string", "test2");

            expect(res).toEqual(21);
        });
    });
});
