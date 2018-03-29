import { Injectable } from '@angular/core'
import * as jquery from 'jquery'
import * as echarts from 'echarts'
import * as nv from 'nvd3'
import * as d3 from 'd3'
import * as ace from 'brace'
import * as THREE from 'three'
import 'datatables.net'
import 'brace/theme/chrome'
import 'brace/ext/language_tools'
import 'brace/mode/sql'
import 'brace/mode/markdown'
import 'brace/mode/scala'
import 'brace/mode/python'
import 'brace/mode/r'
import 'brace/mode/javascript'
import 'brace/mode/html'
import 'brace/mode/java'
import 'brace/mode/json'
import 'brace/mode/sh'
import 'brace/keybinding/emacs'
import JQueryDataTables = DataTables.JQueryDataTables;


@Injectable()
export class CommonService {

  // The Jquery Service
  _jQuery:any

  // Vis Service
  _echarts:any

  _nv:any

  _d3:any

  _three:any

  // Editor Coder
  _ace:any

  constructor() {

    /*var mydata = [
      {id:"1",invdate:"2007-10-01",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
      {id:"2",invdate:"2007-10-02",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
      {id:"3",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
      {id:"4",invdate:"2007-10-04",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
      {id:"5",invdate:"2007-10-05",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
      {id:"6",invdate:"2007-09-06",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"},
      {id:"7",invdate:"2007-10-04",name:"test",note:"note",amount:"200.00",tax:"10.00",total:"210.00"},
      {id:"8",invdate:"2007-10-03",name:"test2",note:"note2",amount:"300.00",tax:"20.00",total:"320.00"},
      {id:"9",invdate:"2007-09-01",name:"test3",note:"note3",amount:"400.00",tax:"30.00",total:"430.00"}
    ];

    jquery(`#abc`).jqGrid({
      datatype: "local",
      height: 250,
      colNames:['Inv No','Date', 'Client', 'Amount','Tax','Total','Notes'],
      colModel:[
        {name:'id',index:'id', width:60, sorttype:"int"},
        {name:'invdate',index:'invdate', width:90, sorttype:"date"},
        {name:'name',index:'name', width:100},
        {name:'amount',index:'amount', width:80, align:"right",sorttype:"float"},
        {name:'tax',index:'tax', width:80, align:"right",sorttype:"float"},
        {name:'total',index:'total', width:80,align:"right",sorttype:"float"},
        {name:'note',index:'note', width:150, sortable:false}
      ],
      data: mydata,
      multiselect: true,
      caption: "Manipulating Array Data"
    });*/


    jquery('#example').DataTable();


    this._jQuery = jquery
    this._echarts = echarts
    this._nv = nv
    this._d3 = d3
    this._ace = ace
    this._three = THREE
  }

}
