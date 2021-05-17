// JavaScript Document for Bootstrap Typeahed

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;
 
    // an array that will be populated with substring matches
    matches = [];
 
    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');
 
    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        // the typeahead jQuery plugin expects suggestions to a
        // JavaScript object, refer to typeahead docs for more info
        matches.push({ value: str });
      }
    });
 
    cb(matches);
  };
};
 
var tickNames = [
'ABT-US: Abbott Laboratories | NYSE - Adjusted for ABC company acquisition', 
'ABBV-US: AbbVie | NYSE',
'ATVI-US: Activision Blizzard | NASDAQ', 
'GAS-US: AGL Resources Inc. | NYSE', 
'GOOG-US: Alphabet Inc Class C | NASDAQ'
];
 
$('.tickName').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'tickName',
  displayKey: 'value',
  source: substringMatcher(tickNames)
});


var preNames = [
'Ringcentral', 
'Neustar',
'Telecommunication system', 
'Convergys Corp',
'Verisign',
'Blucora',
'Unwired Planet'
];
 
$('.preName').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'preName',
  displayKey: 'value',
  source: substringMatcher(preNames)
});