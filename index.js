
let fs = require('fs');
let file = ("ff.csv")
let fileStream = fs.createReadStream(file)
let concatStringFile = "";
fileStream.setEncoding('utf8');

fileStream.on('data', function(chunk) {                
    concatStringFile += chunk;
})
fileStream.on('error', (err) => {
    err = new Error("createListFromBucket : List " + err.message);
    err.errorCode = 1001;
    reject(err);
})
fileStream.on('end', function(){
    let splitFile = concatStringFile.split("\n");
    let header = splitFile.shift();
    let res = delimResearchor(header, splitFile);
    return splitFile
})

function delimResearchor(header, data) {
    let bestDelimData = {};
    let bestDelimHeader = {};
    let delim, cptOccRow, max, nbOcc, delimInTest;
    let notFounded = 'not found';
    let delimChoices = [/[,]/g,/[;]/g,/[\t]/g,/[|]/g];
   
    for (let k = 0; k < delimChoices.length; k++) {
        delimInTest = delimToTest(k)
        nbOcc = (matchNb(header, delimChoices[k]))
        if (nbOcc >= 1) {
            bestDelimHeader[delimInTest.toString()] = nbOcc;
        }
        cptOccRow = 0;
        data.length > 6 ? max = 6 : max = data.length
        for (let i = 0; i < max ; i++) {
            let row = data[i];
            nbOcc = (matchNb(row, delimChoices[k]))
            if (nbOcc >= 1) {
                cptOccRow++;
                if (!(delimInTest.toString() in bestDelimData)) {
                  bestDelimData[delimInTest.toString()] = { occDelim: nbOcc }
                }
                Object.assign(bestDelimData[delimInTest], { occDelimRow: cptOccRow })
            }
        }
    }
    console.log(bestDelimData)
    console.log(bestDelimHeader)
    delim = GoodDelim(bestDelimHeader, bestDelimData)
    console.log(delim)
}

function matchNb(data, delimiter){
  let resultat = data.match(delimiter)
  
  if (resultat !== null || resultat > 0){
    return resultat.length; 
  } else {
    return 0;
  }
}

function delimToTest(num) {
    let delimiteur;
    switch (num){

        case 0 :
          delimiteur = ",";
          return delimiteur;
          break;

        case 1 :
          delimiteur = ";";
          return delimiteur;
          break;  

        case 2 :
          delimiteur = "\t";
          return delimiteur;
          break;

        case 3 :
          delimiteur = "|";
          return delimiteur;
          break;

        
    }
}

function GoodDelim(header, data){
    let occRowChoice = 0, delimChoice, tmpDelim;
    for(var key in data){
        tmpDelim = data[key].valueOf()
        if(header.hasOwnProperty(key)){
            if(header[key] <= tmpDelim.occDelim){
                if (occRowChoice === 0) {
                    delimChoice = key;
                    occRowChoice = tmpDelim.occDelimRow;
                } else if (occRowChoice <= tmpDelim.occDelimRow) {
                    delimChoice = key
                    occRowChoice = tmpDelim.occDelimRow;
                }
            }
        }
    }
    return delimChoice;
}
  
