function ensureField(obj, field, value) {
    if (!(field in obj)) {
        obj[field] = value;
    }
}

function ensureFields(obj, pairs) {
    for (let [field, value] of Object.entries(pairs)) {
        ensureField(obj, field, value);
    }
}

module.exports = {
    ensureField,
    ensureFields,
}