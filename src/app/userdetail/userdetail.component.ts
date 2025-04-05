import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../Services/api.service';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.scss']
})
export class UserdetailComponent implements OnInit {
  public ID!:number;
  public userDetails: any = {};

  constructor(private activatedroute:ActivatedRoute,private api:ApiService){

  }
  ngOnInit(): void {
    this.activatedroute.params.subscribe(val=>{
      this.ID = val['id'];
      this.fetchuserdetails(this.ID);
    })
  }
  fetchuserdetails(id: number) {
    this.api.getuserbyidnew(id).subscribe(res => {
      console.log("API Response:", res);
  
      if (Array.isArray(res) && res.length > 0) {
        this.userDetails = res[0];  // Extract the first object
        this.userDetails.reasons = this.userDetails.reasons.split(',').map((reason: string) => reason.trim());
      } else {
        this.userDetails = {};  // Ensure it's an empty object if no data is found
      }
  
      console.log("Updated userDetails:", this.userDetails);
    });
  }
  
  
}
