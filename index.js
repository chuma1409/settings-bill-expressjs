const express = require('express');
const exphbs  = require('express-handlebars');
const SettingsBill = require('./settings-bill')
const bodyParser = require('body-parser')
const moment = require('moment');


const app = express();
const settingsBill = SettingsBill();

moment().format(); 

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({
    layoutsDir: './views/layouts'
}));

app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res){
    res.render('index', {
        settings: settingsBill.getSettings(),
        totals: settingsBill.totals()
    })
});
app.post('/settings', function(req, res){
  

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })
  
   res.redirect('/');
});
app.post('/action', function(req, res){
    res.redirect('/');

    if (!settingsBill.hasReachedCriticalLevel()) {
    settingsBill.recordAction(req.body.actionType)
    }
});
app.get('/actions', function(req, res){
var action = settingsBill.actions()
    for (let props of action){
        props.ago = moment(props.timestamp).fromNow()  
      }
   res.render('actions', {
       actions: action});
})
app.get('/actions/:actionType', function(req, res){
    
    var actionType = req.params.actionType;
  console.log( req.params.actionsType);

        var actionList = settingsBill.actionsFor(actionType)
        // console.log( settingsBill.actionsFor(actionType));
     for (let props of actionList){
          props.ago = moment(props.timestamp).fromNow() 
        }
    res.render('actions', {
        actions: actionList});
    
})
const PORT = process.env.PORT || 3011;


app.listen(PORT, function(){
    console.log("App started at port:", PORT)
});