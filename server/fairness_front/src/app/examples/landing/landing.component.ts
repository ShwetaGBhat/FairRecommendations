import { Component, OnInit } from "@angular/core";

import { LandingService } from "./landing.service";

@Component({
  selector: "app-landing",
  templateUrl: "./landing.component.html",
  styleUrls: ["./landing.component.scss"],
})
export class LandingComponent implements OnInit {
  page = 1;
  simpleSlider = 0.4;
  
  keyword = 'name';
  selected_user = null;
  collection_size = null;
  selected_interest = null;
  
  users = [];
  with_bias = [];
  bias_corrected = [];
  research_interests = [];

  constructor(private landingService: LandingService) {}

  ngOnInit() {
    this.loadUsers();
    this.loadResearchInterests();
  }

  loadUsers() {
    const page_number = 0; 
    const page_size = 902;

    this.landingService.getAllUsers(page_number, page_size).subscribe((data: any) => {
      this.users = data;
    });
  }

  loadResearchInterests() {
    this.landingService.getResearchInterestList().subscribe((data: any) => {
      for (let i = 0; i < data.research_interests.length; i++) {
        this.research_interests.push({name: data.research_interests[i]});
      }
    });
  }

  loadRecommendationData() {
    const page_number = 0;
    const page_size = 10;
    const sim_weight = this.simpleSlider;
    const uuid = this.selected_user.uuid; 
    const research_interest = this.selected_interest.name;

    this.landingService.getRecommendation(uuid, research_interest, sim_weight, page_number, page_size).subscribe((data: any) => {
      this.with_bias = data.with_bias;
      this.bias_corrected = data.bias_corrected;
      this.collection_size = data.length;
      var pagination_div = document.getElementById("pagination_div");
      var result_section = document.getElementById("result_section");
      pagination_div.hidden = false;
      result_section.hidden = false;

    });
  }

  clickResponse1(item) {
    
    var infoDiv = document.getElementById(item.uuid + "-biased");
    
    infoDiv.hidden === true
      ? (infoDiv.hidden = false)
      : (infoDiv.hidden = true);
  }

  clickResponse2(item) {
    var infoDiv = document.getElementById(item.uuid + "-corrected");

    infoDiv.hidden === true
      ? (infoDiv.hidden = false)
      : (infoDiv.hidden = true);
  }

  onPageChange(page_number) {
    
    // Page Number starts from 1, but, in the server, we need it to start from 0. So, we are subtracting 1 from it.
    page_number--;
    const page_size = 10;
    const sim_weight = this.simpleSlider;
    const uuid = this.selected_user.uuid; 
    const research_interest = this.selected_interest.name;

    this.landingService.getRecommendation(uuid, research_interest, sim_weight, page_number, page_size).subscribe((data: any) => {
      this.with_bias = data.with_bias;
      this.bias_corrected = data.bias_corrected;
      this.collection_size = data.length;
    });

  }

  userSelectEvent(item) {
    this.selected_user = item;
  }

  interestSelectEvent(item) {
    this.selected_interest = item;
  }

  userOnChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }
  
  interestOnChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  userOnFocused(e) {
    // do something
  }
  
  interestOnFocused(e) {
    // do something
  }

  // getInformation() {
  //       try {
  //           return this.http.get(this.URL);
  //       } catch(err) {
  //           console.log(err);
  //       }
  //   }
}