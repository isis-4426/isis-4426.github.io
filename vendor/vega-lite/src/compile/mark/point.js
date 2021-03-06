import * as mixins from './mixins';
import * as ref from './valueref';
function encodeEntry(model, fixedShape) {
    const { config, width, height } = model;
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, mixins.baseEncodeEntry(model, {
        align: 'ignore',
        baseline: 'ignore',
        color: 'include',
        size: 'include',
        orient: 'ignore'
    })), mixins.pointPosition('x', model, ref.mid(width))), mixins.pointPosition('y', model, ref.mid(height))), mixins.nonPosition('size', model)), shapeMixins(model, config, fixedShape));
}
export function shapeMixins(model, config, fixedShape) {
    if (fixedShape) {
        return { shape: { value: fixedShape } };
    }
    return mixins.nonPosition('shape', model);
}
export const point = {
    vgMark: 'symbol',
    encodeEntry: (model) => {
        return encodeEntry(model);
    }
};
export const circle = {
    vgMark: 'symbol',
    encodeEntry: (model) => {
        return encodeEntry(model, 'circle');
    }
};
export const square = {
    vgMark: 'symbol',
    encodeEntry: (model) => {
        return encodeEntry(model, 'square');
    }
};
//# sourceMappingURL=point.js.map