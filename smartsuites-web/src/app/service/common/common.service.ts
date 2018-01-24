import { Injectable } from '@angular/core'
import * as jquery from 'jquery'
import * as echarts from 'echarts'
import * as nv from 'nvd3'
import * as d3 from 'd3'
import * as ace from 'brace'
import * as THREE from 'three'
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
    this._jQuery = jquery
    this._echarts = echarts
    this._nv = nv
    this._d3 = d3
    this._ace = ace
    this._three = THREE
  }

}
