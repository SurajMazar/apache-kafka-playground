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
    clientId: 'consumer',
    brokers: ['localhost:9092']
});
const topic = 'my-topic';
const groupId = 'my-group';
const consumer = kafka.consumer({ groupId });
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    yield consumer.connect();
    yield consumer.subscribe({ topic, fromBeginning: true });
    // const timestamp = new Date.parse('2024-08-01T00:00:00.000Z'); // Replace with your desired timestamp
    // const partitions = await kafka.admin().fetchTopicOffsetsByTimestamp(topic, timestamp);
    // for (const { partition, offset } of partitions) {
    //     await consumer.seek({ topic, partition, offset });
    // }
    yield consumer.run({
        eachMessage: (_a) => __awaiter(void 0, [_a], void 0, function* ({ topic, partition, message }) {
            var _b;
            console.log({
                partition,
                offset: message.offset,
                value: (_b = message === null || message === void 0 ? void 0 : message.value) === null || _b === void 0 ? void 0 : _b.toString(),
            });
        }),
    });
    yield consumer.seek({ topic, partition: 0, offset: '0' });
});
run().catch(console.error);
