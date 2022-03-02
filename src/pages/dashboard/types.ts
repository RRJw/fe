export interface IGridPos {
  h: number;
  w: number;
  x: number;
  y: number;
}

// query interface 
export interface ITarget {
  expr: string; // promQL
  legendFormat: string;
  // format: string; // table | timeSeries 暂定，可能需要添加一个 format 来处理 table 形态
}

export interface ILink {
  title: string;
  url: string;
}

export type IType = 'timeseries' | 'stat' | 'table' | 'pie';

export interface IMapping {
  options: {
    match: {
      special?: string | number;
      from?: number;
      to?: number
    };
    result: {
      color: string;
      text: string;
    };
    type: 'range' | 'special'
  };
}

export interface IThreshold {
  steps: {
    color: string;
    value: number;
  }[];
  style: 'line'; // 目前只支持 line
}

// 一些通用的配置，不同类型的图表可选择性使用配置
export interface IOptions {
  mappings?: IMapping[];
  thresholds?: IThreshold[];
  standardOptions?: {
    util?: string;
    min?: number;
    max?: number;
  };
  legend?: { // TODO: 目前不支持这么复杂的自定义
    calcs: string[];
    displayMode: 'list' | 'hidden';
    placement: 'right' | 'bottom'
  };
  tooltip?: {
    mode: 'single' | 'multi',
    sort: 'none' | 'asc' | 'desc'
  }
}

export interface ITimeseriesStyles {
  style: 'lines' | 'areas' |'bars';
  lineInterpolation: 'linear' | 'smooth';
  stack: 'off' | 'noraml'; // off 关闭；normal 开启，此结构未后期其他模式预留
}

export interface IPanel {
  version: string; // 单个图表面板使用的版本，遵循版本规范 '1.0.0'
  id: number;
  title: string;
  link: ILink;
  gridPos: IGridPos;
  targets: ITarget[];
  type: IType;
  options: IOptions;
  custom: any; // 图表
}

export interface IDashboard {
  version: string; // 整个仪表盘使用的版本，遵循版本规范 '1.0.0'
  id: number;
  title: string;
  cluster: string;
  time: {
    start: number;
    end: number;
  };
  refresh: string; // off | 10s ...
  variable: any; // 变量配置
  editable: boolean; // 备用
}
