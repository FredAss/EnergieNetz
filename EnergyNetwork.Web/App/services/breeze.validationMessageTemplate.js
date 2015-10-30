define(function() {


  return {
      
      required: language.getValue('required_validation'),
      min: language.getValue('min_validation'),
      max: language.getValue('max_validation'),
      minLength: language.getValue('minLength_validation'),
      maxLength: language.getValue('maxLength_validation'),
      pattern: language.getValue('pattern_validation'),
      step: language.getValue('step_validation'),
      email: language.getValue('email_validation'),
      date: language.getValue('date_validation'),
      dateISO: language.getValue('dateISO_validation'),
      number: language.getValue('number_validation'),
      digit: language.getValue('digit_validation'),
      phoneUS: language.getValue('phoneUS_validation'),
      equal: language.getValue('equal_validation'),
      notEqual: language.getValue('notEqual_validation'),
      unique: language.getValue('unique_validation'),

      bool: language.getValue('bool_validation'),
      creditCard: language.getValue('creditCard_validation'),

      integer: language.getValue('integer_validation'),

      url: language.getValue('url_validation'),
  };
});