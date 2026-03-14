const amqp = require('amqplib');

let connection;
let channel;

/**
 * Connects to RabbitMQ and returns the channel.
 * Implements a singleton pattern to reuse the connection and channel.
 */
async function getChannel() {
    if (channel) return channel;

    try {
        const rabbitmqUri = process.env.RABBITMQ_URI;
        if (!rabbitmqUri) {
            throw new Error('RABBITMQ_URI is not defined in environment variables');
        }

        connection = await amqp.connect(rabbitmqUri);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ');

        // Handle connection closure
        connection.on('close', () => {
            console.warn('RabbitMQ connection closed');
            connection = null;
            channel = null;
        });

    } catch (error) {
        console.error('Failed to connect to RabbitMQ:', error);
        throw error;
    }

    return channel;
}

/**
 * Publishes a message to a specific queue.
 * @param {string} queue - The name of the queue.
 * @param {Object} data - The data to be sent (will be JSON stringified).
 */
async function publishMessage(queue, data) {
    try {
        const ch = await getChannel();
        await ch.assertQueue(queue, { durable: true });
        ch.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
        console.log(`Message published to queue: ${queue}`);
    } catch (error) {
        console.error(`Error publishing to queue ${queue}:`, error);
        throw error;
    }
}

/**
 * Subscribes to a specific queue and executes a callback for each message.
 * @param {string} queue - The name of the queue.
 * @param {Function} callback - The function to execute with the message data.
 */
async function consumeMessage(queue, callback) {
    try {
        const ch = await getChannel();
        await ch.assertQueue(queue, { durable: true });
        
        console.log(`Subscribed to queue: ${queue}`);
        
        ch.consume(queue, (msg) => {
            if (msg !== null) {
                const content = JSON.parse(msg.content.toString());
                callback(content);
                ch.ack(msg);
            }
        });
    } catch (error) {
        console.error(`Error subscribing to queue ${queue}:`, error);
        throw error;
    }
}

module.exports = {
    getChannel,
    publishMessage,
    consumeMessage
};
