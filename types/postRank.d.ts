declare interface RankPost {
  [key: string]: string | number;
}
declare interface RankUserPost {
  [key: string]: string | RankPost[];
}
