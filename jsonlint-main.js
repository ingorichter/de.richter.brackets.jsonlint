/*
 * Copyright (c) 2012 Adobe Systems Incorporated. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:100, plusplus:false, devel:true, nomen:false */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4 */
/*global define, exports, require */

/**
 * Provides jsonlint results via the core linting extension point
 */
/*global exports, require, Buffer*/
/*jshint -W097, -W098, -W079 */
"use strict";

if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define(function (require, exports, module) {
    var jsonlint;
    if (typeof window === "undefined") {
        jsonlint = require("thirdparty/jsonlint/jsonlint");
    } else {
        require("thirdparty/jsonlint/jsonlint");
        jsonlint = window.jsonlint;
    }

    var re = /(\d+)/;

    function convertToBetterErrorMessage(errStr, message) {
        var errorMessage = message;

        switch (message) {
            case "Expecting 'EOF', '}', ':', ',', ']', got 'STRING'":
                errorMessage = "Probably missing a semi colon, comma or }/]";
                break;
            default:
                break;
        }
        return errorMessage;
    }

    function closestMatch(strA, strB, threshold) {
        var pos = -1,
            startPos = 0,
            i;

        if (threshold === undefined) {
            threshold = 2;
        }

        for(i = strB.length, startPos = 0; i >= 0; i--) {
            var searchString = strB.substring(0, i);
            pos = strA.indexOf(searchString, startPos);

            if(pos !== -1) {
                if (threshold > searchString.length) {
                    pos = -1;
                }

                break;
            }
        }

        return pos;
    }

    function getPosition(errorLine, text, errorText, marker) {
        var lines = text.split("\n");

        // errorText = "...[Line Content]"
        // length("-----------------------^") - length("...")
        var problem = errorText.substring(marker.length - 1);
        // this could need some improvement...
        var l = closestMatch(lines[errorLine], problem, 2);

        return l;
    }

    /**
     * Run jsonlint on the current document. Reports results to the main UI. Displays
     * a gold star when no errors are found.
     */
    function lintOneFile(text, fullPath) {
        try {
            jsonlint.parse(text);
        } catch (e) {
    //            ["Parse error on line 347:", "...      "newFeatures" [            {    ", "-----------------------^", "Expecting 'EOF', '}', ':', ',', ']', got '['"]
            var parts = e.message.split("\n"),
                line = re.exec(parts[0]);

            if (line) {
                var t = convertToBetterErrorMessage(line, parts[3]);
                var errorLine = line[0] - 1;
                var position = getPosition(errorLine, text, parts[1], parts[2]);
                var error = {
                    pos:     {line: errorLine, ch: position},
                    message: t,
                    type:    "problem_type_error" // dependency to CodeInspection is not helpful here
                };

                return {errors: [error]};
            }
        }

        return null;
    }

    // Testing API
    exports.lintOneFile   = lintOneFile;
    exports.closestMatch  = closestMatch;
    module.exports        = exports;
});

