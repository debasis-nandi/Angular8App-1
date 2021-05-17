import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'my-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['spinner.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnInit {

    @Input() value : number = 100;
    @Input() diameter: number = 30;
    @Input() mode : string ="indeterminate";
    @Input() strokeWidth : number = 0;
    @Input() overlay: boolean = false;
    @Input() color: string = "primary";

    constructor(){
    }

    ngOnInit() {
    }

    ngOnChanges(){
    }
    
}