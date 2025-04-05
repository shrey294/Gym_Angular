import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../Services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  public packages: { id: number, packageName: string }[] = [];
  public genders:string[] = ["Male","Female"];
  public importantList:{id:number,reason:string}[]=[];
  public userid!:number;
  public isupdate: boolean=false;

  public registerForm!:FormGroup

  constructor(private fb: FormBuilder,private api:ApiService,private activatedroute:ActivatedRoute,private router:Router,private toastr:ToastrService){}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      mobile: [''],
      weight: [''],
      height: [''],
      bmi: [''],
      bmiResult:[''],
      gender: [''],
      Trainer: [''],
      package:[''],
      Reason: [''],
      //Reason: this.fb.array([]),
      GymBefore: [''],
      enquiryDate: ['']
    });
    this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculatebmi(res);
    });
    this.api.getpackages().subscribe({
      next:(res)=>{
        //console.log(res);
        this.packages = res;
      }
    });
    this.api.getreasons().subscribe({
      next:(res)=>{
        //console.log(res);
        this.importantList = res
      }
    });
    this.activatedroute.params.subscribe(val=>{
      this.userid = val['id'];
      if (this.userid !== undefined && this.userid !== null) {
        this.api.getuserbyid(this.userid).subscribe({
          next: (res) => {
            //console.log(res);
            //this.fillform(res)
            this.isupdate=true;
            this.fillForm(res);

          },
          error: (err) => {
            console.error('Error fetching user:', err);
          }
        });
      } else {
        //console.log('No valid user ID provided');
      }
    })
  }
  submit(){
    const formData = this.registerForm.value;
  
  // Convert important array to comma-separated string
  formData.Reason = formData.Reason.join(',');

  // Ensure enquiryDate is formatted properly (optional)
  formData.enquiryDate = new Date(formData.enquiryDate).toISOString();

  console.log("Submitting Data:", formData);

  this.api.registration(formData).subscribe({
    next:(res:any)=>{
      //alert(res);
      this.toastr.success(res.message,'Success');
      this.registerForm.reset();
    },
    error: (err) => {
      console.error('API error:', err);  // Log error to console
      this.toastr.error('something went wrong','Error');
    }
  })
    
  }
  calculatebmi(heightvalue:number){
    const  weight = this.registerForm.value.weight;
    const height = heightvalue;
    const bmi = weight/(height*height);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch(true){
      case bmi <18.5:
        this.registerForm.controls['bmiResult'].patchValue("UnderWeight");
        break;
        case (bmi>=18.5 && bmi <25):
          this.registerForm.controls['bmiResult'].patchValue("Normal");
          break;
        case (bmi>=25 && bmi<30):
          this.registerForm.controls['bmiResult'].patchValue("Overweight");
          break;
        default:
          this.registerForm.controls['bmiResult'].patchValue("obese");
          break;
    }
  }

fillForm(response: any) {
 
  // Ensure the response is an array and extract the first object (if needed)
  const apiData = Array.isArray(response) && response.length > 0 ? response[0] : response;
  if (!apiData) {
    console.warn('No valid API data found');
    return;
  }

  // Example of processing the response
  const selectedReasons = apiData.reason
    ? apiData.reason.split(',').map((id: string) => id.trim()): []; // Explicitly define id as a string   

  // Patch other form values (you can modify this according to your API structure)
  this.registerForm.patchValue({
    firstName: apiData.firstName || '',
    lastName: apiData.lastName || '',
    email: apiData.email || '',
    mobile: apiData.mobile || '',
    weight: apiData.weight || '',
    height: apiData.height || '',
    bmi: apiData.bmi || '',
    bmiResult: apiData.bmiresult || '',
    Trainer: apiData.trainer || '',
    gender: apiData.gender || '',
    package: apiData.package || '',
    GymBefore: apiData.gymBefore || '',
    enquiryDate: apiData.enquiryDate || ''
  });

  // Set selected values for 'Reason' multi-select dropdown
  this.registerForm.controls['Reason'].setValue(selectedReasons); // Set the selected values for multi-select

}
// update(){
//   //console.log(this.registerForm.value);
//   this.api.updateuser(this.registerForm.value,this.userid).subscribe(res=>{
//     alert(res);
//     this.registerForm.reset();
//   });
// }
update(){
  const formData = this.registerForm.value;

  // If your API expects a comma-separated string, convert it just before sending
  const payload = {
    ...formData,
    Reason: formData.Reason.join(',') // Convert to string only for the API payload
  };

  // Now send the updated form data with the comma-separated reasons
  this.api.updateuser(payload, this.userid).subscribe((res:any) => {
    this.toastr.success(res.message,'Success');
    this.registerForm.reset();
    this.router.navigate(['\list']);
  },
  
  (error: any) => {
    console.error('Error:', error);
    this.toastr.error('Something went wrong','Error');
  });
}

}