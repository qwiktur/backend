import mongoose from 'mongoose';

export default {
    connect: async (url: string): Promise<void> => {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    },
    disconnect: async (): Promise<void> => {
        await mongoose.disconnect();
    }
}
