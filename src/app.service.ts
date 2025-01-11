import { Cache } from 'cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('CACHE_MANAGER') private readonly cacheManager: Cache) {}
  async getHello() {
    console.log('day la service');

    const student = [
      {
        id: 1,
        name: 'Nguyen Van A',
        age: 20,
        address: 'Ha Noi',
      },
      {
        id: 2,
        name: 'Nguyen Van B',
        age: 21,
        address: 'Ha Noi',
      },
      {
        id: 3,
        name: 'Nguyen Van C',
        age: 22,
        address: 'Ha Noi',
      },
      {
        id: 1,
        name: 'Nguyen Van A',
        age: 20,
        address: 'Ha Noi',
      },
      {
        id: 2,
        name: 'Nguyen Van B',
        age: 21,
        address: 'Ha Noi',
      },
      {
        id: 3,
        name: 'Nguyen Van C',
        age: 22,
        address: 'Ha Noi',
      },
      {
        id: 1,
        name: 'Nguyen Van A',
        age: 20,
        address: 'Ha Noi',
      },
      {
        id: 2,
        name: 'Nguyen Van B',
        age: 21,
        address: 'Ha Noi',
      },
      {
        id: 3,
        name: 'Nguyen Van C',
        age: 22,
        address: 'Ha Noi',
      },
      {
        id: 1,
        name: 'Nguyen Van A',
        age: 20,
        address: 'Ha Noi',
      },
      {
        id: 2,
        name: 'Nguyen Van B',
        age: 21,
        address: 'Ha Noi',
      },
      {
        id: 3,
        name: 'Nguyen Van C',
        age: 22,
        address: 'Ha Noi',
      },
      {
        id: 1,
        name: 'Nguyen Van A',
        age: 20,
        address: 'Ha Noi',
      },
      {
        id: 2,
        name: 'Nguyen Van B',
        age: 21,
        address: 'Ha Noi',
      },
      {
        id: 3,
        name: 'Nguyen Van C',
        age: 22,
        address: 'Ha Noi',
      },
    ];
    const cacheData = await this.cacheManager.get('student');

    if (cacheData) {
      console.log('Get data from cache');
      return cacheData;
    }
    await this.cacheManager.set('student', JSON.stringify(student), 10 * 1000);
    console.log('Get data from ', await this.cacheManager.get('student'));

    return JSON.stringify(student);
  }
}
 