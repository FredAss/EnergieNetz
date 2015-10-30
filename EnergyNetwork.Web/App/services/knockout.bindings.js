define([
    'knockout',
    'services/appsecurity'
  ],
  function (ko, appsecurity) {

    ko.bindingHandlers.label = {
      update: function(element, valueAccessor) {
        var value = valueAccessor();
        var valueUnwrapped = ko.utils.unwrapObservable(value);
        if (valueUnwrapped === null) return;
        var label = ko.utils.unwrapObservable(valueUnwrapped.index);
        var title = ko.utils.unwrapObservable(valueUnwrapped.title);

        $(element).removeClass();
        switch (label) {
          case 0:
            $(element).addClass('bs-label label-warning');
            break;
          case 1:
            $(element).addClass('bs-label bs-label-primary');
            break;
          case 2:
            $(element).addClass('bs-label label-success');
            break;
          default:
            $(element).addClass('bs-label label-default');
            break;
        }
        ko.applyBindingsToNode(element, {
          text: language.getValue(title)
        });
      }
    };

    ko.bindingHandlers.trimLengthText = {};
    ko.bindingHandlers.trimText = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var trimmedText = ko.computed(function() {
          var untrimmedText = ko.utils.unwrapObservable(valueAccessor());
          var defaultMaxLength = 20;
          var minLength = 5;
          var maxLength = ko.utils.unwrapObservable(allBindingsAccessor().trimTextLength) || defaultMaxLength;
          if (maxLength < minLength)
            maxLength = minLength;
          var text = untrimmedText.length > maxLength ? untrimmedText.substring(0, maxLength - 1) + '...' : untrimmedText;
          return text;
        });
        ko.applyBindingsToNode(element, {
          text: trimmedText
        }, viewModel);

        return {
          controlsDescendantBindings: true
        };
      }
    };

    ko.bindingHandlers.valueNumber = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        var observable,
            properties = allBindingsAccessor();
        if (typeof valueAccessor() === 'function') {
          observable = valueAccessor();
        } else {
          observable = valueAccessor;
        }
        var interceptor = ko.computed({
          read: function() {
            var format = properties.numberFormat || "n2";
            return Globalize.format(observable(), format);
          },
          write: function(newValue) {
            var number = Globalize.parseFloat(newValue);
            if (number) {
              observable(number);
            }
          }
        });

        if (ko.utils.tagNameLower(element) === 'input') {
          ko.applyBindingsToNode(element, { value: interceptor });
        } else {
          ko.applyBindingsToNode(element, { text: interceptor });
        }
      }
    };

    ko.bindingHandlers.percentage = {
      init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        var observable,
            properties = allBindingsAccessor();
        if (typeof valueAccessor() === 'function') {
          observable = valueAccessor();
        } else {
          observable = valueAccessor;
        }
        var interceptor = ko.computed({
          read: function () {
            var format = properties.numberFormat || "n2";
            var value = Globalize.format(observable() * 100, format);
            var number = value.replace(',', '.');
            return parseFloat(number);
          },
          write: function (newValue) {
            var value = parseFloat(newValue) / 100;
            //value = value.replace('.', ',');
            //var number = Globalize.parseFloat(value);
            observable(value);
            
          }
        });

        if (ko.utils.tagNameLower(element) === 'input') {
          ko.applyBindingsToNode(element, { value: interceptor });
        } else {
          ko.applyBindingsToNode(element, { text: interceptor });
        }
      }
    };

    ko.bindingHandlers.trimNumeric = {
      update: function(element, valueAccessor, allBindingsAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor()),
            precision = ko.utils.unwrapObservable(allBindingsAccessor().precision) || ko.bindingHandlers.numericText.defaultPrecision,
            formattedValue = value.toFixed(precision);

        ko.bindingHandlers.text.update(element, function() {
          return formattedValue;
        });
      },
      defaultPrecision: 1
    };

    ko.bindingHandlers.phoneNumber = {
      update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        var phoneNumber = ko.computed(function () {
          var value = ko.utils.unwrapObservable(valueAccessor());
          return value.replace(/[()\-\'\.\/\\ ]/g, '').search(/[+]/) != -1
            ? 'tel:' + value.replace(/[()\-\'\.\/\\ ]/g, '') : value.replace(/[()\-\'\.\/\\ ]/g, '').slice(0, 1) == '0'
            ? 'tel:' + '+49' + value.replace(/[()\-\'\.\/\\ ]/g, '').slice(1) : 'tel:' + value.replace(/[()\-\'\.\/\\ ]/g, '');
        });
        ko.applyBindingsToNode(element, {
          attr: { href: phoneNumber }
        }, viewModel);

        return {
          controlsDescendantBindings: true
        };
      }
    };

    ko.bindingHandlers.fadeVisible = {
      init: function(element, valueAccessor) {
        var value = valueAccessor();
        $(element).height(0);
      },
      update: function(element, valueAccessor) {
        var value = valueAccessor();
        if (ko.unwrap(value)) {
          var autoHeight = $(element).css('height', 'auto').height();
          $(element).css('height', 0);
          $(element).animate({ height: autoHeight }, 'fast');
        } else {
          $(element).animate({ height: '0' }, 'fast');
        }
      }
    };

    ko.bindingHandlers.timeAgo = {
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var timeToBind = ko.computed(function() {
          moment.locale('de');
          var date = ko.utils.unwrapObservable(valueAccessor());
          var formattedDate = moment(date);
          var currentDate = moment();
          var diffDate = currentDate - date;
          if ((diffDate / 1000) >= 60 * 60 * 24) {
            return formattedDate.format('DD.MM.YYYY');
          } else {
            return formattedDate.fromNow(true);
          }
        });
        ko.applyBindingsToNode(element, {
          text: timeToBind
        }, viewModel);

        return {
          controlsDescendantBindings: true
        };
      }
    };

    ko.bindingHandlers.dateFormat = {};
    ko.bindingHandlers.formattedDate = {
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var dateToBind = ko.computed(function() {
          moment.locale('de');
          var date = ko.utils.unwrapObservable(valueAccessor());
          var formattedDate = moment(date);
          var defaultFormat = 'DD.MM.YYYY';
          var format = ko.utils.unwrapObservable(allBindings().dateFormat) || defaultFormat;
          return formattedDate.format(format);
        });
        ko.applyBindingsToNode(element, {
          value: dateToBind
        }, viewModel);

        return {
          controlsDescendantBindings: true
        };
      }
    };

    ko.bindingHandlers.textIfExists = {
      init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var text = ko.computed(function() {
          var text;
          try {
            text = ko.utils.unwrapObservable(valueAccessor());
          } catch (e) {
            text = 'undefined';
          } finally {
            return text;
          }
        });
        ko.applyBindingsToNode(element, {
          text: text
        }, viewModel);

        return {
          controlsDescendantBindings: true
        };
      }
    };

    ko.bindingHandlers.role = {
      init: function(element, valueAccessor, allBindings, viewModel) {
        var isInRole = ko.computed(function() {
          var requiredRole = ko.utils.unwrapObservable(valueAccessor());
          if (appsecurity.userInfo() === undefined) {
            return;
          }
          var userRoles = appsecurity.userInfo().roles();
          var authorized = false;
          _.forEach(userRoles, function(role) {
            if (_.contains(requiredRole, role)) {
              authorized = true;
            }
          });

          return authorized;
        });
        ko.applyBindingsToNode(element, {
          visible: isInRole
        }, viewModel);

      }
    };

    ko.bindingHandlers.sliderValue = {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var params = valueAccessor();

        // Check whether the value observable is either placed directly or in the paramaters object.
        if (!(ko.isObservable(params) || params['value']))
          throw "You need to define an observable value for the sliderValue. Either pass the observable directly or as the 'value' field in the parameters.";

        // Identify the value and initialize the slider
        var valueObservable;
        if (ko.isObservable(params)) {
          valueObservable = params;
          $(element).slider({ value: ko.unwrap(params) });
        } else {
          valueObservable = params['value'];
          // Replace the 'value' field in the options object with the actual value
          params['value'] = ko.unwrap(valueObservable);
          $(element).slider(params);
        }

        // Make sure we update the observable when changing the slider value
        $(element).on('slide', function(ev) {
          valueObservable(ev.value);
        });

      },
      update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var modelValue = valueAccessor();
        var valueObservable;
        if (ko.isObservable(modelValue))
          valueObservable = modelValue;
        else
          valueObservable = modelValue['value'];

        $(element).slider('setValue', parseFloat(valueObservable()));
      }
    };

  });