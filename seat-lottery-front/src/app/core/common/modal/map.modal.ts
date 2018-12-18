export interface Smap {
  blocks? : [{
    block_id : number,
    points   : Array<number>
  }];
  image?  : {
    size : {
      width : number,
      height: number
    },
    url? : string
  };
  stadium_id? : number
}