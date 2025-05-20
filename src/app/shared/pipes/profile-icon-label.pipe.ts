import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'profileIconLabel',
  standalone: true
})
export class ProfileIconLabelPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (value !== null && value !== undefined) {
      let names: string[] = value.split(' ').map(name => name.charAt(0).toUpperCase());
      return names.join("");
    }
    return 'O';
  }

}
