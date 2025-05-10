import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'lineToBr',
  standalone: false
})
export class LineToBrPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): any {
    return this.sanitizer.bypassSecurityTrustHtml(value.replace(/\n/g, '<br>'));
  }
}
