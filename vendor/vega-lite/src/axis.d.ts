import { Axis as VgAxis, AxisEncode, AxisOrient, BaseAxis, LabelOverlap } from 'vega';
import { ConditionalPredicate, Value, ValueDef } from './channeldef';
import { DateTime } from './datetime';
import { Guide, GuideEncodingEntry, VlOnlyGuideConfig } from './guide';
import { Flag } from './util';
import { ExcludeMappedValueRef, VgEncodeChannel } from './vega.schema';
export declare type BaseAxisNoSignals = AxisMixins & ExcludeMappedValueRef<BaseAxis>;
export declare type ConditionalAxisProp = 'labelAlign' | 'labelBaseline' | 'labelColor' | 'labelFont' | 'labelFontSize' | 'labelFontStyle' | 'labelFontWeight' | 'labelOpacity' | 'gridColor' | 'gridDash' | 'gridDashOffset' | 'gridOpacity' | 'gridWidth' | 'tickColor' | 'tickDash' | 'tickDashOffset' | 'tickOpacity' | 'tickWidth';
export declare const CONDITIONAL_AXIS_PROP_INDEX: {
    [prop in keyof BaseAxisNoSignals | ConditionalAxisProp]?: {
        part: keyof AxisEncode;
        vgProp: VgEncodeChannel;
    };
};
export declare type ConditionalAxisProperty<V extends Value | number[]> = ValueDef<V> & {
    condition: ConditionalPredicate<ValueDef<V>> | ConditionalPredicate<ValueDef<V>>[];
};
export declare function isConditionalAxisValue<V extends Value | number[]>(v: any): v is ConditionalAxisProperty<V>;
export declare type VgAxisConfigNoSignals = Omit<BaseAxisNoSignals, ConditionalAxisProp> & {
    [k in ConditionalAxisProp]?: BaseAxisNoSignals[k] | ConditionalAxisProperty<Exclude<BaseAxisNoSignals[k], undefined> | null>;
};
interface AxisMixins {
    /**
     * A boolean flag indicating if grid lines should be included as part of the axis
     *
     * __Default value:__ `true` for [continuous scales](https://vega.github.io/vega-lite/docs/scale.html#continuous) that are not binned; otherwise, `false`.
     */
    grid?: boolean;
    /**
     * Indicates if the first and last axis labels should be aligned flush with the scale range. Flush alignment for a horizontal axis will left-align the first label and right-align the last label. For vertical axes, bottom and top text baselines are applied instead. If this property is a number, it also indicates the number of pixels by which to offset the first and last labels; for example, a value of 2 will flush-align the first and last labels and also push them 2 pixels outward from the center of the axis. The additional adjustment can sometimes help the labels better visually group with corresponding axis ticks.
     *
     * __Default value:__ `true` for axis of a continuous x-scale. Otherwise, `false`.
     */
    labelFlush?: boolean | number;
    /**
     * The strategy to use for resolving overlap of axis labels. If `false` (the default), no overlap reduction is attempted. If set to `true` or `"parity"`, a strategy of removing every other label is used (this works well for standard linear axes). If set to `"greedy"`, a linear scan of the labels is performed, removing any labels that overlaps with the last visible label (this often works better for log-scaled axes).
     *
     * __Default value:__ `true` for non-nominal fields with non-log scales; `"greedy"` for log scales; otherwise `false`.
     */
    labelOverlap?: LabelOverlap;
}
export interface AxisOrientMixins {
    /**
     * The orientation of the axis. One of `"top"`, `"bottom"`, `"left"` or `"right"`. The orientation can be used to further specialize the axis type (e.g., a y-axis oriented towards the right edge of the chart).
     *
     * __Default value:__ `"bottom"` for x-axes and `"left"` for y-axes.
     */
    orient?: AxisOrient;
}
export declare type AxisConfig = VlOnlyGuideConfig & AxisOrientMixins & VgAxisConfigNoSignals;
export interface Axis extends AxisOrientMixins, VgAxisConfigNoSignals, Guide {
    /**
     * [Vega expression](https://vega.github.io/vega/docs/expressions/) for customizing labels.
     *
     * __Note:__ The label text and value can be assessed via the `label` and `value` properties of the axis's backing `datum` object.
     */
    labelExpr?: string;
    /**
     * The offset, in pixels, by which to displace the axis from the edge of the enclosing group or data rectangle.
     *
     * __Default value:__ derived from the [axis config](https://vega.github.io/vega-lite/docs/config.html#facet-scale-config)'s `offset` (`0` by default)
     */
    offset?: number;
    /**
     * The anchor position of the axis in pixels. For x-axes with top or bottom orientation, this sets the axis group x coordinate. For y-axes with left or right orientation, this sets the axis group y coordinate.
     *
     * __Default value__: `0`
     */
    position?: number;
    /**
     * A desired number of ticks, for axes visualizing quantitative scales. The resulting number may be different so that values are "nice" (multiples of 2, 5, 10) and lie within the underlying scale's range.
     * @minimum 0
     *
     * __Default value__: Determine using a formula `ceil(width/40)` for x and `ceil(height/40)` for y.
     */
    tickCount?: number;
    /**
     * The minimum desired step between axis ticks, in terms of scale domain values. For example, a value of `1` indicates that ticks should not be less than 1 unit apart. If `tickMinStep` is specified, the `tickCount` value will be adjusted, if necessary, to enforce the minimum step value.
     *
     * __Default value__: `undefined`
     */
    tickMinStep?: number;
    /**
     * Explicitly set the visible axis tick values.
     */
    values?: number[] | string[] | boolean[] | DateTime[];
    /**
     * A non-negative integer indicating the z-index of the axis.
     * If zindex is 0, axes should be drawn behind all chart elements.
     * To put them in front, set `zindex` to `1` or more.
     *
     * __Default value:__ `0` (behind the marks).
     *
     * @TJS-type integer
     * @minimum 0
     */
    zindex?: number;
    /**
     * Mark definitions for custom axis encoding.
     *
     * @hidden
     */
    encoding?: AxisEncoding;
}
export declare type AxisPart = keyof AxisEncoding;
export declare const AXIS_PARTS: AxisPart[];
/**
 * A dictionary listing whether a certain axis property is applicable for only main axes or only grid axes.
 * (Properties not listed are applicable for both)
 */
export declare const AXIS_PROPERTY_TYPE: {
    [k in keyof VgAxis]: 'main' | 'grid' | 'both';
};
export interface AxisEncoding {
    /**
     * Custom encoding for the axis container.
     */
    axis?: GuideEncodingEntry;
    /**
     * Custom encoding for the axis domain rule mark.
     */
    domain?: GuideEncodingEntry;
    /**
     * Custom encoding for axis gridline rule marks.
     */
    grid?: GuideEncodingEntry;
    /**
     * Custom encoding for axis label text marks.
     */
    labels?: GuideEncodingEntry;
    /**
     * Custom encoding for axis tick rule marks.
     */
    ticks?: GuideEncodingEntry;
    /**
     * Custom encoding for the axis title text mark.
     */
    title?: GuideEncodingEntry;
}
export declare const COMMON_AXIS_PROPERTIES_INDEX: Flag<keyof (VgAxis | Axis)>;
export declare function isAxisProperty(prop: string): prop is keyof Axis;
export declare const AXIS_PROPERTIES: ("values" | "domain" | "encoding" | "orient" | "ticks" | "tickCount" | "offset" | "titleAlign" | "titleAnchor" | "titleBaseline" | "titleColor" | "titleFont" | "titleFontSize" | "titleFontStyle" | "titleFontWeight" | "titleLimit" | "titleLineHeight" | "titleOpacity" | "titlePadding" | "labelAlign" | "labelBaseline" | "labelColor" | "labelFont" | "labelFontSize" | "labelFontStyle" | "labelFontWeight" | "labelLimit" | "labelOpacity" | "labelPadding" | "labelOverlap" | "labelSeparation" | "format" | "formatType" | "title" | "tickMinStep" | "zindex" | "labelExpr" | "titleAngle" | "labels" | "labelAngle" | "translate" | "gridColor" | "gridDash" | "gridDashOffset" | "gridOpacity" | "gridWidth" | "tickColor" | "tickDash" | "tickDashOffset" | "tickOpacity" | "tickWidth" | "grid" | "labelFlush" | "minExtent" | "maxExtent" | "bandPosition" | "titleX" | "titleY" | "domainDash" | "domainDashOffset" | "domainColor" | "domainOpacity" | "domainWidth" | "tickBand" | "tickExtra" | "tickOffset" | "tickRound" | "tickSize" | "labelBound" | "labelFlushOffset" | "position")[];
export interface AxisConfigMixins {
    /**
     * Axis configuration, which determines default properties for all `x` and `y` [axes](https://vega.github.io/vega-lite/docs/axis.html). For a full list of axis configuration options, please see the [corresponding section of the axis documentation](https://vega.github.io/vega-lite/docs/axis.html#config).
     */
    axis?: AxisConfig;
    /**
     * X-axis specific config.
     */
    axisX?: AxisConfig;
    /**
     * Y-axis specific config.
     */
    axisY?: AxisConfig;
    /**
     * Specific axis config for y-axis along the left edge of the chart.
     */
    axisLeft?: AxisConfig;
    /**
     * Specific axis config for y-axis along the right edge of the chart.
     */
    axisRight?: AxisConfig;
    /**
     * Specific axis config for x-axis along the top edge of the chart.
     */
    axisTop?: AxisConfig;
    /**
     * Specific axis config for x-axis along the bottom edge of the chart.
     */
    axisBottom?: AxisConfig;
    /**
     * Specific axis config for axes with "band" scales.
     */
    axisBand?: AxisConfig;
}
export {};
//# sourceMappingURL=axis.d.ts.map