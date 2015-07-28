"use strict";
var LanguageDatum;
try {
  /* globals FieldDB */
  if (FieldDB) {
    LanguageDatum = FieldDB.LanguageDatum;
  }
} catch (e) {}

LanguageDatum = LanguageDatum || require("./../../api/datum/LanguageDatum").LanguageDatum;

var SAMPLE_CORPUS = require("./../../api/corpus/corpus.json");
var mockCorpus = {
  updateDatumToCorpusFields: function(doc) {
    doc.fields = JSON.parse(JSON.stringify(SAMPLE_CORPUS.datumFields));
    return doc;
  }
};
describe("Test LanguageDatum", function() {
  it("should load", function() {
    expect(LanguageDatum).toBeDefined();

    var datum = new LanguageDatum();
    expect(datum).toBeDefined();
    expect(datum.fields).toBeUndefined();
  });

  describe("popular fields", function() {

    var datum = new LanguageDatum({
      corpus: mockCorpus,
      session: {
        fields: JSON.parse(JSON.stringify(SAMPLE_CORPUS.sessionFields))
      }
    });

    it("should get the fields from the corpus if corpus is available", function() {
      expect(datum.fields.length).toEqual(16);
    });

    it("should set the utterance", function() {
      datum.fields.utterance.value = "Noqata";
      expect(datum.fields.utterance.value).toEqual("Noqata");
      expect(datum.fields.utterance.help).toEqual("What was said/written in an alphabet the team is comfortable using.");
      expect(datum.fields.utterance.json).toEqual({
        writingSystem: {
          id: "",
          referenceLink: ""
        }
      });
    });

    it("should have a morphemes line ", function() {
      datum.fields.morphemes.value = "noqa-ta";
      expect(datum.fields.morphemes.value).toEqual("noqa-ta");
      expect(datum.fields.morphemes.json).toEqual({
        alternates: []
      });
    });

    it("should have a gloss line ", function() {
      datum.fields.gloss.value = "I-ACC";
      expect(datum.fields.gloss.value).toEqual("I-ACC");
      expect(datum.fields.gloss.json).toEqual({
        language: "",
        alternates: [],
        conventions: {
          id: "",
          tagSet: [],
          referenceLink: ""
        }
      });
    });

    it("should have a translation line ", function() {
      datum.fields.translation.value = "I";
      expect(datum.fields.translation.value).toEqual("I");
      expect(datum.fields.translation.json).toEqual({
        writingSystem: {
          id: "",
          referenceLink: ""
        },
        language: {
          ethnologueUrl: "",
          wikipediaUrl: "",
          iso: "",
          locale: "",
          englishName: "",
          nativeName: "",
          alternateNames: ""
        }
      });
    });

    it("should have grammatical judgement", function() {
      datum.fields.judgement.value = "*";
      expect(datum.fields.judgement.value).toEqual("*");
      expect(datum.fields.judgement.json).toEqual({
        "grammatical": true
      });
    });

    it("should have open ended tags", function() {
      datum.fields.tags.value = "Causative";
      expect(datum.fields.tags.value).toEqual("Causative");
      expect(datum.fields.tags.json).toEqual({
        tags: []
      });
    });

    it("should have a validation status of who checked the data", function() {
      datum.fields.validationStatus.value = "CheckedByPhylis, ToBeCheckedWithRejean";
      expect(datum.fields.validationStatus.value).toEqual("CheckedByPhylis, ToBeCheckedWithRejean");
      expect(datum.fields.validationStatus.json).toEqual({
        tags: []
      });
    });


  });

  describe("IGT support", function() {
    var datum;
    beforeEach(function() {
      datum = new LanguageDatum({
        corpus: mockCorpus
      });
    });

    it("should represent IGT data in tuples and parallel text", function() {
      datum.orthography = "puppies";
      datum.utterance = "pʌpiz";
      datum.morphemes = "pʌpi-z";
      datum.allomorphs = "pʌpi-z";
      datum.gloss = "puppy-pl";

      datum.translation = "Des chiens";

      expect(datum.fields.utterance.help).toEqual("What was said/written in an alphabet the team is comfortable using.");

      // datum.debugMode = true;
      var igtAligned = datum.igt;
      expect(igtAligned.tuples[0].orthography).toEqual("puppies");
      expect(igtAligned.tuples[0].utterance).toEqual("pʌpiz");
      expect(igtAligned.tuples[0].allomorphs).toEqual("pʌpi-z");
      expect(igtAligned.tuples[0].morphemes).toEqual("pʌpi-z");
      expect(igtAligned.tuples[0].gloss).toEqual("puppy-pl");
      expect(igtAligned.tuples[0].syntacticCategory).toEqual("");

      expect(igtAligned.parallelText.orthography).toEqual("puppies");
      expect(igtAligned.parallelText.utterance).toEqual("pʌpiz");
      expect(igtAligned.parallelText.translation).toEqual("Des chiens");

    });


    it("should tollerate slightly unaligned IGT data", function() {
      // datum.fields.orthography.value = "this field has many words";
      datum.utterance = "this field has many words";
      datum.morphemes = "this field has fewer";
      // datum.allomorphs = "this field has many words";
      datum.gloss = "this field has many words";

      datum.translation = "totally different word count but its okay";

      // datum.debugMode = true;
      var igt = datum.igt;

      expect(igt.tuples[4]).toEqual({
        orthography: "",
        utterance: "words",
        allomorphs: "",
        morphemes: "",
        gloss: "words",
        syntacticCategory: ""
      });
    });


    it("should non-lossily tollerate drastically unaligned IGT data", function() {
      // datum.fields.orthography.value = "this field has many words";
      datum.utterance = "this field has fewer";
      datum.morphemes = "this field has many more segmentations than the utterance line and will dictate the length of the tuples so they are non-lossy";
      // datum.allomorphs = "this field has many words";
      datum.gloss = "this field has many words";

      datum.translation = "totally different word count but its okay";

      // datum.debugMode = true;
      var igt = datum.igt;

      expect(igt.tuples[igt.tuples.length - 1]).toEqual({
        orthography: "",
        utterance: "",
        allomorphs: "",
        morphemes: "non-lossy",
        gloss: "",
        syntacticCategory: ""
      });
    });


    it("should tollerate abnormal/irregular whitespacing", function() {
      datum.orthography = "this\tline\tis\t\"tabbed\"";
      datum.utterance = "this line is spaced";
      datum.morphemes = " this\t\tline is\na-combo";
      datum.allomorphs = "this\nline\n\nis\nline-breaked";
      datum.gloss = "this line (has punctuation)";

      datum.translation = "Des chiens";

      var igt = datum.igt;
      // datum.debugMode = true;
      expect(igt.tuples[igt.tuples.length - 1]).toEqual({
        orthography: "\"tabbed\"",
        utterance: "spaced",
        allomorphs: "line-breaked",
        morphemes: "a-combo",
        gloss: "punctuation)",
        syntacticCategory: ""
      });
    });

  });


});
