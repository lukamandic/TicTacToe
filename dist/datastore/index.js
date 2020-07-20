"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Datastore {
    constructor() {
        this.history = [];
    }
    insertInHistory(data) {
        this.history.push(data);
    }
    lastGameId() {
        const group = this.history.reduce((r, a) => {
            r[a.id] = [...r[a.id] || [], a];
            return r;
        }, {});
        const keys = Object.keys(group);
        const greatestId = keys.reduce((p, v) => {
            return (p > v ? p : v);
        });
        return Number(greatestId);
    }
    lastVersionId() {
        const group = this.history.reduce((r, a) => {
            r[a.v] = [...r[a.v] || [], a];
            return r;
        }, {});
        const found = Object.keys(group);
        const greatestVersion = found.reduce((p, v) => {
            return (p > v ? p : v);
        });
        return Number(greatestVersion);
    }
    groupHistoryDataById(id) {
        let group = this.history.reduce((r, a) => {
            r[a.id] = [...r[a.id] || [], a];
            return r;
        }, {});
        let index = id.toString();
        return group[index];
    }
}
exports.Datastore = Datastore;
