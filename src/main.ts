import { NestFactory } from '@nestjs/core';
import { AppModule } from '@src/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const port = parseInt(process.env.PORT) | 3000;
    const app = await NestFactory.create(AppModule, { cors: true });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(port, () => console.log(`Listening in port ${port}`));
}
bootstrap();
