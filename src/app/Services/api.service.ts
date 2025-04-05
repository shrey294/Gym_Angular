import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseurl:string="https://localhost:7202/api/User/"
  constructor(private http:HttpClient) { }

  getpackages(){
    return this.http.get<any>(`${this.baseurl}GetPackage`);
  }
  getreasons(){
    return this.http.get<any>(`${this.baseurl}GetReasons`);
  }
  registration(data:any){
    return this.http.post(`${this.baseurl}Registration`,data);
  }
  getregistereduser(){
    return this.http.get(`${this.baseurl}GetUser`);
  }
  getuserbyid(id:number){
    return this.http.get(`${this.baseurl}GetUserById/${id}`)
  }
  updateuser(data:any,id:number){
    return this.http.put(`${this.baseurl}Updateuser/${id}`,data)
  }
  deleteuser(id:number){
    return this.http.delete(`${this.baseurl}DeleteUser/${id}`)
  }
  getuserbyidnew(id:number){
    return this.http.get(`${this.baseurl}GetUserByidnew/${id}`)
  }
}
