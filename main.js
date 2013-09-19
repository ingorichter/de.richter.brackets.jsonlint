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
/*global define, brackets, JSONLint */

/**
 * Provides jsonlint results via the core linting extension point
 */
define(function (require, exports, module) {
    "use strict";

    /* load global
     * This will pollute the namespace with a JSONLint instance
     */
    require("thirdparty/jsonlint/jsonlint");

    // Load dependent modules
    var CodeInspection = brackets.getModule("language/CodeInspection");

    /**
     * Run jsonlint on the current document. Reports results to the main UI. Displays
     * a gold star when no errors are found.
     */
    function lintOneFile(text, fullPath) {
        /* no options at the moment */
        var lintResults = new JSONLint(text, {});
        if (lintResults.error) {
            var errors = {
                // the line numbers are a little bit off...
                pos:     {line: lintResults.line - 2, ch: lintResults.character},
                message: lintResults.error,
                type:    CodeInspection.Type.ERROR
            };

            return {errors: [errors]};
        }

        return null;
    }

    // Register for JSON files
    CodeInspection.register("json", {
        name: "JSONLint",
        scanFile: lintOneFile
    });
});
