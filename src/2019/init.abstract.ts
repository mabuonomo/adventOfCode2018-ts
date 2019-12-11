import * as fs from 'fs';
import { performanceLog } from 'decorators-utils-ts/dist/src';
const lineByLine = require('n-readlines');

export type Geo = { x: number; y: number; z?: number };
export type Direction = { direction: string; value: number };

export abstract class InitAbstract {
  // @performanceLog(true)
  getLines(day: string, test: boolean = false): Array<string> {
    var data: Array<string> = [];
    let path = process.cwd() + '/src/2019/' + day + '/input.txt';

    if (test) {
      path = process.cwd() + '/src/2019/' + day + '/input_test.txt';
    }

    // if (fs.existsSync(path)) {
    //   console.log('Input exists');
    // } else {
    //   console.log('Input not exists');
    // }

    const liner = new lineByLine(path);

    let line;
    while ((line = liner.next())) {
      data.push(line.toString('ascii'));
    }

    return data;
  }

  abstract runPart1(): any;
  abstract runPart2(): any;

  // abstract runNewPart1(input: Array<string>): any;
  // abstract runNewPart2(input: Array<string>): any;

  public manhattanDistance2D(point1: Geo, point2: Geo): number {
    return Math.abs(point1.x - point2.x) + Math.abs(point1.y - point2.y); // + Math.abs(point1.z - point2.z);
  }

  permutation = (ar: number[]): number[][] =>
    ar.length === 1
      ? ar
      : ar.reduce((ac, _, i) => {
          this.permutation([...ar.slice(0, i), ...ar.slice(i + 1)]).map((v) => ac.push([].concat(ar[i], v)));
          return ac;
        }, []);

  intersection(from1: Geo, to1: Geo, from2: Geo, to2: Geo): Geo {
    const dX: number = to1.x - from1.x;
    const dY: number = to1.y - from1.y;

    const determinant: number = dX * (to2.y - from2.y) - (to2.x - from2.x) * dY;
    if (determinant === 0) return undefined; // parallel lines

    const lambda: number =
      ((to2.y - from2.y) * (to2.x - from1.x) + (from2.x - to2.x) * (to2.y - from1.y)) / determinant;
    const gamma: number = ((from1.y - to1.y) * (to2.x - from1.x) + dX * (to2.y - from1.y)) / determinant;

    // check if there is an intersection
    if (!(0 <= lambda && lambda <= 1) || !(0 <= gamma && gamma <= 1)) return undefined;

    return {
      x: from1.x + lambda * dX,
      y: from1.y + lambda * dY,
    };
  }

  isPointOnLine(point: Geo, line: Line) {
    return (
      this.manhattanDistance2D(point, line.p1) + this.manhattanDistance2D(point, line.p2) ==
      this.manhattanDistance2D(line.p1, line.p2)
    );
  }

  isPointOnLineV2(c: Geo, line: Line): boolean {
    // return this.find_angle(line.p1, line.p2, c) * 180 / Math.PI === 0
    return this.find_angle(line.p1, line.p2, c) === 0;
  }

  find_angle(A: Geo, B: Geo, C: Geo) {
    // var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    // var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
    // var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
    // return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));

    var p12 = Math.sqrt(Math.pow((A.x - B.x), 2) + Math.pow((A.y - B.y), 2));
    var p13 = Math.sqrt(Math.pow((A.x - C.x), 2) + Math.pow((A.y - C.y), 2));
    var p23 = Math.sqrt(Math.pow((B.x - C.x), 2) + Math.pow((B.y - C.y), 2));

    //angle in radians
    var resultRadian = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13));

    //angle in degrees
    // var resultDegree = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13)) * 180 / Math.PI;
    return resultRadian
  }
}

type Line = { p1: Geo; p2: Geo; md5?: string };
