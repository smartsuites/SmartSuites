import { Component, OnInit } from '@angular/core';
import {EventService} from "../../service/event/event.service";
import {AppComponent} from "../../app.component";
import {CommonService} from "../../service/common/common.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  echarts:any
  nv:any
  d3:any
  THREE:any

  interpreters = [];

  constructor(private eventService: EventService,
              public appCom: AppComponent,
              private commonService:CommonService) {
    let self = this;

    self.echarts = commonService._echarts
    self.nv = commonService._nv
    self.d3 = commonService._d3
    self.THREE = commonService._three

    this.interpreters = [
      {image: 'alluxio.png'},
      {image: 'bigquery.png'},
      {image: 'beam.png'},
      {image: 'cassandra.png'},
      {image: 'ealstic.png'},
      {image: 'flink.png'},
      {image: 'geode.png'},
      {image: 'hbase.png'},
      {image: 'ignite.png'},
      {image: 'jdbc.png'},
      {image: 'kylin.png'},
      {image: 'neo4j.png'},
      {image: 'pig.png'},
      {image: 'hive.png'},
      {image: 'hadoop.png'},
      {image: 'scalding.png'},
      {image: 'spark.png'}
    ];
  }

  generatePieChart(){
    let self = this;
    var testdata = [
      {key: "管理人员", y: 1},
      {key: "业务人员", y: 20},
      {key: "分析人员", y: 9}
    ];

    var height = 350;
    var width = 350;

    var chart1 = self.nv.models.pieChart()
      .x(function(d) { return d.key })
      .y(function(d) { return d.y })
      .donut(true)
      .width(width)
      .height(height)
      .padAngle(.08)
      .cornerRadius(5)
      .id('donut1'); // allow custom CSS for this one svg

    chart1.title("100%");
    chart1.pie.showLabels(false).donut(true);

    self.d3.select('#piechart').append("svg")
      .datum(testdata)
      .transition().duration(1200)
      .call(chart1);
  }

  generateMultiBarChart(){

    let self = this;

    function stream_index(d, i) {
      return {x: i, y: Math.max(0, d)};
    }

    function stream_layers(n, m, o) {
      if (arguments.length < 3) o = 0;
      function bump(a) {
        var x = 1 / (.1 + Math.random()),
          y = 2 * Math.random() - .5,
          z = 10 / (.1 + Math.random());
        for (var i = 0; i < m; i++) {
          var w = (i / m - y) * z;
          a[i] += x * Math.exp(-w * w);
        }
      }
      return self.d3.range(n).map(function() {
        var a = [], i;
        for (i = 0; i < m; i++) a[i] = o + o * Math.random();
        for (i = 0; i < 5; i++) bump(a);
        return a.map(stream_index);
      });
    }

    //Generate some nice data.
    function exampleData() {
      return stream_layers(3,10+Math.random()*100,.1).map(function(data, i) {
        let key = "已完成"
        if(i==0)
          key = "已完成"
        else if(i==1)
          key = "失败"
        else
          key = "未运行"
        return {
          key: key,
          values: data
        };
      });
    }

    var chart = self.nv.models.multiBarChart()
      .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
      .rotateLabels(0)      //Angle to rotate x-axis labels.
      .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
      .groupSpacing(0.1)    //Distance between each group of bars.
      .stacked(true)
    ;

    chart.xAxis
      .tickFormat(self.d3.format(',f'));

    chart.yAxis
      .tickFormat(self.d3.format(',.1f'));

    self.d3.select('#multibar').append("svg")
      .datum(exampleData())
      .call(chart);

    self.nv.utils.windowResize(chart.update);
  }

  /*generateStackedArea(){
    let self = this;
    var histcatexplong = [
      {
        "key" : "Consumer Discretionary" ,
        "values" : [ [ 1138683600000 , 27.38478809681] , [ 1141102800000 , 27.371377218208] , [ 1143781200000 , 26.309915460827] , [ 1146369600000 , 26.425199957521] , [ 1149048000000 , 26.823411519395] , [ 1151640000000 , 23.850443591584] , [ 1154318400000 , 23.158355444054] , [ 1156996800000 , 22.998689393694] , [ 1159588800000 , 27.977128511299] , [ 1162270800000 , 29.073672469721] , [ 1164862800000 , 28.587640408904] , [ 1167541200000 , 22.788453687638] , [ 1170219600000 , 22.429199073597] , [ 1172638800000 , 22.324103271051] , [ 1175313600000 , 17.558388444186] , [ 1177905600000 , 16.769518096208] , [ 1180584000000 , 16.214738201302] , [ 1183176000000 , 18.729632971228] , [ 1185854400000 , 18.814523318848] , [ 1188532800000 , 19.789986451358] , [ 1191124800000 , 17.070049054933] , [ 1193803200000 , 16.121349575715] , [ 1196398800000 , 15.141659430091] , [ 1199077200000 , 17.175388025298] , [ 1201755600000 , 17.286592443521] , [ 1204261200000 , 16.323141626569] , [ 1206936000000 , 19.231263773952] , [ 1209528000000 , 18.446256391094] , [ 1212206400000 , 17.822632399764] , [ 1214798400000 , 15.539366475979] , [ 1217476800000 , 15.255131790216] , [ 1220155200000 , 15.660963922593] , [ 1222747200000 , 13.254482273697] , [ 1225425600000 , 11.920796202299] , [ 1228021200000 , 12.122809090925] , [ 1230699600000 , 15.691026271393] , [ 1233378000000 , 14.720881635107] , [ 1235797200000 , 15.387939360044] , [ 1238472000000 , 13.765436672229] , [ 1241064000000 , 14.6314458648] , [ 1243742400000 , 14.292446536221] , [ 1246334400000 , 16.170071367016] , [ 1249012800000 , 15.948135554337] , [ 1251691200000 , 16.612872685134] , [ 1254283200000 , 18.778338719091] , [ 1256961600000 , 16.75602606542] , [ 1259557200000 , 19.385804443147] , [ 1262235600000 , 22.950590240168] , [ 1264914000000 , 23.61159018141] , [ 1267333200000 , 25.708586989581] , [ 1270008000000 , 26.883915999885] , [ 1272600000000 , 25.893486687065] , [ 1275278400000 , 24.678914263176] , [ 1277870400000 , 25.937275793023] , [ 1280548800000 , 29.46138169384] , [ 1283227200000 , 27.357322961862] , [ 1285819200000 , 29.057235285673] , [ 1288497600000 , 28.549434189386] , [ 1291093200000 , 28.506352379723] , [ 1293771600000 , 29.449241421597] , [ 1296450000000 , 25.796838168807] , [ 1298869200000 , 28.740145449189] , [ 1301544000000 , 22.091744141872] , [ 1304136000000 , 25.079662545409] , [ 1306814400000 , 23.674906973064] , [ 1309406400000 , 23.41800274293] , [ 1312084800000 , 23.243644138871] , [ 1314763200000 , 31.591854066817] , [ 1317355200000 , 31.497112374114] , [ 1320033600000 , 26.672380820431] , [ 1322629200000 , 27.297080015495] , [ 1325307600000 , 20.174315530051] , [ 1327986000000 , 19.631084213899] , [ 1330491600000 , 20.366462219462] , [ 1333166400000 , 17.429019937289] , [ 1335758400000 , 16.75543633539] , [ 1338436800000 , 16.182906906042]]
      } ,
      {
        "key" : "Consumer Staples" ,
        "values" : [ [ 1138683600000 , 7.2800122043237] , [ 1141102800000 , 7.1187787503354] , [ 1143781200000 , 8.351887016482] , [ 1146369600000 , 8.4156698763993] , [ 1149048000000 , 8.1673298604231] , [ 1151640000000 , 5.5132447126042] , [ 1154318400000 , 6.1152537710599] , [ 1156996800000 , 6.076765091942] , [ 1159588800000 , 4.6304473798646] , [ 1162270800000 , 4.6301068469402] , [ 1164862800000 , 4.3466656309389] , [ 1167541200000 , 6.830104897003] , [ 1170219600000 , 7.241633040029] , [ 1172638800000 , 7.1432372054153] , [ 1175313600000 , 10.608942063374] , [ 1177905600000 , 10.914964549494] , [ 1180584000000 , 10.933223880565] , [ 1183176000000 , 8.3457524851265] , [ 1185854400000 , 8.1078413081882] , [ 1188532800000 , 8.2697185922474] , [ 1191124800000 , 8.4742436475968] , [ 1193803200000 , 8.4994601179319] , [ 1196398800000 , 8.7387319683243] , [ 1199077200000 , 6.8829183612895] , [ 1201755600000 , 6.984133637885] , [ 1204261200000 , 7.0860136043287] , [ 1206936000000 , 4.3961787956053] , [ 1209528000000 , 3.8699674365231] , [ 1212206400000 , 3.6928925238305] , [ 1214798400000 , 6.7571718894253] , [ 1217476800000 , 6.4367313362344] , [ 1220155200000 , 6.4048441521454] , [ 1222747200000 , 5.4643833239669] , [ 1225425600000 , 5.3150786833374] , [ 1228021200000 , 5.3011272612576] , [ 1230699600000 , 4.1203601430809] , [ 1233378000000 , 4.0881783200525] , [ 1235797200000 , 4.1928665957189] , [ 1238472000000 , 7.0249415663205] , [ 1241064000000 , 7.006530880769] , [ 1243742400000 , 6.994835633224] , [ 1246334400000 , 6.1220222336254] , [ 1249012800000 , 6.1177436137653] , [ 1251691200000 , 6.1413396231981] , [ 1254283200000 , 4.8046006145874] , [ 1256961600000 , 4.6647600660544] , [ 1259557200000 , 4.544865006255] , [ 1262235600000 , 6.0488249316539] , [ 1264914000000 , 6.3188669540206] , [ 1267333200000 , 6.5873958262306] , [ 1270008000000 , 6.2281189839578] , [ 1272600000000 , 5.8948915746059] , [ 1275278400000 , 5.5967320482214] , [ 1277870400000 , 0.99784432084837] , [ 1280548800000 , 1.0950794175359] , [ 1283227200000 , 0.94479734407491] , [ 1285819200000 , 1.222093988688] , [ 1288497600000 , 1.335093106856] , [ 1291093200000 , 1.3302565104985] , [ 1293771600000 , 1.340824670897] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 4.4583692315] , [ 1320033600000 , 3.6493043348059] , [ 1322629200000 , 3.8610064091761] , [ 1325307600000 , 5.5144800685202] , [ 1327986000000 , 5.1750695220792] , [ 1330491600000 , 5.6710066952691] , [ 1333166400000 , 8.5658461590953] , [ 1335758400000 , 8.6135447714243] , [ 1338436800000 , 8.0231460925212]]
      } ,
      {
        "key" : "Energy" ,
        "values" : [ [ 1138683600000 , 1.544303464167] , [ 1141102800000 , 1.4387289432421] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 1.328626801128] , [ 1154318400000 , 1.2874050802627] , [ 1156996800000 , 1.0872743105593] , [ 1159588800000 , 0.96042562635813] , [ 1162270800000 , 0.93139372870616] , [ 1164862800000 , 0.94432167305385] , [ 1167541200000 , 1.277750166208] , [ 1170219600000 , 1.2204893886811] , [ 1172638800000 , 1.207489123122] , [ 1175313600000 , 1.2490651414113] , [ 1177905600000 , 1.2593129913052] , [ 1180584000000 , 1.373329808388] , [ 1183176000000 , 0] , [ 1185854400000 , 0] , [ 1188532800000 , 0] , [ 1191124800000 , 0] , [ 1193803200000 , 0] , [ 1196398800000 , 0] , [ 1199077200000 , 0] , [ 1201755600000 , 0] , [ 1204261200000 , 0] , [ 1206936000000 , 0] , [ 1209528000000 , 0] , [ 1212206400000 , 0] , [ 1214798400000 , 0] , [ 1217476800000 , 0] , [ 1220155200000 , 0] , [ 1222747200000 , 1.4516108933695] , [ 1225425600000 , 1.1856025268225] , [ 1228021200000 , 1.3430470355439] , [ 1230699600000 , 2.2752595354509] , [ 1233378000000 , 2.4031560010523] , [ 1235797200000 , 2.0822430731926] , [ 1238472000000 , 1.5640902826938] , [ 1241064000000 , 1.5812873972356] , [ 1243742400000 , 1.9462448548894] , [ 1246334400000 , 2.9464870223957] , [ 1249012800000 , 3.0744699383222] , [ 1251691200000 , 2.9422304628446] , [ 1254283200000 , 2.7503075599999] , [ 1256961600000 , 2.6506701800427] , [ 1259557200000 , 2.8005425319977] , [ 1262235600000 , 2.6816184971185] , [ 1264914000000 , 2.681206271327] , [ 1267333200000 , 2.8195488011259] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 1.0687057346382] , [ 1280548800000 , 1.2539400544134] , [ 1283227200000 , 1.1862969445955] , [ 1285819200000 , 0] , [ 1288497600000 , 0] , [ 1291093200000 , 0] , [ 1293771600000 , 0] , [ 1296450000000 , 1.941972859484] , [ 1298869200000 , 2.1142247697552] , [ 1301544000000 , 2.3788590206824] , [ 1304136000000 , 2.5337302877545] , [ 1306814400000 , 2.3163370395199] , [ 1309406400000 , 2.0645451843195] , [ 1312084800000 , 2.1004446672411] , [ 1314763200000 , 3.6301875804303] , [ 1317355200000 , 2.454204664652] , [ 1320033600000 , 2.196082370894] , [ 1322629200000 , 2.3358418255202] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0.39001201038526] , [ 1335758400000 , 0.30945472725559] , [ 1338436800000 , 0.31062439305591]]
      } ,
      {
        "key" : "Financials" ,
        "values" : [ [ 1138683600000 , 13.356778764352] , [ 1141102800000 , 13.611196863271] , [ 1143781200000 , 6.895903006119] , [ 1146369600000 , 6.9939633271352] , [ 1149048000000 , 6.7241510257675] , [ 1151640000000 , 5.5611293669516] , [ 1154318400000 , 5.6086488714041] , [ 1156996800000 , 5.4962849907033] , [ 1159588800000 , 6.9193153169279] , [ 1162270800000 , 7.0016334389777] , [ 1164862800000 , 6.7865422443273] , [ 1167541200000 , 9.0006454225383] , [ 1170219600000 , 9.2233916171431] , [ 1172638800000 , 8.8929316009479] , [ 1175313600000 , 10.345937520404] , [ 1177905600000 , 10.075914677026] , [ 1180584000000 , 10.089006188111] , [ 1183176000000 , 10.598330295008] , [ 1185854400000 , 9.968954653301] , [ 1188532800000 , 9.7740580198146] , [ 1191124800000 , 10.558483060626] , [ 1193803200000 , 9.9314651823603] , [ 1196398800000 , 9.3997715873769] , [ 1199077200000 , 8.4086493387262] , [ 1201755600000 , 8.9698309085926] , [ 1204261200000 , 8.2778357995396] , [ 1206936000000 , 8.8585045600123] , [ 1209528000000 , 8.7013756413322] , [ 1212206400000 , 7.7933605469443] , [ 1214798400000 , 7.0236183483064] , [ 1217476800000 , 6.9873088186829] , [ 1220155200000 , 6.8031713070097] , [ 1222747200000 , 6.6869531315723] , [ 1225425600000 , 6.138256993963] , [ 1228021200000 , 5.6434994016354] , [ 1230699600000 , 5.495220262512] , [ 1233378000000 , 4.6885326869846] , [ 1235797200000 , 4.4524349883438] , [ 1238472000000 , 5.6766520778185] , [ 1241064000000 , 5.7675774480752] , [ 1243742400000 , 5.7882863168337] , [ 1246334400000 , 7.2666010034924] , [ 1249012800000 , 7.519182132226] , [ 1251691200000 , 7.849651451445] , [ 1254283200000 , 10.383992037985] , [ 1256961600000 , 9.0653691861818] , [ 1259557200000 , 9.6705248324159] , [ 1262235600000 , 10.856380561349] , [ 1264914000000 , 11.27452370892] , [ 1267333200000 , 11.754156529088] , [ 1270008000000 , 8.2870811422456] , [ 1272600000000 , 8.0210264360699] , [ 1275278400000 , 7.5375074474865] , [ 1277870400000 , 8.3419527338039] , [ 1280548800000 , 9.4197471818443] , [ 1283227200000 , 8.7321733185797] , [ 1285819200000 , 9.6627062648126] , [ 1288497600000 , 10.187962234549] , [ 1291093200000 , 9.8144201733476] , [ 1293771600000 , 10.275723361713] , [ 1296450000000 , 16.796066079353] , [ 1298869200000 , 17.543254984075] , [ 1301544000000 , 16.673660675084] , [ 1304136000000 , 17.963944353609] , [ 1306814400000 , 16.637740867211] , [ 1309406400000 , 15.84857094609] , [ 1312084800000 , 14.767303362182] , [ 1314763200000 , 24.778452182432] , [ 1317355200000 , 18.370353229999] , [ 1320033600000 , 15.2531374291] , [ 1322629200000 , 14.989600840649] , [ 1325307600000 , 16.052539160125] , [ 1327986000000 , 16.424390322793] , [ 1330491600000 , 17.884020741105] , [ 1333166400000 , 7.1424929577921] , [ 1335758400000 , 7.8076213051482] , [ 1338436800000 , 7.2462684949232]]
      } ,
      {
        "key" : "Health Care" ,
        "values" : [ [ 1138683600000 , 14.212410956029] , [ 1141102800000 , 13.973193618249] , [ 1143781200000 , 15.218233920665] , [ 1146369600000 , 14.38210972745] , [ 1149048000000 , 13.894310878491] , [ 1151640000000 , 15.593086090032] , [ 1154318400000 , 16.244839695188] , [ 1156996800000 , 16.017088850646] , [ 1159588800000 , 14.183951830055] , [ 1162270800000 , 14.148523245697] , [ 1164862800000 , 13.424326059972] , [ 1167541200000 , 12.974450435753] , [ 1170219600000 , 13.23247041802] , [ 1172638800000 , 13.318762655574] , [ 1175313600000 , 15.961407746104] , [ 1177905600000 , 16.287714639805] , [ 1180584000000 , 16.246590583889] , [ 1183176000000 , 17.564505594809] , [ 1185854400000 , 17.872725373165] , [ 1188532800000 , 18.018998508757] , [ 1191124800000 , 15.584518016603] , [ 1193803200000 , 15.480850647181] , [ 1196398800000 , 15.699120036984] , [ 1199077200000 , 19.184281817226] , [ 1201755600000 , 19.691226605207] , [ 1204261200000 , 18.982314051295] , [ 1206936000000 , 18.707820309008] , [ 1209528000000 , 17.459630929761] , [ 1212206400000 , 16.500616076782] , [ 1214798400000 , 18.086324003979] , [ 1217476800000 , 18.929464156258] , [ 1220155200000 , 18.233728682084] , [ 1222747200000 , 16.315776297325] , [ 1225425600000 , 14.63289219025] , [ 1228021200000 , 14.667835024478] , [ 1230699600000 , 13.946993947308] , [ 1233378000000 , 14.394304684397] , [ 1235797200000 , 13.724462792967] , [ 1238472000000 , 10.930879035806] , [ 1241064000000 , 9.8339915513708] , [ 1243742400000 , 10.053858541872] , [ 1246334400000 , 11.786998438287] , [ 1249012800000 , 11.780994901769] , [ 1251691200000 , 11.305889670276] , [ 1254283200000 , 10.918452290083] , [ 1256961600000 , 9.6811395055706] , [ 1259557200000 , 10.971529744038] , [ 1262235600000 , 13.330210480209] , [ 1264914000000 , 14.592637568961] , [ 1267333200000 , 14.605329141157] , [ 1270008000000 , 13.936853794037] , [ 1272600000000 , 12.189480759072] , [ 1275278400000 , 11.676151385046] , [ 1277870400000 , 13.058852800017] , [ 1280548800000 , 13.62891543203] , [ 1283227200000 , 13.811107569918] , [ 1285819200000 , 13.786494560787] , [ 1288497600000 , 14.04516285753] , [ 1291093200000 , 13.697412447288] , [ 1293771600000 , 13.677681376221] , [ 1296450000000 , 19.961511864531] , [ 1298869200000 , 21.049198298158] , [ 1301544000000 , 22.687631094008] , [ 1304136000000 , 25.469010617433] , [ 1306814400000 , 24.883799437121] , [ 1309406400000 , 24.203843814248] , [ 1312084800000 , 22.138760964038] , [ 1314763200000 , 16.034636966228] , [ 1317355200000 , 15.394958944556] , [ 1320033600000 , 12.625642461969] , [ 1322629200000 , 12.973735699739] , [ 1325307600000 , 15.786018336149] , [ 1327986000000 , 15.227368020134] , [ 1330491600000 , 15.899752650734] , [ 1333166400000 , 18.994731295388] , [ 1335758400000 , 18.450055817702] , [ 1338436800000 , 17.863719889669]]
      } ,
      {
        "key" : "Industrials" ,
        "values" : [ [ 1138683600000 , 7.1590087090398] , [ 1141102800000 , 7.1297210970108] , [ 1143781200000 , 5.5774588290586] , [ 1146369600000 , 5.4977254491156] , [ 1149048000000 , 5.5138153113634] , [ 1151640000000 , 4.3198084032122] , [ 1154318400000 , 3.9179295839125] , [ 1156996800000 , 3.8110093051479] , [ 1159588800000 , 5.5629020916939] , [ 1162270800000 , 5.7241673711336] , [ 1164862800000 , 5.4715049695004] , [ 1167541200000 , 4.9193763571618] , [ 1170219600000 , 5.136053947247] , [ 1172638800000 , 5.1327258759766] , [ 1175313600000 , 5.1888943925082] , [ 1177905600000 , 5.5191481293345] , [ 1180584000000 , 5.6093625614921] , [ 1183176000000 , 4.2706312987397] , [ 1185854400000 , 4.4453235132117] , [ 1188532800000 , 4.6228003109761] , [ 1191124800000 , 5.0645764756954] , [ 1193803200000 , 5.0723447230959] , [ 1196398800000 , 5.1457765818846] , [ 1199077200000 , 5.4067851597282] , [ 1201755600000 , 5.472241916816] , [ 1204261200000 , 5.3742740389688] , [ 1206936000000 , 6.251751933664] , [ 1209528000000 , 6.1406852153472] , [ 1212206400000 , 5.8164385627465] , [ 1214798400000 , 5.4255846656171] , [ 1217476800000 , 5.3738499417204] , [ 1220155200000 , 5.1815627753979] , [ 1222747200000 , 5.0305983235349] , [ 1225425600000 , 4.6823058607165] , [ 1228021200000 , 4.5941481589093] , [ 1230699600000 , 5.4669598474575] , [ 1233378000000 , 5.1249037357] , [ 1235797200000 , 4.3504421250742] , [ 1238472000000 , 4.6260881026002] , [ 1241064000000 , 5.0140402458946] , [ 1243742400000 , 4.7458462454774] , [ 1246334400000 , 6.0437019654564] , [ 1249012800000 , 6.4595216249754] , [ 1251691200000 , 6.6420468254155] , [ 1254283200000 , 5.8927271960913] , [ 1256961600000 , 5.4712108838003] , [ 1259557200000 , 6.1220254207747] , [ 1262235600000 , 5.5385935169255] , [ 1264914000000 , 5.7383377612639] , [ 1267333200000 , 6.1715976730415] , [ 1270008000000 , 4.0102262681174] , [ 1272600000000 , 3.769389679692] , [ 1275278400000 , 3.5301571031152] , [ 1277870400000 , 2.7660252652526] , [ 1280548800000 , 3.1409983385775] , [ 1283227200000 , 3.0528024863055] , [ 1285819200000 , 4.3126123157971] , [ 1288497600000 , 4.594654041683] , [ 1291093200000 , 4.5424126126793] , [ 1293771600000 , 4.7790043987302] , [ 1296450000000 , 7.4969154058289] , [ 1298869200000 , 7.9424751557821] , [ 1301544000000 , 7.1560736250547] , [ 1304136000000 , 7.9478117337855] , [ 1306814400000 , 7.4109214848895] , [ 1309406400000 , 7.5966457641101] , [ 1312084800000 , 7.165754444071] , [ 1314763200000 , 5.4816702524302] , [ 1317355200000 , 4.9893656089584] , [ 1320033600000 , 4.498385105327] , [ 1322629200000 , 4.6776090358151] , [ 1325307600000 , 8.1350814368063] , [ 1327986000000 , 8.0732769990652] , [ 1330491600000 , 8.5602340387277] , [ 1333166400000 , 5.1293714074325] , [ 1335758400000 , 5.2586794619016] , [ 1338436800000 , 5.1100853569977]]
      } ,
      {
        "key" : "Information Technology" ,
        "values" : [ [ 1138683600000 , 13.242301508051] , [ 1141102800000 , 12.863536342042] , [ 1143781200000 , 21.034044171629] , [ 1146369600000 , 21.419084618803] , [ 1149048000000 , 21.142678863691] , [ 1151640000000 , 26.568489677529] , [ 1154318400000 , 24.839144939905] , [ 1156996800000 , 25.456187462167] , [ 1159588800000 , 26.350164502826] , [ 1162270800000 , 26.47833320519] , [ 1164862800000 , 26.425979547847] , [ 1167541200000 , 28.191461582256] , [ 1170219600000 , 28.930307448808] , [ 1172638800000 , 29.521413891117] , [ 1175313600000 , 28.188285966466] , [ 1177905600000 , 27.704619625832] , [ 1180584000000 , 27.490862424829] , [ 1183176000000 , 28.770679721286] , [ 1185854400000 , 29.060480671449] , [ 1188532800000 , 28.240998844973] , [ 1191124800000 , 33.004893194127] , [ 1193803200000 , 34.075180359928] , [ 1196398800000 , 32.548560664833] , [ 1199077200000 , 30.629727432728] , [ 1201755600000 , 28.642858788159] , [ 1204261200000 , 27.973575227842] , [ 1206936000000 , 27.393351882726] , [ 1209528000000 , 28.476095288523] , [ 1212206400000 , 29.29667866426] , [ 1214798400000 , 29.222333802896] , [ 1217476800000 , 28.092966093843] , [ 1220155200000 , 28.107159262922] , [ 1222747200000 , 25.482974832098] , [ 1225425600000 , 21.208115993834] , [ 1228021200000 , 20.295043095268] , [ 1230699600000 , 15.925754618401] , [ 1233378000000 , 17.162864628346] , [ 1235797200000 , 17.084345773174] , [ 1238472000000 , 22.246007102281] , [ 1241064000000 , 24.530543998509] , [ 1243742400000 , 25.084184918242] , [ 1246334400000 , 16.606166527358] , [ 1249012800000 , 17.239620011628] , [ 1251691200000 , 17.336739127379] , [ 1254283200000 , 25.478492475753] , [ 1256961600000 , 23.017152085245] , [ 1259557200000 , 25.617745423683] , [ 1262235600000 , 24.061133998642] , [ 1264914000000 , 23.223933318644] , [ 1267333200000 , 24.425887263937] , [ 1270008000000 , 35.501471156693] , [ 1272600000000 , 33.775013878676] , [ 1275278400000 , 30.417993630285] , [ 1277870400000 , 30.023598978467] , [ 1280548800000 , 33.327519522436] , [ 1283227200000 , 31.963388450371] , [ 1285819200000 , 30.498967232092] , [ 1288497600000 , 32.403696817912] , [ 1291093200000 , 31.47736071922] , [ 1293771600000 , 31.53259666241] , [ 1296450000000 , 41.760282761548] , [ 1298869200000 , 45.605771243237] , [ 1301544000000 , 39.986557966215] , [ 1304136000000 , 43.846330510051] , [ 1306814400000 , 39.857316881857] , [ 1309406400000 , 37.675127768208] , [ 1312084800000 , 35.775077970313] , [ 1314763200000 , 48.631009702577] , [ 1317355200000 , 42.830831754505] , [ 1320033600000 , 35.611502589362] , [ 1322629200000 , 35.320136981738] , [ 1325307600000 , 31.564136901516] , [ 1327986000000 , 32.074407502433] , [ 1330491600000 , 35.053013769976] , [ 1333166400000 , 26.434568573937] , [ 1335758400000 , 25.305617871002] , [ 1338436800000 , 24.520919418236]]
      } ,
      {
        "key" : "Materials" ,
        "values" : [ [ 1138683600000 , 5.5806167415681] , [ 1141102800000 , 5.4539047069985] , [ 1143781200000 , 7.6728842432362] , [ 1146369600000 , 7.719946716654] , [ 1149048000000 , 8.0144619912942] , [ 1151640000000 , 7.942223133434] , [ 1154318400000 , 8.3998279827444] , [ 1156996800000 , 8.532324572605] , [ 1159588800000 , 4.7324285199763] , [ 1162270800000 , 4.7402397487697] , [ 1164862800000 , 4.9042069355168] , [ 1167541200000 , 5.9583963430882] , [ 1170219600000 , 6.3693899239171] , [ 1172638800000 , 6.261153903813] , [ 1175313600000 , 5.3443942184584] , [ 1177905600000 , 5.4932111235361] , [ 1180584000000 , 5.5747393101109] , [ 1183176000000 , 5.3833633060013] , [ 1185854400000 , 5.5125898831832] , [ 1188532800000 , 5.8116112661327] , [ 1191124800000 , 4.3962296939996] , [ 1193803200000 , 4.6967663605521] , [ 1196398800000 , 4.7963004350914] , [ 1199077200000 , 4.1817985183351] , [ 1201755600000 , 4.3797643870182] , [ 1204261200000 , 4.6966642197965] , [ 1206936000000 , 4.3609995132565] , [ 1209528000000 , 4.4736290996496] , [ 1212206400000 , 4.3749762738128] , [ 1214798400000 , 3.3274661194507] , [ 1217476800000 , 3.0316184691337] , [ 1220155200000 , 2.5718140204728] , [ 1222747200000 , 2.7034994044603] , [ 1225425600000 , 2.2033786591364] , [ 1228021200000 , 1.9850621240805] , [ 1230699600000 , 0] , [ 1233378000000 , 0] , [ 1235797200000 , 0] , [ 1238472000000 , 0] , [ 1241064000000 , 0] , [ 1243742400000 , 0] , [ 1246334400000 , 0] , [ 1249012800000 , 0] , [ 1251691200000 , 0] , [ 1254283200000 , 0.44495950017788] , [ 1256961600000 , 0.33945469262483] , [ 1259557200000 , 0.38348269455195] , [ 1262235600000 , 0] , [ 1264914000000 , 0] , [ 1267333200000 , 0] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0] , [ 1288497600000 , 0] , [ 1291093200000 , 0] , [ 1293771600000 , 0] , [ 1296450000000 , 0.52216435716176] , [ 1298869200000 , 0.59275786698454] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 0] , [ 1320033600000 , 0] , [ 1322629200000 , 0] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0] , [ 1338436800000 , 0]]
      } ,
      {
        "key" : "Telecommunication Services" ,
        "values" : [ [ 1138683600000 , 3.7056975170243] , [ 1141102800000 , 3.7561118692318] , [ 1143781200000 , 2.861913700854] , [ 1146369600000 , 2.9933744103381] , [ 1149048000000 , 2.7127537218463] , [ 1151640000000 , 3.1195497076283] , [ 1154318400000 , 3.4066964004508] , [ 1156996800000 , 3.3754571113569] , [ 1159588800000 , 2.2965579982924] , [ 1162270800000 , 2.4486818633018] , [ 1164862800000 , 2.4002308848517] , [ 1167541200000 , 1.9649579750349] , [ 1170219600000 , 1.9385263638056] , [ 1172638800000 , 1.9128975336387] , [ 1175313600000 , 2.3412869836298] , [ 1177905600000 , 2.4337870351445] , [ 1180584000000 , 2.62179703171] , [ 1183176000000 , 3.2642864957929] , [ 1185854400000 , 3.3200396223709] , [ 1188532800000 , 3.3934212707572] , [ 1191124800000 , 4.2822327088179] , [ 1193803200000 , 4.1474964228541] , [ 1196398800000 , 4.1477082879801] , [ 1199077200000 , 5.2947122916128] , [ 1201755600000 , 5.2919843508028] , [ 1204261200000 , 5.1989783050309] , [ 1206936000000 , 3.5603057673513] , [ 1209528000000 , 3.3009087690692] , [ 1212206400000 , 3.1784852603792] , [ 1214798400000 , 4.5889503538868] , [ 1217476800000 , 4.401779617494] , [ 1220155200000 , 4.2208301828278] , [ 1222747200000 , 3.89396671475] , [ 1225425600000 , 3.0423832241354] , [ 1228021200000 , 3.135520611578] , [ 1230699600000 , 1.9631418164089] , [ 1233378000000 , 1.8963543874958] , [ 1235797200000 , 1.8266636017025] , [ 1238472000000 , 0.93136635895188] , [ 1241064000000 , 0.92737801918888] , [ 1243742400000 , 0.97591889805002] , [ 1246334400000 , 2.6841193805515] , [ 1249012800000 , 2.5664341140531] , [ 1251691200000 , 2.3887523699873] , [ 1254283200000 , 1.1737801663681] , [ 1256961600000 , 1.0953582317281] , [ 1259557200000 , 1.2495674976653] , [ 1262235600000 , 0.36607452464754] , [ 1264914000000 , 0.3548719047291] , [ 1267333200000 , 0.36769242398939] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0.85450741275337] , [ 1288497600000 , 0.91360317921637] , [ 1291093200000 , 0.89647678692269] , [ 1293771600000 , 0.87800687192639] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0.43668720882994] , [ 1304136000000 , 0.4756523602692] , [ 1306814400000 , 0.46947368328469] , [ 1309406400000 , 0.45138896152316] , [ 1312084800000 , 0.43828726648117] , [ 1314763200000 , 2.0820861395316] , [ 1317355200000 , 0.9364411075395] , [ 1320033600000 , 0.60583907839773] , [ 1322629200000 , 0.61096950747437] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0] , [ 1338436800000 , 0]]
      } ,
      {
        "key" : "Utilities" ,
        "values" : [ [ 1138683600000 , 0] , [ 1141102800000 , 0] , [ 1143781200000 , 0] , [ 1146369600000 , 0] , [ 1149048000000 , 0] , [ 1151640000000 , 0] , [ 1154318400000 , 0] , [ 1156996800000 , 0] , [ 1159588800000 , 0] , [ 1162270800000 , 0] , [ 1164862800000 , 0] , [ 1167541200000 , 0] , [ 1170219600000 , 0] , [ 1172638800000 , 0] , [ 1175313600000 , 0] , [ 1177905600000 , 0] , [ 1180584000000 , 0] , [ 1183176000000 , 0] , [ 1185854400000 , 0] , [ 1188532800000 , 0] , [ 1191124800000 , 0] , [ 1193803200000 , 0] , [ 1196398800000 , 0] , [ 1199077200000 , 0] , [ 1201755600000 , 0] , [ 1204261200000 , 0] , [ 1206936000000 , 0] , [ 1209528000000 , 0] , [ 1212206400000 , 0] , [ 1214798400000 , 0] , [ 1217476800000 , 0] , [ 1220155200000 , 0] , [ 1222747200000 , 0] , [ 1225425600000 , 0] , [ 1228021200000 , 0] , [ 1230699600000 , 0] , [ 1233378000000 , 0] , [ 1235797200000 , 0] , [ 1238472000000 , 0] , [ 1241064000000 , 0] , [ 1243742400000 , 0] , [ 1246334400000 , 0] , [ 1249012800000 , 0] , [ 1251691200000 , 0] , [ 1254283200000 , 0] , [ 1256961600000 , 0] , [ 1259557200000 , 0] , [ 1262235600000 , 0] , [ 1264914000000 , 0] , [ 1267333200000 , 0] , [ 1270008000000 , 0] , [ 1272600000000 , 0] , [ 1275278400000 , 0] , [ 1277870400000 , 0] , [ 1280548800000 , 0] , [ 1283227200000 , 0] , [ 1285819200000 , 0] , [ 1288497600000 , 0] , [ 1291093200000 , 0] , [ 1293771600000 , 0] , [ 1296450000000 , 0] , [ 1298869200000 , 0] , [ 1301544000000 , 0] , [ 1304136000000 , 0] , [ 1306814400000 , 0] , [ 1309406400000 , 0] , [ 1312084800000 , 0] , [ 1314763200000 , 0] , [ 1317355200000 , 0] , [ 1320033600000 , 0] , [ 1322629200000 , 0] , [ 1325307600000 , 0] , [ 1327986000000 , 0] , [ 1330491600000 , 0] , [ 1333166400000 , 0] , [ 1335758400000 , 0] , [ 1338436800000 , 0]]
      }
    ];

    var colors = self.d3.scale.category20();

    var chart = self.nv.models.stackedAreaChart()
      .useInteractiveGuideline(true)
      .x(function(d) { return d[0] })
      .y(function(d) { return d[1] })
      .controlLabels({stacked: "Stacked"})
      .duration(300);

    chart.xAxis.tickFormat(function(d) { return self.d3.time.format('%x')(new Date(d)) });
    chart.yAxis.tickFormat(self.d3.format(',.4f'));

    chart.legend.vers('furious');

    self.d3.select('#stackedArea').append("svg")
      .datum(histcatexplong)
      .transition().duration(1000)
      .call(chart)
      .each('start', function() {
        setTimeout(function() {
          self.d3.selectAll('#chart1 *').each(function() {
            if(this.__transition__)
              this.__transition__.duration = 1;
          })
        }, 0)
      });

    self.nv.utils.windowResize(chart.update);
  }*/

  /*generateScatterPlusLineChart(){
    let self = this;
    function randomData(groups, points) { //# groups,# points per group
      var data = [],
        shapes = ['circle'],
        random = self.d3.random.normal();

      for (let i = 0; i < groups; i++) {
        data.push({
          key: 'Group ' + i,
          values: [],
          slope: Math.random() - .01,
          intercept: Math.random() - .5
        });

        for (let j = 0; j < points; j++) {
          data[i].values.push({
            x: random(),
            y: random(),
            size: Math.random(),
            shape: shapes[j % shapes.length]
          });
        }
      }
      return data;
    }

    var chart = self.nv.models.scatterChart()
      .showDistX(true)
      .showDistY(true)
      .duration(300)
      .color(self.d3.scale.category10().range());

    chart.dispatch.on('renderEnd', function(){
      console.log('render complete');
    });

    chart.xAxis.tickFormat(self.d3.format('.02f'));
    chart.yAxis.tickFormat(self.d3.format('.02f'));

    self.d3.select('#scatterchart').append("svg")
      .datum(self.nv.log(randomData(4,40)))
      .call(chart);

    self.nv.utils.windowResize(chart.update);
    chart.dispatch.on('stateChange', function(e) { self.nv.log('New State:', JSON.stringify(e)); });
  }

  generateData(){
    let self = this;
    var chart;
    var data;
    var legendPosition = "top";

    var randomizeFillOpacity = function() {
      var rand = Math.random();
      for (var i = 0; i < 100; i++) { // modify sine amplitude
        data[4].values[i].y = Math.sin(i/(5 + rand)) * .4 * rand - .25;
      }
      data[4].fillOpacity = rand;
      chart.update();
    };

    var toggleLegend = function() {
      if (legendPosition == "top") {
        legendPosition = "bottom";
      } else {
        legendPosition = "top";
      }
      chart.legendPosition(legendPosition);
      chart.update();
    };


    function sinAndCos() {
      var sin = [],
        sin2 = [],
        cos = [],
        rand = [],
        rand2 = []
      ;

      for (var i = 0; i < 100; i++) {
        sin.push({x: i, y: i % 10 == 5 ? null : Math.sin(i/10) }); //the nulls are to show how defined works
        sin2.push({x: i, y: Math.sin(i/5) * 0.4 - 0.25});
        cos.push({x: i, y: .5 * Math.cos(i/10)});
        rand.push({x:i, y: Math.random() / 10});
        rand2.push({x: i, y: Math.cos(i/10) + Math.random() / 10 })
      }

      return [
        {
          area: true,
          values: sin,
          key: "Sine Wave",
          color: "#ff7f0e",
          strokeWidth: 4,
          classed: 'dashed'
        },
        {
          values: cos,
          key: "Cosine Wave",
          color: "#2ca02c"
        },
        {
          values: rand,
          key: "Random Points",
          color: "#2222ff"
        },
        {
          values: rand2,
          key: "Random Cosine",
          color: "#667711",
          strokeWidth: 3.5
        },
        {
          area: true,
          values: sin2,
          key: "Fill opacity",
          color: "#EF9CFB",
          fillOpacity: .1
        }
      ];
    }

    chart = self.nv.models.lineChart()
      .options({
        duration: 300,
        useInteractiveGuideline: true
      })
    ;

    // chart sub-models (ie. xAxis, yAxis, etc) when accessed directly, return themselves, not the parent chart, so need to chain separately
    chart.xAxis
      .axisLabel("Time (s)")
      .tickFormat(self.d3.format(',.1f'))
      .staggerLabels(true)
    ;

    chart.yAxis
      .axisLabel('Voltage (v)')
      .tickFormat(function(d) {
        if (d == null) {
          return 'N/A';
        }
        return self.d3.format(',.2f')(d);
      })
    ;

    data = sinAndCos();

    self.d3.select('#abc').append('svg')
      .datum(data)
      .call(chart);

    self.nv.utils.windowResize(chart.update);
  }*/

  ngOnInit() {

    this.generateMultiBarChart()

    this.generatePieChart()
  }
}
