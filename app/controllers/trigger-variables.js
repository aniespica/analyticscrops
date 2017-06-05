var fb = require('firebase-admin');
var moment = require('moment');

module.exports = {
   beforeInsert: () => {},
   beforeUpdate: () => {},
   afterInsert: (cid, variable) => {
    let database = fb.database(),
    ref = database.ref('Company/'+cid+'/Crops');

    ref.once('value', function (snapshot) {
      if(snapshot.val()){
        let ckey = Object.keys(snapshot.val()),
        crops = snapshot.val()

        for(var i in ckey){
          var uObj = {},
          c = ckey[i]
          if (crops[c].Lotes) {
            uObj[crops[c]] = crops[c];
            var lKey = Object.keys(crops[c].Lotes)
            for(var l in lKey){
              var j = lKey[l]
              if(crops[c].Lotes[j].Variables){
                database.ref('Company/'+cid+'/Crops/'+c+'/Lotes/'+j+'/Variables/').update(variable)
              }
            }
          }
        }
      }
    })

 },
 afterUpdate: () => {},
 afterUndelete: () => {},
 afterUpdate: () => {},
 afterDelete: () => {}
}