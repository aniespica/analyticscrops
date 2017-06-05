var fb = require('firebase-admin');
var moment = require('moment');

module.exports = {
   beforeInsert: () => {},
   beforeUpdate: () => {},
   afterInsert: (cid, cropid, loteid, varid, notificated, average, StringDate, lastDate) => {
    let database = fb.database(),
    self = require('./trigger-value'),
    lote = database.ref('Company/'+cid+'/Crops/'+cropid+'/Lotes/'+loteid),
    crop = database.ref('Company/'+cid+'/Crops/'+cropid),
    date = StringDate.split(' ')[0];

    lote.once('value', function (c) {
      var Variables = c.val().Variables, result;
      Object.keys(Variables).forEach(function (keyVal) {
        Formula = Variables[keyVal].Formula
        invalidFormula = Variables[keyVal].invalidFormula
        if (invalidFormula === true) return 
        //Si hay formula y esta contiene la variable continua
        if(Formula && Formula.includes(varid)){
          
          var setupFormula = Formula.replace(/Prev[(]/g, '('),
              listFormulaVariables = Formula.replace(/Prev[(]/g, 'Prev|').replace(/[+-/*()]/g, '').split('  ')
          
          for(var i in listFormulaVariables ){
            var valueDate = date, 
                cloneVariable = listFormulaVariables[i];
            //Si la variable debe ser la anterior
            if (listFormulaVariables[i].includes('Prev|')) {
              cloneVariable = cloneVariable.replace('Prev|', '')
              //Si la variable no es la que se añadio un nuevo valor cambie la fecha a la anterior
              // if (cloneVariable !== varid) {
                valueDate = moment(valueDate).utc().add(-1, 'day').format('YYYY-MM-DD');
              // }
            }
              //Si la variable no existe actualizar la formula como invalida
            if (!Variables[cloneVariable]) {
              database.ref('Company/'+cid+'/Crops/'+cropid+'/Lotes/'+loteid + '/Variables/' + keyVal).update({invalidFormula: true})
              break
            }else {
              var newValue = 0, objUpdate 
              if (Variables[cloneVariable].Values) {
                const { Values } = Variables[cloneVariable]
                if(Values[valueDate]){
                  setupFormula = setupFormula.replace(new RegExp(listFormulaVariables[i], 'g'), Values[valueDate].Average)
                  continue
                }
                let variableValuesKeys = Object.keys(Values),
                    dateTimeValue = moment(valueDate).utc().valueOf();
                
                if (variableValuesKeys.length === 1 ){
                  newValue = Values[variableValuesKeys[0]].Average
                }else{
                  for(var j in variableValuesKeys){
                    let dateTimeKeyValue = moment(variableValuesKeys[j]).utc().valueOf();
                    newValue = Values[variableValuesKeys[j]].Average
                    //Si la fecha es mayor a la solicitada añadir ese valor
                    if ( dateTimeKeyValue > dateTimeValue) break
                  }  
                }
              }
              setupFormula = setupFormula.replace(new RegExp(listFormulaVariables[i], 'g'), newValue)
              objUpdate = {Average: newValue, Values: {} }
              objUpdate.Values[StringDate] = newValue
              database.ref('Company/'+cid+'/Crops/'+cropid+'/Lotes/'+loteid + '/Variables/' + cloneVariable + '/Values/' + valueDate ).update(objUpdate)

            }
          }

          result = parseFloat(solveStr(reformat(setupFormula)));

          if (isNaN(result) || !result && result !== 0) {
            // console.log('error trigger: ', result)
            // console.log('setup formula: ', setupFormula)
            // console.log('formula: ', Formula)
            return 
          }

          var obj = { 'Average': result, Values: {} };
          obj.Values[StringDate] = result
          database.ref('Company/'+cid+'/Crops/'+cropid+'/Lotes/'+loteid + '/Variables/' + keyVal + '/Values/' + date).update(obj, function (err) {
            if (!err && keyVal != varid) self.afterInsert(cid, cropid, loteid, keyVal, notificated, result, StringDate, lastDate)
          })

        }
      })
    })

 },
 afterUpdate: () => {},
 afterUndelete: () => {},
 afterUpdate: () => {},
 afterDelete: () => {}
}

function replaceAll(haystack, needle, replace) {
 return haystack.split(needle).join(replace);
} // replace all fx

function reformat(s) {
 s = s.toLowerCase();
 s = replaceAll(s, "-(", "-1*(");
 s = replaceAll(s, ")(", ")*(");
 s = replaceAll(s, " ", "");
 s = replaceAll(s, "-", "+-");
 s = replaceAll(s, "--", "+");
 s = replaceAll(s, "++", "+");
 s = replaceAll(s, "(+", "(");
 for (var i = 0; i < 10; i++) {
     s = replaceAll(s, i + "(", i + "*" + "(");
 }
 while(s.charAt(0) == "+") s = s.substr(1);
 // console.log(s);
 return s;
} // standardize string format

function strContain(haystack, needle) {
 return haystack.indexOf(needle) > -1;
} // custom true/false contains

function isParseable(n, minus) {
 return (!isNaN(n) || (n == "-" && !minus) || n == ".");
} // determine if char should be added to side

function getSide(haystack, middle, direction, minus) {
 var i = middle + direction;
 var term = "";
 var limit = (direction == -1) ? 0 : haystack.length; // set the stopping point, when you have gone too far
 while (i * direction <= limit) { // while the current position is >= 0, or <= upper limit
     if (isParseable(haystack[i], minus)) {
         if (direction == 1) term = term + haystack[i];
         else term = haystack[i] + term;
         i += direction;
     } else { return term; }
 }
 return term;
} // general fx to get two terms of any fx (multiply, add, etc)

function allocFx(eq, symbol, alloc, minus) {
 minus = (typeof minus !== 'undefined'); // sometimes we want to capture minus signs, sometimes not
 if (strContain(eq, symbol)) {
     var middleIndex = eq.indexOf(symbol);
     var left = getSide(eq, middleIndex, -1, minus);
     var right = getSide(eq, middleIndex, 1, false);
     eq = replaceAll(eq, left+symbol+right, alloc(left, right));
 }
 return eq;
} // fx to generically map a symbol to a function for parsing

function solveStr(eq) {
 firstNest:
 while (strContain(eq, "(")) { // while the string has any parentheses
     var first = eq.indexOf("("); // first get the earliest open parentheses
     var last = first + 1; // start searching at the character after
     var layer = 1; // we might run into more parentheses, so this integer will keep track
     while (layer != 0) { // loop this until we've found the close parenthesis
         if (eq[last] == ")") { // if we run into a close parenthesis, then subtract one from "layer"
             layer--;
             if (layer == 0) break; // if it is the corresponding closing parenthesis for our outermost open parenthesis, then we can deal with this expression
         }
         else if (eq[last] == "(") { // if we see an open parenthesis, add one to "layer"
             layer++;
         }
         last++; // increment the character we're looking at
         if (last > eq.length) break firstNest; 
     }
     
     var nested = eq.substr(first + 1, last - first - 1); // get the expression between the parentheses
     
     if (last + 1 <= eq.length) { // if there is exponentiation, change to a different symbol
         if (eq[last + 1] == "^") {
             eq = eq.substr(0, last + 1) + "&" + eq.substr((last+1)+1);
         }
     }
     
     var solvedStr = solveStr(nested);
     var preStr = "(" + nested + ")";
     eq = eq.replace(preStr, solvedStr); // replace parenthetical with value
 }
 while (strContain(eq, "^")) eq = allocFx(eq, "^", function(l, r) { return Math.pow(parseFloat(l),parseFloat(r)); }, false);
 while (strContain(eq, "&")) eq = allocFx(eq, "&", function(l, r) { return Math.pow(parseFloat(l),parseFloat(r)); }); // account for things like (-3)^2
 while (strContain(eq, "*") || strContain(eq, "/")) {
     var multiply = true;
     if (eq.indexOf("*") < eq.indexOf("/")) {
         multiply = (strContain(eq, "*"));
     } else {
         multiply = !(strContain(eq, "/"));
     }
     eq = (multiply) ? allocFx(eq, "*", function(l, r) { return parseFloat(l)*parseFloat(r); }) : allocFx(eq, "/", function(l, r) { return parseFloat(l)/parseFloat(r); });
 }
 while (strContain(eq, "+")) eq = allocFx(eq, "+", function(l, r) { return parseFloat(l)+parseFloat(r); });
 return eq;
} // main recursive fx + PEMDAS