import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { fromEvent, iif, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit {
  @Input() list: any[] = [];
  @Output() newInput = new EventEmitter();
  @ViewChild('tinput', { static: true }) inputEle: ElementRef;

  inputText = '';
  activeIndex: number = null;

  ngOnInit(): void {
    this.addInputListener();
  }

  decreaseActiveIdx() {
    if (this.activeIndex === null) {
      this.activeIndex = 0;
    } else if (this.activeIndex === 0) {
      this.activeIndex = this.list.length - 1;
    } else {
      this.activeIndex -= 1;
    }
  }

  increaseActiveIdx() {
    if (this.activeIndex === null) {
      this.activeIndex = 0;
    } else if (this.activeIndex === this.list.length - 1) {
      this.activeIndex = 0;
    } else {
      this.activeIndex += 1;
    }
  }

  updateInput(index?) {
    this.inputText = this.list[index || this.activeIndex].title;
    this.resetList();
  }

  private resetList() {
    this.activeIndex = null;
    this.newInput.emit('');
  }

  private addInputListener() {
    fromEvent(this.inputEle.nativeElement, 'keyup').pipe(
      debounceTime(300),
      switchMap((e: KeyboardEvent) =>
        iif(
          () => e.key === 'Enter',
          of(''),
          of((e.target as HTMLInputElement).value)
        )
      )
    ).subscribe((val) => {
        this.newInput.emit(val);
      }
    );
  }

}
