import {Kafka} from 'kafkajs'

const kafka = new Kafka({
    clientId: 'consumer',
    brokers: ['localhost:9092']
});

const topic = 'my-topic';
const groupId = 'my-group';

const consumer = kafka.consumer({groupId});

const run = async () => {
    await consumer.connect();
    await consumer.subscribe({topic, fromBeginning: true});

    // const timestamp = new Date.parse('2024-08-01T00:00:00.000Z'); // Replace with your desired timestamp
    // const partitions = await kafka.admin().fetchTopicOffsetsByTimestamp(topic, timestamp);
    // for (const { partition, offset } of partitions) {
    //     await consumer.seek({ topic, partition, offset });
    // }


    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            console.log({
                partition,
                offset: message.offset,
                value: message?.value?.toString(),
            });
        },
    });

    await consumer.seek({topic, partition: 0, offset: '0'})

};

run().catch(console.error);
