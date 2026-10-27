import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtenemos el equivalente a __dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Injectable()
export class FilesService {

    getStaticProductImage(imageName: string) {
        
        const path = join(__dirname, '../../static/uploads', imageName);

        if (!existsSync(path)) {
            throw new BadRequestException(`No product image found with name: ${imageName}`);
        }

        return path;
    }
}
