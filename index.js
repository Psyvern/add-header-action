const core = require("@actions/core");
const github = require("@actions/github");
const glob = require("@actions/glob");
const fs = require("fs");

const run = async () => {

    const header = fs.readFileSync(core.getInput("source"), "utf8");
    const prefix = core.getInput("prefix");
    const suffix = core.getInput("suffix");
    const globber = await glob.create(core.getMultilineInput("filter").join("\n"));

    for await (const file of globber.globGenerator()) {
        const contents = fs.readFileSync(file, "utf8");
        fs.writeFileSync(file, `${prefix}${header}${suffix}${contents}`);
        console.log("Added header:", file);
    }
};

run()
.then(() => {})
.catch((error) => {
    console.error("ERROR", error);
    core.setFailed(error.message);
});