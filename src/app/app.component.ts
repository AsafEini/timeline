import {Component, ElementRef, OnInit, ViewChild, AfterContentInit, AfterViewInit} from '@angular/core';
import * as vis from 'vis';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('timeLineContainer', {static: false}) divView: ElementRef;

  public title = 'timeline-poc';
  public timeLineData;

  private groups = new vis.DataSet([
    { id: 1, content: 'Intercept 1', checked: false},
    { id: 2, content: 'Intercept 2', checked: false},
    { id: 3, content: 'Intercept 3', checked: false},
    { id: 4, content: 'Intercept 4', checked: false}
  ]);

  private timeLineDataSet = new vis.DataSet([
    { id: 1, content: "item 1", start: "2014-04-20", className: 'red-boy',group: 1 },
    { id: 2, content: "item 2", start: "2014-04-14", group: 2 },
    { id: 3, content: "item 3", start: "2014-04-18", group: 3 },
    { id: 4, content: "item 4", start: "2014-04-16", end: "2014-04-19", group: 4 },
    { id: 5, content: "item 5", start: "2014-04-25", group: 2 },
    { id: 6, content: "item 6", start: "2014-04-27", type: "point", group: 2 },

  ]);
  constructor() {}

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.divView.nativeElement.className = 'myCSSclass';
    this.timeLineData = new vis.Timeline(
      this.divView.nativeElement,
      this.timeLineDataSet,
      this.groups,
      {
        width:'100%',
        height:'100%',
        margin:
          {
            item: 10,
            axis: 5
          },
        stack: false,
        editable: false,
        groupOrder: 'id',
        groupTemplate: (item, element, data) => {
          return (`
                   <div class="group-container">
                      <div class="checkbox-container">
                      ${item.checked ? `<input type="checkbox" checked>`:`<input type="checkbox">`}
                      </div>
                      <div class="name">${item.content}</div>
                   </div>`)
        }
      });

    console.log(document.getElementsByClassName('red-boy'));
    this.timeLineData.on("scroll", this.debounce(this.groupFocus, 200));
  }

  private debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }

  private groupFocus = e => {
    let vGroups = this.timeLineData.groupsData.getIds();
    let vItems = vGroups.reduce((res, groupId) => {
      let group = this.timeLineData.itemSet.groups[groupId];
      if (group.items) {
        res = res.concat(Object.keys(group.items));
      }
      return res;
    }, []);
    this.timeLineData.focus(vItems);
  };

  public onCheckAllGroups() {
    this.groups.forEach((group)=> {
        this.groups.update({...group, id: group.id, checked: !group.checked})
      });
    this.groups;
  }


}
