import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class SanitizeUserPipe implements PipeTransform {
  transform(value: any) {
    if (!value || typeof value !== 'object') return value;

    // Trim name and ensure it's a string
    if (value.name && typeof value.name === 'string') {
      value.name = value.name.trim();
    }

    // Normalize email to lowercase and basic validate
    if (value.email && typeof value.email === 'string') {
      value.email = value.email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value.email)) {
        throw new BadRequestException('Invalid email format');
      }
    }

    return value;
  }
}
