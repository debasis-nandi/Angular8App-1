import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, NgForm, FormArray, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { formatDate } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import { HttpService } from '../../core/services/http.service';
import { ApiConfig } from '../../core/config/api-config';
import { AppSession } from '../../core/config/app-session';
import { GlobalConst } from '../../core/config/app-enum';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['test.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class TestComponent implements OnInit, AfterViewInit {
    
    overlay: boolean = false;
    displayModal: boolean = false;
    date: any;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private service: HttpService, private snackBar: MatSnackBar) {
        // Create 100 users
    let users = Array.from({length: 100}, (_, k) => this.createNewUser(k + 1));
    // Assign the data to the data source for the table to render
    this.dataSource1 = new MatTableDataSource(users);
    }

    email = new FormControl('', [Validators.required, Validators.email]);

    getErrorMessage() {
        return this.email.hasError('required') ? 'You must enter a value' :
            this.email.hasError('email') ? 'Not a valid email' : '';
    }

    foods: any[] = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' }
    ];
    toppings = new FormControl();
    toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
    dataSource: any[] = [
        { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
        { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
        { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
        { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
        { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
        { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
        { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
        { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
        { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
        { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    ];

    COLORS: string[] = [
        'maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple', 'fuchsia', 'lime', 'teal',
        'aqua', 'blue', 'navy', 'black', 'gray'
    ];
    NAMES: string[] = [
        'Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack', 'Charlotte', 'Theodore', 'Isla', 'Oliver',
        'Isabella', 'Jasper', 'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'
    ];
    displayedColumns1: string[] = ['id', 'name', 'progress', 'color'];  
    dataSource1: MatTableDataSource<any>;

    displayedColumns2 = ['name', 'position', 'weight', 'symbol'];
    dataSource2: any[] = [
        {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
        {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
        {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
        {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
        {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
        {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
        {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
        {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
        {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
        {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
      ];

    ngOnInit() {
        /*this.overlay = true;
        setTimeout(() => {
            this.overlay = false;
        }, 5000);*/
        this.dataSource1.paginator = this.paginator;
        this.dataSource1.sort = this.sort;
    }

    ngAfterViewInit() {
    }

    onSuccess(): void{
        this.openSnackBar('Data updated sucessfully!', 'success');
    }

    onFails(): void{
        this.openSnackBar('Data updated fails!', 'error');
    }

    openSnackBar(message: string, status: string) {
        this.snackBar.open(message,"x", {
            duration: 5000,
            horizontalPosition:'right',
            verticalPosition:'top',
            panelClass:status
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource1.filter = filterValue.trim().toLowerCase();

        if (this.dataSource1.paginator) {
            this.dataSource1.paginator.firstPage();
        }
    }

    createNewUser(id: number): any {
        let name = this.NAMES[Math.round(Math.random() * (this.NAMES.length - 1))] + ' ' +
            this.NAMES[Math.round(Math.random() * (this.NAMES.length - 1))].charAt(0) + '.';

        return {
            id: id.toString(),
            name: name,
            progress: Math.round(Math.random() * 100).toString(),
            color: this.COLORS[Math.round(Math.random() * (this.COLORS.length - 1))]
        };
    }

    showModalDialog() {
        this.displayModal = true;
    }

    hideModalDialog() {
        this.displayModal = false;
    }

}
