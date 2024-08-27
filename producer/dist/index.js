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
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: 'producer',
    brokers: ['localhost:9092']
});
const createKafkaTopic = (topic) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = kafka.admin();
    yield admin.connect();
    try {
        const existingTopics = yield admin.listTopics();
        if (!existingTopics.includes(topic)) {
            yield admin.createTopics({
                topics: [
                    {
                        topic: topic,
                        numPartitions: 1,
                        replicationFactor: 1,
                    }
                ]
            });
        }
    }
    catch (exception) {
        console.log(exception);
        process.exit(1);
    }
    finally {
        yield admin.disconnect();
    }
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield createKafkaTopic('my-topic');
    const producer = yield kafka.producer();
    yield producer.connect();
    try {
        const result = yield producer.send({
            topic: 'my-topic',
            messages: [
                { value: 'Hello from producer' }
            ],
        });
        console.log('Message sent:', result);
    }
    catch (exception) {
        console.log(exception);
        process.exit(1);
    }
    finally {
        yield producer.disconnect();
    }
});
main();
