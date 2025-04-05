import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from '../Services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.scss']
})
export class ListuserComponent implements OnInit {
  public dataSource!:MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort;
  
  displayedColumns: string[] = ["id","first_Name","email","mobile","bmiResult","gender","package","enquiry_date","action"];


  constructor(private api:ApiService,private router:Router,private toastr:ToastrService){}
  ngOnInit(): void {
    this.getuser();
  }
  getuser(){
    this.api.getregistereduser().subscribe({
      next:(res)=>{
        //console.log(res);
        //this.dataSource = new MatTableDataSource(res);
        this.dataSource = new MatTableDataSource(res as any[]);  // Cast to an array of any objects
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('An error occurred:', err);
        // You can also display an alert, toast, or perform any other action here based on the error
      }
    })
  }
  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
  edit(id:number){
    this.router.navigate(['update',id]);
  }
  delete(id:number){
    this.api.deleteuser(id).subscribe((res:any)=>{
      this.toastr.success(res.message,'success');
      this.getuser();
    })
  }
  navigation(id:number){
    //console.log(id);
    
    this.router.navigate(['details',id]);
  }
}
