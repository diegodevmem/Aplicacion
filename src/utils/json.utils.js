export function objectFindNestedKey(object, keys) {
    try {
        let formattedKeys = keys.replace(/\./g, "?.");
        formattedKeys = formattedKeys
            .split("?.")
            .map(key => (key.includes("-") ? `["${key}"]` : key))
            .join("?.");
        // console.log(formattedKeys);
        return eval(`object?.${formattedKeys}`);
    } catch (err) {
        return keys;
    }
}

"nel.nombre?.Allan?.apellido?.perez"