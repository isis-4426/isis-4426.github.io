import { Color } from 'vega';
import { Gradient, Value } from './channeldef';
import { CompositeMark, CompositeMarkDef } from './compositemark';
import { BaseMarkConfig } from './vega.schema';
export declare const AREA: 'area';
export declare const BAR: 'bar';
export declare const IMAGE: 'image';
export declare const LINE: 'line';
export declare const POINT: 'point';
export declare const RECT: 'rect';
export declare const RULE: 'rule';
export declare const TEXT: 'text';
export declare const TICK: 'tick';
export declare const TRAIL: 'trail';
export declare const CIRCLE: 'circle';
export declare const SQUARE: 'square';
export declare const GEOSHAPE: 'geoshape';
/**
 * All types of primitive marks.
 */
export declare type Mark = typeof AREA | typeof BAR | typeof LINE | typeof IMAGE | typeof TRAIL | typeof POINT | typeof TEXT | typeof TICK | typeof RECT | typeof RULE | typeof CIRCLE | typeof SQUARE | typeof GEOSHAPE;
export declare function isMark(m: string): m is Mark;
export declare function isPathMark(m: Mark | CompositeMark): m is 'line' | 'area' | 'trail';
export declare function isRectBasedMark(m: Mark | CompositeMark): m is 'rect' | 'bar' | 'image';
export declare const PRIMITIVE_MARKS: Mark[];
export interface ColorMixins {
    /**
     * Default color.
     *
     * __Default value:__ <span style="color: #4682b4;">&#9632;</span> `"#4682b4"`
     *
     * __Note:__
     * - This property cannot be used in a [style config](https://vega.github.io/vega-lite/docs/mark.html#style-config).
     * - The `fill` and `stroke` properties have higher precedence than `color` and will override `color`.
     */
    color?: Color | Gradient;
}
export interface TooltipContent {
    content: 'encoding' | 'data';
}
/** @hidden */
export declare type Hide = 'hide';
export interface MarkConfig extends ColorMixins, BaseMarkConfig {
    /**
     * Whether the mark's color should be used as fill color instead of stroke color.
     *
     * __Default value:__ `false` for all `point`, `line`, and `rule` marks as well as `geoshape` marks for [`graticule`](https://vega.github.io/vega-lite/docs/data.html#graticule) data sources; otherwise, `true`.
     *
     * __Note:__ This property cannot be used in a [style config](https://vega.github.io/vega-lite/docs/mark.html#style-config).
     *
     */
    filled?: boolean;
    /**
     * The tooltip text string to show upon mouse hover or an object defining which fields should the tooltip be derived from.
     *
     * - If `tooltip` is `true` or `{"content": "encoding"}`, then all fields from `encoding` will be used.
     * - If `tooltip` is `{"content": "data"}`, then all fields that appear in the highlighted data point will be used.
     * - If set to `null` or `false`, then no tooltip will be used.
     *
     * See the [`tooltip`](https://vega.github.io/vega-lite/docs/tooltip.html) documentation for a detailed discussion about tooltip  in Vega-Lite.
     *
     * __Default value:__ `null`
     */
    tooltip?: Value | TooltipContent | null;
    /**
     * Default size for marks.
     * - For `point`/`circle`/`square`, this represents the pixel area of the marks. For example: in the case of circles, the radius is determined in part by the square root of the size value.
     * - For `bar`, this represents the band size of the bar, in pixels.
     * - For `text`, this represents the font size, in pixels.
     *
     * __Default value:__
     * - `30` for point, circle, square marks; width/height's `step`
     * - `2` for bar marks with discrete dimensions;
     * - `5` for bar marks with continuous dimensions;
     * - `11` for text marks.
     *
     * @minimum 0
     */
    size?: number;
    /**
     * For line and trail marks, this `order` property can be set to `null` or `false` to make the lines use the original order in the data sources.
     */
    order?: null | boolean;
    /**
     * Defines how Vega-Lite should handle marks for invalid values (`null` and `NaN`).
     * - If set to `"filter"` (default), all data items with null values will be skipped (for line, trail, and area marks) or filtered (for other marks).
     * - If `null`, all data items are included. In this case, invalid values will be interpreted as zeroes.
     */
    invalid?: 'filter' | Hide | null;
    /**
     * Default relative band position for a time unit. If set to `0`, the marks will be positioned at the beginning of the time unit band step.
     * If set to `0.5`, the marks will be positioned in the middle of the time unit band step.
     */
    timeUnitBandPosition?: number;
    /**
     * Default relative band size for a time unit. If set to `1`, the bandwidth of the marks will be equal to the time unit band step.
     * If set to `0.5`, bandwidth of the marks will be half of the time unit band step.
     */
    timeUnitBand?: number;
}
export interface RectBinSpacingMixins {
    /**
     * Offset between bars for binned field. The ideal value for this is either 0 (preferred by statisticians) or 1 (Vega-Lite default, D3 example style).
     *
     * __Default value:__ `1`
     *
     * @minimum 0
     */
    binSpacing?: number;
}
export declare type AnyMark = CompositeMark | CompositeMarkDef | Mark | MarkDef;
export declare function isMarkDef(mark: string | GenericMarkDef<any>): mark is GenericMarkDef<any>;
export declare function isPrimitiveMark(mark: AnyMark): mark is Mark;
export declare const STROKE_CONFIG: readonly ["stroke", "strokeWidth", "strokeDash", "strokeDashOffset", "strokeOpacity", "strokeJoin", "strokeMiterLimit"];
export declare const FILL_CONFIG: readonly ["fill", "fillOpacity"];
export declare const FILL_STROKE_CONFIG: ("stroke" | "fill" | "fillOpacity" | "strokeOpacity" | "strokeWidth" | "strokeDash" | "strokeDashOffset" | "strokeMiterLimit" | "strokeJoin")[];
export declare const VL_ONLY_MARK_CONFIG_PROPERTIES: (keyof MarkConfig)[];
export declare const VL_ONLY_MARK_SPECIFIC_CONFIG_PROPERTY_INDEX: {
    [k in Mark]?: (keyof Required<MarkConfigMixins>[k])[];
};
export declare const defaultMarkConfig: MarkConfig;
export interface MarkConfigMixins {
    /** Mark Config */
    mark?: MarkConfig;
    /** Area-Specific Config */
    area?: AreaConfig;
    /** Bar-Specific Config */
    bar?: RectConfig;
    /** Circle-Specific Config */
    circle?: MarkConfig;
    /** Image-specific Config */
    image?: RectConfig;
    /** Line-Specific Config */
    line?: LineConfig;
    /** Point-Specific Config */
    point?: MarkConfig;
    /** Rect-Specific Config */
    rect?: RectConfig;
    /** Rule-Specific Config */
    rule?: MarkConfig;
    /** Square-Specific Config */
    square?: MarkConfig;
    /** Text-Specific Config */
    text?: TextConfig;
    /** Tick-Specific Config */
    tick?: TickConfig;
    /** Trail-Specific Config */
    trail?: LineConfig;
    /** Geoshape-Specific Config */
    geoshape?: MarkConfig;
}
export interface RectConfig extends RectBinSpacingMixins, MarkConfig {
    /**
     * The default size of the bars on continuous scales.
     *
     * __Default value:__ `5`
     *
     * @minimum 0
     */
    continuousBandSize?: number;
    /**
     * The default size of the bars with discrete dimensions. If unspecified, the default size is  `step-2`, which provides 2 pixel offset between bars.
     * @minimum 0
     */
    discreteBandSize?: number;
}
export declare type OverlayMarkDef = MarkConfig & MarkDefMixins;
export interface PointOverlayMixins {
    /**
     * A flag for overlaying points on top of line or area marks, or an object defining the properties of the overlayed points.
     *
     * - If this property is `"transparent"`, transparent points will be used (for enhancing tooltips and selections).
     *
     * - If this property is an empty object (`{}`) or `true`, filled points with default properties will be used.
     *
     * - If this property is `false`, no points would be automatically added to line or area marks.
     *
     * __Default value:__ `false`.
     */
    point?: boolean | OverlayMarkDef | 'transparent';
}
export interface LineConfig extends MarkConfig, PointOverlayMixins {
}
export interface LineOverlayMixins {
    /**
     * A flag for overlaying line on top of area marks, or an object defining the properties of the overlayed lines.
     *
     * - If this value is an empty object (`{}`) or `true`, lines with default properties will be used.
     *
     * - If this value is `false`, no lines would be automatically added to area marks.
     *
     * __Default value:__ `false`.
     */
    line?: boolean | OverlayMarkDef;
}
export interface AreaConfig extends MarkConfig, PointOverlayMixins, LineOverlayMixins {
}
export interface TickThicknessMixins {
    /**
     * Thickness of the tick mark.
     *
     * __Default value:__  `1`
     *
     * @minimum 0
     */
    thickness?: number;
}
export interface GenericMarkDef<M> {
    /**
     * The mark type. This could a primitive mark type
     * (one of `"bar"`, `"circle"`, `"square"`, `"tick"`, `"line"`,
     * `"area"`, `"point"`, `"geoshape"`, `"rule"`, and `"text"`)
     * or a composite mark type (`"boxplot"`, `"errorband"`, `"errorbar"`).
     */
    type: M;
}
export interface MarkDefMixins {
    /**
     * A string or array of strings indicating the name of custom styles to apply to the mark. A style is a named collection of mark property defaults defined within the [style configuration](https://vega.github.io/vega-lite/docs/mark.html#style-config). If style is an array, later styles will override earlier styles. Any [mark properties](https://vega.github.io/vega-lite/docs/encoding.html#mark-prop) explicitly defined within the `encoding` will override a style default.
     *
     * __Default value:__ The mark's name. For example, a bar mark will have style `"bar"` by default.
     * __Note:__ Any specified style will augment the default style. For example, a bar mark with `"style": "foo"` will receive from `config.style.bar` and `config.style.foo` (the specified style `"foo"` has higher precedence).
     */
    style?: string | string[];
    /**
     * Whether a mark be clipped to the enclosing group’s width and height.
     */
    clip?: boolean;
    /**
     * Offset for x-position.
     */
    xOffset?: number;
    /**
     * Offset for y-position.
     */
    yOffset?: number;
    /**
     * Offset for x2-position.
     */
    x2Offset?: number;
    /**
     * Offset for y2-position.
     */
    y2Offset?: number;
}
export interface MarkDef<M extends string | Mark = Mark> extends GenericMarkDef<M>, RectBinSpacingMixins, MarkConfig, PointOverlayMixins, LineOverlayMixins, TickThicknessMixins, MarkDefMixins {
}
export declare const defaultBarConfig: RectConfig;
export declare const defaultRectConfig: RectConfig;
export interface TextConfig extends MarkConfig {
    /**
     * Whether month names and weekday names should be abbreviated.
     */
    shortTimeLabels?: boolean;
}
export interface TickConfig extends MarkConfig, TickThicknessMixins {
    /**
     * The width of the ticks.
     *
     * __Default value:__  3/4 of step (width step for horizontal ticks and height step for vertical ticks).
     * @minimum 0
     */
    bandSize?: number;
}
export declare const defaultTickConfig: TickConfig;
export declare function getMarkType(m: string | GenericMarkDef<any>): any;
//# sourceMappingURL=mark.d.ts.map