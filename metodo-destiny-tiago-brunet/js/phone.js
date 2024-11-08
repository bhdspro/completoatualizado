$(document).ready(function(){
// instances declarations
var inputPhone1 = document.querySelector("#input-phone-1");
// instances validation messages
 // instance 2
// Begin instance 2
 window.intlTelInput(inputPhone1, {
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "br";
      callback(countryCode);
    });
  },
  preferredCountries: ["br", "us", "pt"],
});
//End instance 2

// instances declarations
var inputPhone2 = document.querySelector("#input-phone-2");
// instances validation messages
 // instance 3
// Begin instance 3
 window.intlTelInput(inputPhone2, {
     // just for formatting/placeholders etc
  utilsScript: "../../build/js/utils.js?1638200991544", 
  // properties
  initialCountry: "auto",
  placeholderNumberType: 'FIXED_LINE',
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "br";
      callback(countryCode);
    });
  },
  preferredCountries: ["br", "us", "pt"],
});
//End instance 3

// instances declarations
var inputPhone3 = document.querySelector("#input-phone-3");
// instances validation messages
 // instance 4
// Begin instance 4
 window.intlTelInput(inputPhone3, {
     // just for formatting/placeholders etc
  utilsScript: "../../build/js/utils.js?1638200991544", 
  // properties
  initialCountry: "auto",
  placeholderNumberType: 'FIXED_LINE',
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "br";
      callback(countryCode);
    });
  },
  preferredCountries: ["br", "us", "pt"],
});
//End instance 4

// instances declarations
var inputPhone4 = document.querySelector("#input-phone-4");
// instances validation messages
 // instance 5
// Begin instance 5
 window.intlTelInput(inputPhone4, {
     // just for formatting/placeholders etc
  utilsScript: "../../build/js/utils.js?1638200991544", 
  // properties
  initialCountry: "auto",
  placeholderNumberType: 'FIXED_LINE',
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "br";
      callback(countryCode);
    });
  },
  preferredCountries: ["br", "us", "pt"],
});
//End instance 5

// instances declarations
var inputPhone5 = document.querySelector("#input-phone-5");
// instances validation messages
 // instance 6
// Begin instance 6
 window.intlTelInput(inputPhone5, {
     // just for formatting/placeholders etc
  utilsScript: "../../build/js/utils.js?1638200991544", 
  // properties
  initialCountry: "auto",
  placeholderNumberType: 'FIXED_LINE',
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "br";
      callback(countryCode);
    });
  },
  preferredCountries: ["br", "us", "pt"],
});
//End instance 6

// instances declarations
var inputPhone6 = document.querySelector("#input-phone-6");
// instances validation messages
 // instance 7
 window.intlTelInput(inputPhone6, {
     // just for formatting/placeholders etc
  utilsScript: "../../build/js/utils.js?1638200991544", 
  // properties
  initialCountry: "auto",
  placeholderNumberType: 'FIXED_LINE',
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "br";
      callback(countryCode);
    });
  },
  preferredCountries: ["br", "us", "pt"],
});
//End instance 7

// instances declarations
var inputPhone7 = document.querySelector("#input-phone-7");
// instances validation messages
 // instance 8
 window.intlTelInput(inputPhone7, {
     // just for formatting/placeholders etc
  utilsScript: "../../build/js/utils.js?1638200991544", 
  // properties
  initialCountry: "auto",
  placeholderNumberType: 'FIXED_LINE',
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "br";
      callback(countryCode);
    });
  },
  preferredCountries: ["br", "us", "pt"],
});
//End instance 8

// instances declarations
var inputPhone8 = document.querySelector("#input-phone-8");
// instances validation messages
 // instance 9
 window.intlTelInput(inputPhone8, {
     // just for formatting/placeholders etc
  utilsScript: "../../build/js/utils.js?1638200991544", 
  // properties
  initialCountry: "auto",
  placeholderNumberType: 'FIXED_LINE',
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "br";
      callback(countryCode);
    });
  },
  preferredCountries: ["br", "us", "pt"],
});
//End instance 9

// instances declarations
var inputPhone9 = document.querySelector("#input-phone-9");
// instances validation messages
 // instance 10
 window.intlTelInput(inputPhone9, {
     // just for formatting/placeholders etc
  utilsScript: "../../build/js/utils.js?1638200991544", 
  // properties
  initialCountry: "auto",
  placeholderNumberType: 'FIXED_LINE',
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "br";
      callback(countryCode);
    });
  },
  preferredCountries: ["br", "us", "pt"],
});
//End instance 10

// instances declarations
var inputPhone10 = document.querySelector("#input-phone-10");
// instances validation messages
 // instance 11
 window.intlTelInput(inputPhone10, {
     // just for formatting/placeholders etc
  utilsScript: "../../build/js/utils.js?1638200991544", 
  // properties
  initialCountry: "auto",
  placeholderNumberType: 'FIXED_LINE',
  geoIpLookup: function(callback) {
    $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
      var countryCode = (resp && resp.country) ? resp.country : "br";
      callback(countryCode);
    });
  },
  preferredCountries: ["br", "us", "pt"],
});
//End instance 11

});