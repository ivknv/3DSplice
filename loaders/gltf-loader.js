module.exports = (source) => {
    const gltf = JSON.parse(source);

    // Remove unnecessary whitespace
    let output = JSON.stringify(gltf);
    output = output.replaceAll("\\", "\\\\").replaceAll("'", "\\'");

    output = "export default '" + output + "';";

    return output;
};
