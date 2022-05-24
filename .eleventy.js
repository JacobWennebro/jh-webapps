module.exports = eleventyConfig => {

    eleventyConfig.addPassthroughCopy("./src/img");

    return {
        dir: {
            input: "src",
            output: "docs"
        }
    }
}