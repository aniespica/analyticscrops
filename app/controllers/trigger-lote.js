var fb = require('firebase-admin');
var moment = require('moment');

module.exports = {
    beforeInsert: () => {},
    beforeUpdate: () => {},
    afterInsert: (cid, cropid) => {
        let database = fb.database();
        lote = database.ref('Company/'+cid+'/Crops/'+cropid+'/Lotes'),
        crop = database.ref('Company/'+cid+'/Crops/'+cropid);
        
        crop.once('value', function (c) {
            if (c.val().isCalculate) {
                var area = 0, lara = 0, fieldCapacity = 0, last = 0;
                lote.once('value', function (lotes) {
                    lotes.forEach(function (l) {
                        last++;
                        if(l.val().Area) area += parseFloat(l.val().Area);
                        if(l.val().Lara) lara += parseFloat(l.val().Lara);
                        if(l.val().FieldCapacity) fieldCapacity += parseFloat(l.val().FieldCapacity);
                    })

                    lara = lara / last;
                    fieldCapacity = fieldCapacity / last;
                    
                    crop.update({
                        Area: area,
                        Lara: lara,
                        FieldCapacity: fieldCapacity
                    })

                })
            }
        })

    },
    afterUpdate: () => {},
    afterUndelete: () => {},
    afterUpdate: () => {},
    afterDelete: () => {}
}