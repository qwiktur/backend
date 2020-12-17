import { ImageModel } from './model/image';

import jimp from 'jimp';

export default class ImageManager {

    public readonly image: ImageModel;
    private obj: jimp;

    public constructor(img: ImageModel) {
        this.image = img;
        this.obj = null;
    }

    public async load(): Promise<void> {
        this.obj = await jimp.read(this.image.src);
    }

    public blur(blur: number = 30): void {
        if (blur > 0) {
            this.obj.blur(blur);
        }
    }

    public async write(path: string): Promise<void> {
        await this.obj.writeAsync(path);
    }

    public async toBase64(mime?: string): Promise<string> {
        return await this.obj.getBase64Async(mime != null ? mime : this.obj.getMIME());
    }
}
