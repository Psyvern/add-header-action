const core = require("@actions/core");
const github = require("@actions/github");
const fs = require("fs");
const minimatch = require("minimatch");
const recursive = require("recursive-readdir");

export const run = async () => {

    const header = fs.readFileSync(core.getInput("source"), "utf8");
    const filter = core.getInput("filter");

    const files = await recursive("", [(file, stats) => stats.isFile() && !minimatch(file.name, filter)]);

    for await (const file of files) {
        const contents = fs.readFileSync(file, "utf8");
        fs.writeFileSync(file, `${header}${contents}`);
        console.log("Added header", file);
    }
};

run()
.then(() => {})
.catch((error) => {
    console.error("ERROR", error);
    core.setFailed(error.message);
});