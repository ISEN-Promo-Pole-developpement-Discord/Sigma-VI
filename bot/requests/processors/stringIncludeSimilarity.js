function includedSimilarity(container, contained) {
    container = normalize(container);
    contained = normalize(contained);
    var containerWords = container.split(" ");
    var containedWords = contained.split(" ");
    var containedWordsTotalLetters = 0;
    for(var word of containedWords){
      containedWordsTotalLetters += word.length;
    }
    var totalSimilarity = 0;
    for (var i = 0; i < containerWords.length; i++) {
        for (var j = 0; j < containedWords.length; j++) {
            var sim = similarity(containerWords[i], containedWords[j]);
            if(sim > 0.5){
              totalSimilarity += sim * (containedWords[j].length / containedWordsTotalLetters);
            }
        }
    }
    return totalSimilarity;
}

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 = normalize(s1);
    s2 = normalize(s2);
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function normalize(s){
    var norm = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    return norm.toLowerCase().trim().normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

module.exports = {includedSimilarity};