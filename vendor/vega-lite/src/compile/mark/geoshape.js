import { isFieldDef, vgField } from '../../channeldef';
import { GEOJSON } from '../../type';
import * as mixins from './mixins';
export const geoshape = {
    vgMark: 'shape',
    encodeEntry: (model) => {
        return Object.assign({}, mixins.baseEncodeEntry(model, {
            align: 'ignore',
            baseline: 'ignore',
            color: 'include',
            size: 'ignore',
            orient: 'ignore'
        }));
    },
    postEncodingTransform: (model) => {
        const { encoding } = model;
        const shapeDef = encoding.shape;
        const transform = Object.assign({ type: 'geoshape', projection: model.projectionName() }, (shapeDef && isFieldDef(shapeDef) && shapeDef.type === GEOJSON
            ? { field: vgField(shapeDef, { expr: 'datum' }) }
            : {}));
        return [transform];
    }
};
//# sourceMappingURL=geoshape.js.map