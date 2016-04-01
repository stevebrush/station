(function () {
    'use strict';

    function DatabaseTemplate(options) {
        var that;
        that = this;
        if (options.name.indexOf(">") === 0) {
            that.defaults = that.constructor.static.getTemplateValues(options.name);
            options.name = that.defaults.name;
        }
    }

    DatabaseTemplate.static = DatabaseTemplate.static || {};

    DatabaseTemplate.static.getTemplateValues = function (slug) {
        var template,
            obj;

        template = this.templates[slug.replace(">", "")];
        obj = template.toObject();
        obj.onCreate = template.onCreate;
        obj.prototypeId = obj._id;

        return obj;
    };

    DatabaseTemplate.static.template = function (name, options) {
        var template;
        options = options || {};
        template = new this.templateModel(options);
        template.onCreate = options.onCreate;
        this.templates[name] = template;
        return this;
    };

    DatabaseTemplate.static.templates = {};
    DatabaseTemplate.static.templateModel = undefined;

    module.exports = DatabaseTemplate;
}());
