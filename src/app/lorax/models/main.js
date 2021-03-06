define([
    'lodash',
    'lorax/models/topic'
], function (
    _,
    TopicModel
) {
    'use strict';

    var MainModel = function (data, localeData, infographicData) {
        this._tags = [];
        this._topics = [];
        this._modals = localeData.modals;
        this._miscLocale = localeData.misc;

        for (var idxTopic in data.topics) {
            this._topics.push(new TopicModel(
                idxTopic,
                data.topics[idxTopic],
                this._tags,
                localeData.topics[idxTopic],
                infographicData,
                localeData
            ));
        }
    };

    MainModel.prototype.getTopics = function () {
        return this._topics;
    };

    MainModel.prototype.getIssues = function () {
        return _.reduce(this._topics, function (result, item) {
            result = result.concat(item.getIssues());
            return result;
        }, []);
    };

    MainModel.prototype.getTopicById = function (id) {
        return _.find(this.getTopics(), function (topic) {
            return topic._id === id;
        });
    };

    MainModel.prototype.getIssueById = function (id) {
        return _.find(this.getIssues(), function (issue) {
            return issue._id === id;
        });
    };

    MainModel.prototype.getTagByURLId = function (id) {
        return _.find(this.getTags(), function (tag) {
            return tag.getURLId() === id;
        });
    };

    MainModel.prototype.getTags = function () {
        return this._tags;
    };

    MainModel.prototype.getModals = function () {
        return this._modals;
    };

    MainModel.prototype.getMiscLocale = function () {
        return this._miscLocale;
    };

    return MainModel;
});

