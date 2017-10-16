"use strict";

const fs = require('fs-extra');
const path = require('path');

/**
 * The backend method that is called during the patternlab-pattern-write-end event.
 * Responsible for looking for a companion filetype file alongside a pattern file and outputting it if found.
 * @param patternlab - the global data store
 * @param pattern - the pattern object being iterated over
 */
function findTab(patternlab, pattern) {

  //read the filetypes from the configuration
  const fileTypes = patternlab.config.plugins['plugin-node-tab'].options.tabsToAdd;

  //exit if either of these two parameters are missing
  if (!patternlab) {
    console.error('plugin-node-tab: patternlab object not provided to findTab');
    process.exit(1);
  }

  if (!pattern) {
    console.error('plugin-node-tab: pattern object not provided to findTab');
    process.exit(1);
  }

  //derive the custom filetype paths from the pattern relPath
  let customFileTypePath = path.join(patternlab.config.paths.source.patterns, pattern.relPath);

  //loop through all configured types
  for (let i = 0; i < fileTypes.length; i++) {
    const fileType = fileTypes[i].toLowerCase();

    customFileTypePath = customFileTypePath.substr(0, customFileTypePath.lastIndexOf(".")) + '.' + fileType;
    let customFileTypeOutputPath = patternlab.config.paths.public.patterns + pattern.getPatternLink(patternlab, 'custom', '.' + fileType);

    try {
      let tabFileName = path.resolve(customFileTypePath);
      let tabFileNameOutput = path.resolve(customFileTypeOutputPath);

      //look for a custom filetype for this template
      fs.pathExists(tabFileName, (err, exists) => {
        if (exists === true) {
          if (patternlab.config.debug) {
            console.log('plugin-node-tab: copied pattern-specific ' + fileType + ' file for ' + pattern.patternPartial);
          }

          //copy the file to our output target if found
          fs.copy(tabFileName, tabFileNameOutput, {overwrite: true});
        } else {
          if (patternlab.config.debug) {
            console.log('plugin-node-tab: empty ' + fileType + ' file for ' + pattern.patternPartial + ' to prevent GET error');
          }
          //otherwise write nothing to the same location - this prevents GET errors on the tab.
          fs.outputFile(customFileTypeOutputPath, '');
        }
      });

    }
    catch (err) {
      if (patternlab.config.debug) {
        console.log('plugin-node-tab: There was an error parsing sibling ' + fileType + ' for ' + pattern.relPath);
        console.log(err);
      }
    }
  }
}

module.exports = findTab;
