const express = require('express');
const exphbs  = require('express-handlebars');
const { static } = require('express');
const SettingsBill = require('./settings-bill')
const bodyParser = require('body-parser')
const moment = require('moment');


const app = express();
const settingsBill = SettingsBill();
const recordedActions = settingsBill.actions();
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
    });
})
app.post('/settings', function(req, res){
  

    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost: req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })
    // console.log(settingsBill.getSettings());
   res.redirect('/');
})
app.post('/action', function(req, res){
    if (!settingsBill.hasReachedCriticalLevel()) {
    settingsBill.recordAction(req.body.actionType)
    }
    res.redirect('/');

})
app.get('/actions', function(req, res){
    for (const key of recordedActions){
        key.ago = moment(key.timestamp).fromNow() 
        
      }
   res.render('actions', {
       actions: recordedActions});
})
app.get('/actions/:actionType', function(req, res){
    const actionType = req.params.actionsType;
       const listOfActions = factoryFunction.getActions();
    
    for (action of listOfActions) {
        action.prettyDate = moment.fromNow(action.timestamp);
    }
    
    res.render("list", {
        actions : listOfActions
    });
});
const PORT = process.env.PORT || 3011;


app.listen(PORT, function(){
    console.log("App started at port:", PORT)
});