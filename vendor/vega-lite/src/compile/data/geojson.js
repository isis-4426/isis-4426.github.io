import { isString } from 'vega-util';
import { LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2, SHAPE } from '../../channel';
import { isValueDef } from '../../channeldef';
import { GEOJSON } from '../../type';
import { duplicate, hash } from '../../util';
import { DataFlowNode } from './dataflow';
export class GeoJSONNode extends DataFlowNode {
    constructor(parent, fields, geojson, signal) {
        super(parent);
        this.fields = fields;
        this.geojson = geojson;
        this.signal = signal;
    }
    clone() {
        return new GeoJSONNode(null, duplicate(this.fields), this.geojson, this.signal);
    }
    static parseAll(parent, model) {
        if (model.component.projection && !model.component.projection.isFit) {
            return parent;
        }
        let geoJsonCounter = 0;
        for (const coordinates of [
            [LONGITUDE, LATITUDE],
            [LONGITUDE2, LATITUDE2]
        ]) {
            const pair = coordinates.map(channel => model.channelHasField(channel)
                ? model.fieldDef(channel).field
                : isValueDef(model.encoding[channel])
                    ? { expr: model.encoding[channel].value + '' }
                    : undefined);
            if (pair[0] || pair[1]) {
                parent = new GeoJSONNode(parent, pair, null, model.getName(`geojson_${geoJsonCounter++}`));
            }
        }
        if (model.channelHasField(SHAPE)) {
            const fieldDef = model.fieldDef(SHAPE);
            if (fieldDef.type === GEOJSON) {
                parent = new GeoJSONNode(parent, null, fieldDef.field, model.getName(`geojson_${geoJsonCounter++}`));
            }
        }
        return parent;
    }
    dependentFields() {
        var _a;
        const fields = (_a = this.fields, (_a !== null && _a !== void 0 ? _a : [])).filter(isString);
        return new Set([...(this.geojson ? [this.geojson] : []), ...fields]);
    }
    producedFields() {
        return new Set();
    }
    hash() {
        return `GeoJSON ${this.geojson} ${this.signal} ${hash(this.fields)}`;
    }
    assemble() {
        return Object.assign(Object.assign(Object.assign({ type: 'geojson' }, (this.fields ? { fields: this.fields } : {})), (this.geojson ? { geojson: this.geojson } : {})), { signal: this.signal });
    }
}
//# sourceMappingURL=geojson.js.map