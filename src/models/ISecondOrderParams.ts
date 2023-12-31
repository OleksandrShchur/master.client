import { Methods } from "./enums/Methods";

export interface ISecondOrderParams {
    step: number | undefined;
    t_0: number | undefined;
    t_end: number | undefined;
    alpha: number | undefined;
    beta: number | undefined;
    tau: number | undefined;
    f_func: string | undefined;
    phi_func: string | undefined;
    linear: string | undefined;
}