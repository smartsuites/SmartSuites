import { Component, OnInit } from '@angular/core';
import {MenuItem, SelectItem} from "primeng/primeng";

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.css']
})
export class ScreenComponent implements OnInit {

  items: MenuItem[];

  stepsItems: MenuItem[];

  //********** Create Note ***********//
  createNoteDialogDisplay: boolean = false;

  showCreateNoteDialog() {
    this.createNoteDialogDisplay = true;
  }

  cities1: SelectItem[];

  noteName
  defaultInter

  constructor() { }

  ngOnInit() {

    this.stepsItems = [
      {
        label: 'Personal'
      },
      {
        label: 'Seat'
      },
      {
        label: 'Payment'
      }
    ];

    this.items = [
      {
        label: 'File',
        icon: 'fa-file-o',
        badge: '5',
        items: [{
          label: 'New',
          icon: 'fa-plus',
          items: [
            {label: 'Project',badge: '5'},
            {label: 'Other'},
          ]
        },
          {label: 'Open'},
          {label: 'Quit'}
        ]
      },
      {
        label: 'Edit',
        icon: 'fa-edit',
        badge: '5',
        items: [
          {label: 'Undo', icon: 'fa-mail-forward'},
          {label: 'Redo', icon: 'fa-mail-reply'}
        ]
      },
      {
        label: 'Help',
        icon: 'fa-question',
        items: [
          {
            label: 'Contents'
          },
          {
            label: 'Search',
            icon: 'fa-search',
            items: [
              {
                label: 'Text',
                items: [
                  {
                    label: 'Workspace'
                  }
                ]
              },
              {
                label: 'File'
              }
            ]}
        ]
      },
      {
        label: 'Actions',
        icon: 'fa-gear',
        items: [
          {
            label: 'Edit',
            icon: 'fa-refresh',
            items: [
              {label: 'Save', icon: 'fa-save'},
              {label: 'Update', icon: 'fa-save'},
            ]
          },
          {
            label: 'Other',
            icon: 'fa-phone',
            items: [
              {label: 'Delete', icon: 'fa-minus'}
            ]
          }
        ]
      }
    ];
  }

}
