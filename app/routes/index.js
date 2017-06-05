var express  = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var ctrl = require('../controllers/crops');
var ctrlL = require('../controllers/lotes');
var ctrlV = require('../controllers/values');

router.use(function(req, res, next){
  next();
});

router.get('/*', function(req, res){
	return res.render('index');
})
router.post('/add/crop', ctrl.addCrop);
router.post('/upsert/lote', ctrlL.addLote);
router.post('/upsert/value', ctrlV.addValue);
router.post('/upsert/variable', ctrlV.addVariable);
router.post('/upsert/sensor', ctrlV.addSensor);
router.post('/delete/crop', ctrl.deleteCrop);
router.post('/delete/lote', ctrlL.deleteLote);
router.post('/delete/value', ctrlV.deleteValue);
router.post('/delete/variable', ctrlV.deleteVariable);
router.post('/delete/sensor', ctrlV.deleteSensor);
router.post('/add/value/sensor', ctrlV.addValueSensor)

module.exports = router;