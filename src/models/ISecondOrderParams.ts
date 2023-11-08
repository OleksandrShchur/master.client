import { Methods } from "./enums/Methods";

export interface ISecondOrderParams {
    h: number;
    t_0: number;
    t_end: number;
    y_0: number;
    y_1: number;
    method: Methods
}