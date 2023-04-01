module.exports = (source) => {
    const gltf = JSON.parse(source);

    // Remove unnecessary whitespace
    let output = JSON.stringify(gltf);
    output = output.replaceAll("\\", "\\\\").replaceAll("'", "\\'");

    const variable = "Model";

    output = "const " + variable + " = '" + output + "';\nexport default " + variable + ";";

    return output;
}
