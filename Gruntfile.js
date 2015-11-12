module.exports = function (grunt) {

    require("json5/lib/require");
    require("time-grunt")(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        globalConfig: {}
    });

        // Load grunt configurations automatically
    require("load-grunt-config")(grunt, {
        jitGrunt: true,
        init: true,
        // data passed into config.  Can use with <%= key %>
        data: {}
    });

    grunt.registerTask("deploy", [
        "clean:dist",
        "concat-json:database",
        "copy:i18nToDist",
        "copy:rawToDist",
        "concat:dist",
        "concat:vendor",
        "minjson:dist",
        "minjson:distI18n",
        "deployHtml"
    ]);

    grunt.registerTask("finalDeploy", [
        "deploy",
        "uglify:dist"
    ]);
};