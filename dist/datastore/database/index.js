"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    constructor(databaseInfo, models) {
        this.mongoDriver = mongoose_1.default;
        this.modelCollection = {};
        this.connect(databaseInfo);
        this.setup(models);
    }
    connect(databaseInfo) {
        this.mongoDriver.connect(`mongodb://${databaseInfo.host}:${databaseInfo.port}/${databaseInfo.databaseName}`, { useNewUrlParser: true }).then(() => console.log('Connected to MongoDB...')).catch((err) => console.error("Coudn't connect MongoDB....", err));
    }
    setup(models) {
        for (var key in models) {
            this.createModel(key, models[key]);
        }
    }
    createModel(name, models) {
        const Schema = this.mongoDriver.Schema(models.schema);
        this.modelCollection[name] = new this.mongoDriver.model(name, Schema);
    }
    insertData(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newData = new this.modelCollection[name](data);
            yield newData.save();
        });
    }
}
module.exports = Database;
