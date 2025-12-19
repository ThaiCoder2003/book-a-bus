export interface Route {
  id: number;
  name: string;
  from: string;
  to: string;
  stops: number;
  time: string;
}

export const mockRoutes: Route[] = [
  {
    id: 1,
    name: "HN – SGH",
    from: "Hà Nội",
    to: "TP Hồ Chí Minh",
    stops: 3,
    time: "15h 30m",
  },
  {
    id: 2,
    name: "HN – DN",
    from: "Hà Nội",
    to: "Đà Nẵng",
    stops: 5,
    time: "6h 45m",
  },
  {
    id: 3,
    name: "HCM – CT",
    from: "TP Hồ Chí Minh",
    to: "Cần Thơ",
    stops: 4,
    time: "4h 20m",
  },
  {
    id: 4,
    name: "DN – HP",
    from: "Đà Nẵng",
    to: "Hải Phòng",
    stops: 6,
    time: "10h 15m",
  },
];
