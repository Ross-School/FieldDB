/* globals FieldDB, window */

var GitImport;
var Participant;
var ComputationalLinguisticsCorpus;
var fs;
var mkdirp;
try {
  if (FieldDB) {
    GitImport = FieldDB.GitImport;
    Participant = FieldDB.Participant;
    ComputationalLinguisticsCorpus = FieldDB.ComputationalLinguisticsCorpus;
  }
} catch (e) {}

GitImport = GitImport || require("./../../api/import/GitImport").GitImport;
Participant = Participant || require("./../../api/user/Participant").Participant;
ComputationalLinguisticsCorpus = ComputationalLinguisticsCorpus || require("./../../api/corpus/ComputationalLinguisticsCorpus").ComputationalLinguisticsCorpus;
fs = fs || require("fs");
mkdirp = mkdirp || require("mkdirp");

var specIsRunningTooLong = 10 * 1000;
describe("api/import/GitImport", function() {
  beforeEach(function() {
    process.env.NODE_ENV = "";
  });

  try {
    if (window) {
      console.log("not running GitImport");
      return;
    }
  } catch (e) {}

  describe("construction", function() {

    it("should load", function() {
      expect(GitImport).toBeDefined();
    });

    it("should be able to instantiate an object", function() {
      var importer = new GitImport({
        // debugMode: true
      });
      expect(importer).toBeDefined();
    });
  });

  describe("as a computational linugist I want to import git repositories containing of text files for machine learning", function() {
    var corpus;
    var importer;

    var defaultOptions = {
      remoteUri: "https://github.com/expressjs/express.git",
      readOptions: {
        readFileFunction: function(options, callback) {
          importer.debug("calling fs.readFile", options.uri);
          fs.readFile(options.uri, "utf8", callback);
        }
      },
      fileExtensions: [".js", ".json"],
      preprocessOptions: {
        preprocessFunction: function(datum) {
          importer.debug("preprocessing datum");
          // datum.debugMode = true;
          return datum.extractStats();
        },
        writePreprocessedFileFunction: function(options, callback) {
          options.preprocessedUri = "." + options.preprocessedUri;
          var path = options.preprocessedUri.substring(0, options.preprocessedUri.lastIndexOf("/"));
          mkdirp(path, function(err) {
            if (err) {
              importer.debug("Error making preprocess dir", err);
              if (err.code !== "EEXIST") {
                throw err;
              }
            }
            fs.writeFile(options.preprocessedUri, options.body, "utf8", callback);
          });
        },
        transliterate: false,
        joinLines: false,
      },
      importOptions: {
        dryRun: true,
        fromPreprocessedFile: true
      }
    };

    beforeEach(function() {
      // var dbname = "testingbatchimport-git";
      corpus = new ComputationalLinguisticsCorpus({
        id: "expressjs/express",
        url: "https://github.com/expressjs/express.git",
        datumFields: [{
          type: "DatumField",
          id: "orthography"
        }],
        sessionFields: [{
          type: "DatumField",
          id: "source"
        }]
      });
      // corpus.dbname = dbname;
      corpus.language = {
        "ethnologueUrl": "",
        "wikipediaUrl": "",
        "iso": "",
        "locale": "",
        "englishName": "JavaScript",
        "nativeName": "",
        "alternateNames": "JS"
      };
      importer = new GitImport({
        // dbname: dbname,
        corpus: corpus
      });
    });

    it("should be able to import from a git repo", function(done) {
      // importer.debugMode = true;
      importer.clone(defaultOptions)
        .then(function(result) {
          importer.debug("result of clone", result.cloneMessage);
          expect(corpus.id).toEqual("expressjs/express");

          // run a subset
          importer.corpus.id = "expressjs/express/lib";

          return importer.findFiles(defaultOptions);
        })
        .then(function(result) {
          importer.debug("result of find files", result.fileTree);
          expect(result.findFilesMessage).toBeDefined();
          expect(result.fileList.length).toEqual(11);
          importer.debug("result.fileList", result.fileList);
          expect(result.fileTree).toBeDefined();
          expect(result.fileTree.path).toEqual("imported_corpora/expressjs/express/lib");
          expect(result.fileTree.children.length).toEqual(8);
          expect(result.fileTree.children[0].path).toEqual("imported_corpora/expressjs/express/lib/application.js");
          expect(defaultOptions.fileList[0]).toEqual("imported_corpora/expressjs/express/lib/application.js");
          return importer.addFileUris(defaultOptions);
        })
        .then(function(result) {
          importer.debug("after add file", result.rawText);
          expect(result).toBeDefined();
          expect(result.rawText).toBeUndefined();
          expect(result.datum).toBeUndefined();
          expect(importer.files.length).toEqual(result.fileList.length);
          expect(importer.datalist.length).toEqual(result.fileList.length);
        })
        .catch(function(err) {
           console.warn("findFiles error, test did not run completely on this OS", err);
           expect(err.message).toMatch(/tree:[a-z ]*not found/);
        })
        .finally(done);

    }, specIsRunningTooLong);

  });

});
