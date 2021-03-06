import { Axis as VgAxis, Text } from 'vega';
import { Axis, AxisPart, BaseAxisNoSignals, ConditionalAxisProp, ConditionalAxisProperty } from '../../axis';
import { FieldDefBase } from '../../channeldef';
import { Split } from '../split';
export declare type AxisComponentProps = Omit<VgAxis, 'title' | ConditionalAxisProp> & {
    title: Text | FieldDefBase<string>[];
    labelExpr: string;
} & {
    [k in ConditionalAxisProp]?: BaseAxisNoSignals[k] | ConditionalAxisProperty<BaseAxisNoSignals[k]>;
};
export declare const AXIS_COMPONENT_PROPERTIES: ("values" | "scale" | "domain" | "orient" | "ticks" | "tickCount" | "offset" | "titleAlign" | "titleAnchor" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontStyle" | "titleFontWeight" | "titleLimit" | "titleLineHeight" | "titleOpacity" | "titlePadding" | "labelAlign" | "labelBaseline" | "labelColor" | "labelFont" | "labelFontSize" | "labelFontStyle" | "labelFontWeight" | "labelLimit" | "labelOpacity" | "labelPadding" | "labelOverlap" | "labelSeparation" | "format" | "formatType" | "title" | "tickMinStep" | "zindex" | "encode" | "labelExpr" | "titleAngle" | "labels" | "labelAngle" | "translate" | "gridColor" | "gridDash" | "gridDashOffset" | "gridOpacity" | "gridWidth" | "tickColor" | "tickDash" | "tickDashOffset" | "tickOpacity" | "tickWidth" | "grid" | "labelFlush" | "minExtent" | "maxExtent" | "bandPosition" | "titleX" | "titleY" | "domainDash" | "domainDashOffset" | "domainColor" | "domainOpacity" | "domainWidth" | "tickBand" | "tickExtra" | "tickOffset" | "tickRound" | "tickSize" | "labelBound" | "labelFlushOffset" | "gridScale" | "position")[];
export declare class AxisComponent extends Split<AxisComponentProps> {
    readonly explicit: Partial<AxisComponentProps>;
    readonly implicit: Partial<AxisComponentProps>;
    mainExtracted: boolean;
    constructor(explicit?: Partial<AxisComponentProps>, implicit?: Partial<AxisComponentProps>, mainExtracted?: boolean);
    clone(): AxisComponent;
    hasAxisPart(part: AxisPart): boolean;
}
export interface AxisComponentIndex {
    x?: AxisComponent[];
    y?: AxisComponent[];
}
export interface AxisIndex {
    x?: Axis;
    y?: Axis;
}
//# sourceMappingURL=component.d.ts.map