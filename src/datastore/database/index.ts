import mongoose from 'mongoose'

class Database {
    public mongoDriver
    public modelCollection
    constructor(databaseInfo, models) {
        this.mongoDriver = mongoose
        this.modelCollection = {}

        this.connect(databaseInfo)

        this.setup(models)
    }

    connect(databaseInfo) {
        this.mongoDriver.connect(`mongodb://${databaseInfo.host}:${databaseInfo.port}/${databaseInfo.databaseName}`, { useNewUrlParser: true }).then(() => console.log('Connected to MongoDB...')).catch((err) => console.error("Coudn't connect MongoDB....", err));
    }

    setup(models) {
        for (var key in models) {
            this.createModel(key, models[key])
        }
    }

    createModel(name, models) {
        const Schema = this.mongoDriver.Schema(models.schema)
        this.modelCollection[name] = new this.mongoDriver.model(name, Schema)
    }

    async insertData(name, data) {
        const newData = new this.modelCollection[name](data)

        await newData.save()
    }

}
module.exports = Database