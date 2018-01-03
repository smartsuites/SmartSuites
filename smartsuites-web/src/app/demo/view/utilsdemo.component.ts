import {Component, ViewEncapsulation} from '@angular/core';

@Component({
    templateUrl: './utilsdemo.component.html',
    styles: [`
        .icon-grid div.ui-g-12 {
            text-align: center;
            padding: 16px;
            font-size: 12px;
        }

        .icon-grid i {
            display: block;
            margin: 0 auto;
            font-size: 24px;
        }

        pre {
            font-family: monospace;
            background-color: #f7f7f9;
            padding: 1em;
            font-size: 14px;
            border-radius: 3px;
            overflow: auto;
        }

        .shadow-box {
            background-color: #607D8B;
            width: 100px;
            height: 100px;
        }
    `],
    encapsulation: ViewEncapsulation.None
})
export class UtilsDemoComponent {
}
