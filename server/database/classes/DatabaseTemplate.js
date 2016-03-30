(function () {
    'use strict';

    function DatabaseTemplate(options) {
        var that;
        that = this;
        that.template = options.template;
    }

    DatabaseTemplate.static = DatabaseTemplate.static || {};

    DatabaseTemplate.static.getTemplateValues = function (slug) {
        var template,
            obj;

        template = DatabaseTemplate.static.templates[slug.replace(">", "")];
        obj = template.toObject();

        obj.onCreate = template.onCreate;
        obj.prototypeId = obj._id;

        return obj;
    };

    DatabaseTemplate.static.template = function (name, options) {
        var template;
        template = new this.template(options);
        template.onCreate = options.onCreate;
        DatabaseTemplate.static.templates[name] = template;
        return DatabaseTemplate.static;
    };

    Character.static.templates = {};

    module.exports = DatabaseTemplate;
}());
