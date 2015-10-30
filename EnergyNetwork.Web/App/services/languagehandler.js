define([
    'languages/de_DE',
    'languages/en_US',
    'moment',
    'bootbox'
  ],
  function(de_DE, en_US, moment, bootbox) {

    var selectedLanguage = ko.observable(de_DE);
    var defaultLanguage = ko.observable(de_DE);

    // We want OK and not Akzeptieren
    bootbox.addLocale("de", { OK: "OK", CANCEL: "Abbrechen", CONFIRM: "OK" });

    var languages = {
      "de-DE": de_DE,
      "en-US": en_US
    };
    var languageSetting = localStorage.getItem("selectedLang") || window.navigator.language;


    if (languageSetting.length === 5) {
      if (languages.hasOwnProperty(languageSetting)) {
        selectLanguage(languageSetting);
      }
    } else if (languageSetting.length === 2) {
      for (var key in languages) {
        if (key.indexOf(languageSetting) !== -1) {
          selectLanguage(key);
          break;
        }
      }
    }

    function selectLanguage(lang) {
      languageSetting = lang;
      Globalize.culture(lang);
      moment.locale(lang);
      selectedLanguage(languages[lang]);
      localStorage.setItem("selectedLang", lang);
      bootbox.setDefaults({ locale: lang.slice(0, 2), show: true });
    }

    var languagehandler = {
      getValue: function(index, viemodel) {
        return selectedLanguage().hasOwnProperty(index) ? selectedLanguage()[index] : defaultLanguage().hasOwnProperty(index) ? defaultLanguage()[index] : index;
      },

      change: function(lang) {
        selectLanguage(lang);
      },

      selectedLanguage: selectedLanguage,

      languageString: function() {
        return languageSetting;
      }

    };
    window.language = languagehandler;

    return languagehandler;
  })