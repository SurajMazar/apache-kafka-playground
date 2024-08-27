import {Kafka} from 'kafkajs'

const kafka = new Kafka({
    clientId: 'producer',
    brokers: ['localhost:9092']
})


const createKafkaTopic = async (topic: string) => {
    const admin = kafka.admin()
    await admin.connect()
    try {
        const existingTopics = await admin.listTopics();
        if (!existingTopics.includes(topic)) {
            await admin.createTopics({
                topics: [
                    {
                        topic: topic,
                        numPartitions: 1,
                        replicationFactor: 1,
                    }
                ]
            })
        }
    } catch (exception) {
        console.log(exception)
        process.exit(1)
    } finally {
        await admin.disconnect()
    }
}


const main = async () => {
    await createKafkaTopic('my-topic')
    const producer = await kafka.producer()

    await producer.connect()
    try {
        const result = await producer.send({
            topic: 'my-topic',
            messages: [
                {value: 'Hello from producer'}
            ],
        });

        console.log('Message sent:', result);

    } catch (exception) {
        console.log(exception)
        process.exit(1)
    } finally {
        await producer.disconnect()
    }
}

main()
